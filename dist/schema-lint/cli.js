#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// ─── SQL Parsing ─────────────────────────────────────────────────────────────
/**
 * Extracts individual CREATE TABLE blocks from a SQL file.
 * Handles nested parentheses correctly.
 */
function extractTableBlocks(sql) {
    const tables = new Map();
    // Strip single-line comments
    const cleaned = sql.replace(/--[^\n]*/g, '');
    const parts = cleaned.split(/CREATE\s+TABLE\s+/i);
    for (let i = 1; i < parts.length; i++) {
        const nameMatch = parts[i].match(/^`?(\w+)`?\s*\(/);
        if (!nameMatch)
            continue;
        const tableName = nameMatch[1];
        // Walk through characters to find the matching closing parenthesis
        let depth = 0;
        let endIndex = 0;
        const startIndex = parts[i].indexOf('(');
        for (let j = startIndex; j < parts[i].length; j++) {
            if (parts[i][j] === '(')
                depth++;
            else if (parts[i][j] === ')') {
                depth--;
                if (depth === 0) {
                    endIndex = j;
                    break;
                }
            }
        }
        // Grab everything up to and including the semicolon
        const semiIndex = parts[i].indexOf(';', endIndex);
        const block = 'CREATE TABLE ' + parts[i].substring(0, semiIndex + 1);
        tables.set(tableName, block);
    }
    return tables;
}
// ─── Lint Rules ──────────────────────────────────────────────────────────────
function checkEngine(table, block) {
    if (/ENGINE\s*=\s*InnoDB/i.test(block))
        return null;
    return {
        severity: 'ERROR',
        table,
        rule: 'missing-engine',
        message: 'Missing ENGINE=InnoDB — foreign key constraints require the InnoDB storage engine.',
    };
}
function checkCharset(table, block) {
    if (/DEFAULT\s+CHARSET\s*=\s*utf8mb4/i.test(block))
        return null;
    return {
        severity: 'WARNING',
        table,
        rule: 'missing-charset',
        message: 'Missing DEFAULT CHARSET=utf8mb4 — utf8mb4 supports all Unicode characters including emoji.',
    };
}
function checkPrimaryKey(table, block) {
    if (/PRIMARY\s+KEY/i.test(block))
        return null;
    return {
        severity: 'ERROR',
        table,
        rule: 'missing-pk',
        message: 'No PRIMARY KEY defined — every table should have a primary key.',
    };
}
function checkAutoIncrement(table, block) {
    // Only flag if there IS a PK but no AUTO_INCREMENT anywhere in the block
    if (!/PRIMARY\s+KEY/i.test(block))
        return null;
    if (/AUTO_INCREMENT/i.test(block))
        return null;
    // Composite PKs (junction tables) legitimately skip AUTO_INCREMENT
    const compositePK = /PRIMARY\s+KEY\s*\([^)]+,[^)]+\)/i.test(block);
    if (compositePK)
        return null;
    return {
        severity: 'INFO',
        table,
        rule: 'missing-auto-increment',
        message: 'Surrogate primary key without AUTO_INCREMENT — add AUTO_INCREMENT unless this is an intentional natural key.',
    };
}
function checkUnnamedConstraints(table, block) {
    const totalFKs = (block.match(/FOREIGN\s+KEY/gi) ?? []).length;
    const namedFKs = (block.match(/CONSTRAINT\s+`?\w+`?\s+FOREIGN\s+KEY/gi) ?? []).length;
    const unnamed = totalFKs - namedFKs;
    if (unnamed === 0)
        return null;
    return {
        severity: 'WARNING',
        table,
        rule: 'unnamed-constraint',
        message: `${unnamed} unnamed FOREIGN KEY constraint(s) — always name constraints explicitly for easier debugging.`,
    };
}
function checkFKNaming(table, block) {
    const issues = [];
    const matches = block.matchAll(/CONSTRAINT\s+`?(\w+)`?\s+FOREIGN\s+KEY/gi);
    for (const match of matches) {
        if (!match[1].toLowerCase().startsWith('fk_')) {
            issues.push({
                severity: 'WARNING',
                table,
                rule: 'fk-naming',
                message: `FK constraint '${match[1]}' should use the 'fk_tablename_columnname' naming convention.`,
            });
        }
    }
    return issues;
}
function checkPKNaming(table, block) {
    const match = block.match(/CONSTRAINT\s+`?(\w+)`?\s+PRIMARY\s+KEY/i);
    if (!match)
        return null;
    if (match[1].toLowerCase().startsWith('pk_'))
        return null;
    return {
        severity: 'INFO',
        table,
        rule: 'pk-naming',
        message: `PK constraint '${match[1]}' should use the 'pk_tablename' naming convention.`,
    };
}
function checkFKIndexes(table, block) {
    const issues = [];
    // Collect all indexed columns
    const indexedColumns = new Set();
    for (const match of block.matchAll(/INDEX\s+`?\w+`?\s*\(\s*`?(\w+)`?\s*\)/gi)) {
        indexedColumns.add(match[1].toLowerCase());
    }
    // Check each FK column
    for (const match of block.matchAll(/FOREIGN\s+KEY\s*\(\s*`?(\w+)`?\s*\)/gi)) {
        const col = match[1];
        if (!indexedColumns.has(col.toLowerCase())) {
            issues.push({
                severity: 'WARNING',
                table,
                rule: 'missing-fk-index',
                message: `FK column '${col}' has no INDEX — add INDEX \`idx_${table.toLowerCase()}_${col.toLowerCase()}\` (\`${col}\`) for better JOIN performance.`,
            });
        }
    }
    return issues;
}
// ─── Runner ──────────────────────────────────────────────────────────────────
function lintTable(table, block) {
    return [
        checkEngine(table, block),
        checkCharset(table, block),
        checkPrimaryKey(table, block),
        checkAutoIncrement(table, block),
        checkUnnamedConstraints(table, block),
        checkPKNaming(table, block),
        ...checkFKNaming(table, block),
        ...checkFKIndexes(table, block),
    ].filter((issue) => issue !== null);
}
function lintFile(filePath) {
    const sql = fs.readFileSync(filePath, 'utf-8');
    const tables = extractTableBlocks(sql);
    const allIssues = [];
    for (const [tableName, block] of tables) {
        allIssues.push(...lintTable(tableName, block));
    }
    return {
        file: filePath,
        tablesAnalyzed: tables.size,
        issues: allIssues,
        errorCount: allIssues.filter(i => i.severity === 'ERROR').length,
        warningCount: allIssues.filter(i => i.severity === 'WARNING').length,
        infoCount: allIssues.filter(i => i.severity === 'INFO').length,
    };
}
// ─── Output ──────────────────────────────────────────────────────────────────
function formatResults(result) {
    const lines = [];
    lines.push(`SCHEMA LINT RESULTS`);
    lines.push(`===================`);
    lines.push(`File:             ${result.file}`);
    lines.push(`Tables analyzed:  ${result.tablesAnalyzed}`);
    lines.push('');
    if (result.issues.length === 0) {
        lines.push('No issues found. Schema looks clean.');
    }
    else {
        // Group by table
        const byTable = new Map();
        for (const issue of result.issues) {
            if (!byTable.has(issue.table))
                byTable.set(issue.table, []);
            byTable.get(issue.table).push(issue);
        }
        for (const [table, issues] of byTable) {
            lines.push(`Table: ${table}`);
            for (const issue of issues) {
                lines.push(`  [${issue.severity}] ${issue.rule}`);
                lines.push(`    ${issue.message}`);
            }
            lines.push('');
        }
    }
    lines.push(`SUMMARY: ${result.errorCount} error(s), ${result.warningCount} warning(s), ${result.infoCount} info`);
    return lines.join('\n');
}
// ─── Entry point ─────────────────────────────────────────────────────────────
const filePath = process.argv[2];
if (!filePath) {
    console.error('Usage: schema-lint <path-to-sql-file>');
    process.exit(1);
}
const resolvedPath = path.resolve(filePath);
if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
}
const result = lintFile(resolvedPath);
console.log(formatResults(result));
process.exit(result.errorCount > 0 ? 1 : 0);
