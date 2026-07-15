#!/usr/bin/env node

// ─━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DevMon Repository Analyzer v1.0.0
// Production-grade static analysis for Next.js + TypeScript + Supabase projects
// Zero external dependencies — uses only Node.js built-ins
// ─━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// ─── 1. Constants & Configuration ───────────────────────────────────────────────

const ROOT_DIR = process.cwd();
const REPORT_MD = path.join(ROOT_DIR, "repository-analysis.md");
const REPORT_JSON = path.join(ROOT_DIR, "repository-analysis.json");

const IGNORE_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  ".gitattributes",
  "archive",
  "coverage",
  ".opencode",
]);

const IGNORE_FILES = new Set([
  ".DS_Store",
  "package-lock.json",
  "tsconfig.tsbuildinfo",
  "next-env.d.ts",
  ".prettierrc",
  ".editorconfig",
  "analyze-repo.js",
  "repository-analysis.md",
  "repository-analysis.json",
]);

const FRAMEWORK_MANAGED_FILES = new Set([
  "layout.tsx",
  "layout.js",
  "page.tsx",
  "page.js",
  "loading.tsx",
  "loading.js",
  "error.tsx",
  "error.js",
  "not-found.tsx",
  "not-found.js",
  "global-error.tsx",
  "global-error.js",
  "template.tsx",
  "template.js",
  "default.tsx",
  "default.js",
  "route.ts",
  "route.js",
  "middleware.ts",
  "robots.ts",
  "sitemap.ts",
  "globals.css",
  "globals.css",
  "providers.tsx",
  "providers.js",
]);

const FRAMEWORK_MANAGED_DIRECTORIES = new Set([
  "api",
  "(auth)",
  "(main)",
  "(marketing)",
]);

const FILE_CATEGORIES = {
  source: new Set([".ts", ".tsx", ".js", ".jsx"]),
  styles: new Set([".css", ".scss", ".sass", ".less", ".pcss"]),
  config: new Set([
    ".json",
    ".mjs",
    ".cjs",
    ".yaml",
    ".yml",
    ".toml",
    ".env",
    ".env.example",
    ".env.local",
    ".env.production",
  ]),
  markdown: new Set([".md", ".mdx"]),
  image: new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".svg"]),
  font: new Set([".woff", ".woff2", ".ttf", ".otf", ".eot"]),
  sql: new Set([".sql"]),
  scripts: new Set([".sh", ".bat", ".ps1"]),
};

const EXTENSION_PRIORITY = [".tsx", ".ts", ".jsx", ".js", ".mjs", ".cjs"];

const SECRET_PATTERNS = [
  /sk_live_/i,
  /sk_test_/i,
  /pk_live_/i,
  /pk_test_/i,
  /ghp_/,
  /gho_/,
  /ghu_/,
  /ghs_/,
  /ghr_/,
  /AKIA[0-9A-Z]{16}/,
  /SUPABASE_SERVICE_ROLE_KEY/i,
  /SUPABASE_ANON_KEY/i,
  /service_role/i,
  /-----BEGIN (RSA |EC )?PRIVATE KEY-----/,
  /xox[apbors]-/,
  /sk-[0-9a-zA-Z]{20,}/,
  /pk-[0-9a-zA-Z]{20,}/,
];

const CONSOLE_METHODS = ["log", "warn", "error", "info", "debug", "trace", "dir"];

const KNOWN_DEPRECATED_PACKAGES = {
  moment: "Use date-fns, dayjs, or built-in Intl.DateTimeFormat",
  "request": "Use node-fetch, undici, or built-in fetch (Node 18+)",
  "axios": "Use built-in fetch (Node 18+) or ky",
  "lodash": "Use native Array/Object methods",
  "underscore": "Use native Array/Object methods",
  "chalk": "Use picocolors or native ANSI escape codes",
  "glob": "Use fast-glob or glob with promises",
  "rimraf": "Use fs.rmSync (Node 14+) or fs.promises.rm",
  "mkdirp": "Use fs.mkdirSync({recursive:true}) or fs.promises.mkdir",
  "dotenv": "Use --env-file or Node 20+ built-in env loading",
  "cors": "Implement manually or use framework middleware",
  "body-parser": "Built into Express 4.16+ / Next.js API routes",
  "uuid": "Use crypto.randomUUID() (Node 14.17+)",
  "faker": "Use @faker-js/faker (community fork)",
  "colors": "Use picocolors or native ANSI",
};

const REPLACEABLE_WITH_BUILTIN = {
  "lodash": "Native Array.prototype.map/filter/reduce, Object.entries/fromEntries",
  "axios": "globalThis.fetch (Node 18+)",
  "moment": "Intl.DateTimeFormat, Temporal (proposal stage 3)",
  "uuid": "crypto.randomUUID()",
  "dotenv": "--env-file flag (Node 20+), process.loadEnvFile()",
  "rimraf": "fs.rmSync() with {recursive:true, force:true}",
  "mkdirp": "fs.mkdirSync() with {recursive:true}",
  "glob": "fs.globSync() (Node 22+)",
};

// ─── 2. Utility Functions ───────────────────────────────────────────────────────

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function dirExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

function hashContent(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function countLines(content) {
  if (!content) return 0;
  return content.split("\n").length;
}

function relativePath(absPath) {
  return path.relative(ROOT_DIR, absPath).replace(/\\/g, "/");
}

function normalizePath(p) {
  return p.replace(/\\/g, "/");
}

function getExt(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".gz" || ext === ".br") {
    const base = path.basename(filePath, ext);
    return path.extname(base).toLowerCase() + ext;
  }
  return ext;
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── 3. File Scanner ────────────────────────────────────────────────────────────

function walkDirectory(dirPath, relativeBase = "") {
  const results = [];
  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = relativeBase
      ? `${relativeBase}/${entry.name}`
      : entry.name;

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      results.push(...walkDirectory(fullPath, relPath));
    } else if (entry.isFile()) {
      if (IGNORE_FILES.has(entry.name)) continue;
      results.push({
        absPath: fullPath,
        relPath: normalizePath(relPath),
        name: entry.name,
        ext: getExt(entry.name),
        dir: normalizePath(path.dirname(relPath)),
        size: getFileSize(fullPath),
      });
    }
  }
  return results;
}

function categorizeFiles(files) {
  const categories = {
    source: [],
    styles: [],
    config: [],
    markdown: [],
    image: [],
    font: [],
    sql: [],
    scripts: [],
    other: [],
  };

  for (const file of files) {
    let categorized = false;
    for (const [category, extensions] of Object.entries(FILE_CATEGORIES)) {
      if (extensions.has(file.ext)) {
        categories[category].push(file);
        categorized = true;
        break;
      }
    }
    if (!categorized) {
      categories.other.push(file);
    }
  }

  return categories;
}

// ─── 4. Import/Export Parser ────────────────────────────────────────────────────

function parseImports(content, filePath) {
  const imports = [];
  const fileDir = path.dirname(filePath);

  const staticImportRegex =
    /import\s+(?:(?:type\s+)?(?:\{[^}]*\}|[^;{]+?))\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = staticImportRegex.exec(content)) !== null) {
    imports.push({
      type: "static",
      source: match[1],
      resolved: null,
      line: content.substring(0, match.index).split("\n").length,
    });
  }

  const sideEffectImportRegex = /import\s+['"]([^'"]+)['"]/g;
  while ((match = sideEffectImportRegex.exec(content)) !== null) {
    imports.push({
      type: "side-effect",
      source: match[1],
      resolved: null,
      line: content.substring(0, match.index).split("\n").length,
    });
  }

  const dynamicImportRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = dynamicImportRegex.exec(content)) !== null) {
    imports.push({
      type: "dynamic",
      source: match[1],
      resolved: null,
      line: content.substring(0, match.index).split("\n").length,
    });
  }

  const requireRegex = /(?:const|let|var)\s+\w+\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = requireRegex.exec(content)) !== null) {
    imports.push({
      type: "require",
      source: match[1],
      resolved: null,
      line: content.substring(0, match.index).split("\n").length,
    });
  }

  const reexportRegex = /export\s+(?:\{.*?\}|.*?)\s+from\s+['"]([^'"]+)['"]/g;
  while ((match = reexportRegex.exec(content)) !== null) {
    imports.push({
      type: "re-export",
      source: match[1],
      resolved: null,
      line: content.substring(0, match.index).split("\n").length,
    });
  }

  return imports;
}

function parseExports(content) {
  const exports = [];

  const namedExportRegex =
    /export\s+(?:type\s+)?(?:function|const|let|var|class|interface|type|enum)\s+(\w+)/g;
  let match;
  while ((match = namedExportRegex.exec(content)) !== null) {
    exports.push({
      type: "named",
      name: match[1],
    });
  }

  const defaultExportRegex = /export\s+default\s+(?:function|class|const|let|var)?\s*(\w*)/g;
  while ((match = defaultExportRegex.exec(content)) !== null) {
    exports.push({
      type: "default",
      name: match[1] || "(anonymous)",
    });
  }

  const exportListRegex = /export\s+\{\s*([^}]+)\s*\}/g;
  while ((match = exportListRegex.exec(content)) !== null) {
    const items = match[1].split(",").map((i) => i.trim().split(/\s+as\s+/)[0].trim());
    for (const item of items) {
      if (item && !item.includes("from")) {
        exports.push({ type: "named", name: item });
      }
    }
  }

  return exports;
}

function resolveImportSource(source, importingFile) {
  const importingDir = path.dirname(importingFile);

  // Alias: @/* -> ./src/*
  if (source.startsWith("@/")) {
    const withoutAlias = source.slice(2);
    const candidates = [
      path.join(ROOT_DIR, "src", withoutAlias),
      path.join(ROOT_DIR, "src", withoutAlias + ".ts"),
      path.join(ROOT_DIR, "src", withoutAlias + ".tsx"),
      path.join(ROOT_DIR, "src", withoutAlias + ".js"),
      path.join(ROOT_DIR, "src", withoutAlias + ".jsx"),
      path.join(ROOT_DIR, "src", withoutAlias, "index.ts"),
      path.join(ROOT_DIR, "src", withoutAlias, "index.tsx"),
      path.join(ROOT_DIR, "src", withoutAlias, "index.js"),
      path.join(ROOT_DIR, "src", withoutAlias, "index.jsx"),
    ];
    for (const candidate of candidates) {
      if (fileExists(candidate)) return candidate;
    }
    return null;
  }

  // Relative import
  if (source.startsWith(".")) {
    const basePath = path.resolve(importingDir, source);
    const candidates = [
      basePath,
      basePath + ".ts",
      basePath + ".tsx",
      basePath + ".js",
      basePath + ".jsx",
      path.join(basePath, "index.ts"),
      path.join(basePath, "index.tsx"),
      path.join(basePath, "index.js"),
      path.join(basePath, "index.jsx"),
    ];
    for (const candidate of candidates) {
      if (fileExists(candidate)) return candidate;
    }
    if (basePath.endsWith(".css")) {
      const cssCandidates = [
        basePath,
        basePath.replace(/\.css$/, ".module.css"),
      ];
      for (const c of cssCandidates) {
        if (fileExists(c)) return c;
      }
    }
    return null;
  }

  // Bare specifier - package name, can't resolve locally
  return source;
}

// ─── 5. Dependency Graph Builder ────────────────────────────────────────────────

function buildDependencyGraph(allFiles) {
  const graph = {};
  const sourceFiles = allFiles.filter(
    (f) =>
      FILE_CATEGORIES.source.has(f.ext) ||
      f.ext === ".css" ||
      f.ext === ".sql"
  );

  for (const file of sourceFiles) {
    const content = readFile(file.absPath);
    if (!content) {
      graph[file.relPath] = { imports: [], exports: [] };
      continue;
    }
    const imports = parseImports(content, file.absPath);
    const exports = parseExports(content);

    const resolvedImports = imports.map((imp) => {
      const resolved = resolveImportSource(imp.source, file.absPath);
      return {
        ...imp,
        resolved: resolved ? relativePath(resolved) : imp.source,
      };
    });

    graph[file.relPath] = {
      imports: resolvedImports,
      exports,
      isFrameworkManaged: FRAMEWORK_MANAGED_FILES.has(file.name),
    };
  }

  return graph;
}

function collectAllReferences(graph) {
  const referenced = new Set();
  const packageImports = new Set();

  for (const [filePath, node] of Object.entries(graph)) {
    referenced.add(filePath);
    for (const imp of node.imports) {
      if (imp.resolved && !imp.resolved.startsWith(".") && !imp.resolved.startsWith("/")) {
        // Might be a local resolved path or bare package
        if (imp.resolved.includes(path.sep) || imp.resolved.startsWith("src")) {
          referenced.add(imp.resolved);
        } else {
          packageImports.add(imp.source);
        }
      } else if (imp.resolved && imp.source.startsWith(".")) {
        referenced.add(imp.resolved);
      } else if (imp.resolved && imp.source.startsWith("@/")) {
        referenced.add(imp.resolved);
      } else if (!imp.resolved && !imp.source.startsWith(".")) {
        packageImports.add(imp.source);
      }
    }
  }

  return { referenced, packageImports };
}

// ─── 6. Next.js Convention Analyzer ─────────────────────────────────────────────

function analyzeNextJS(allFiles) {
  const findings = [];

  // Group files by directory for App Router analysis
  const appFiles = allFiles.filter((f) => f.relPath.startsWith("src/app/"));
  const appDirs = new Map();

  for (const file of appFiles) {
    const dir = path.dirname(file.relPath);
    if (!appDirs.has(dir)) appDirs.set(dir, []);
    appDirs.get(dir).push(file);
  }

  // Check App Router conventions
  for (const [dir, files] of appDirs) {
    const fileNames = new Set(files.map((f) => f.name));
    const hasPage = fileNames.has("page.tsx") || fileNames.has("page.js");
    const hasLayout =
      fileNames.has("layout.tsx") || fileNames.has("layout.js");
    const hasLoading =
      fileNames.has("loading.tsx") || fileNames.has("loading.js");
    const hasError = fileNames.has("error.tsx") || fileNames.has("error.js");
    const hasTemplate =
      fileNames.has("template.tsx") || fileNames.has("template.js");

    // Check for route.ts in directories with page.tsx (conflict)
    const hasRoute = fileNames.has("route.ts") || fileNames.has("route.js");
    if (hasRoute && hasPage) {
      findings.push({
        file: dir,
        reason: "Route handler and page both defined in same directory",
        evidence: `Directory ${dir} contains both route.ts and page.tsx`,
        confidence: 100,
        risk: "high",
        recommendation: "Remove one — route.ts handles API, page.tsx handles UI. They cannot coexist.",
        suggestedFix: "Decide whether ${dir} should be an API endpoint or a page, then remove the conflicting file.",
      });
    }
  }

  // Detect page directories without page.tsx
  for (const [dir, files] of appDirs) {
    const fileNames = new Set(files.map((f) => f.name));
    if (
      !fileNames.has("page.tsx") &&
      !fileNames.has("page.js") &&
      !fileNames.has("route.ts") &&
      !fileNames.has("route.js") &&
      !dir.includes("api/")
    ) {
      const hasSubdirs = files.some((f) => f.relPath !== dir);
      if (!hasSubdirs) {
        findings.push({
          file: dir,
          reason: "Directory has no page.tsx or route.ts — may be dead route",
          evidence: `Directory ${dir} exists but contains no page.tsx or route.ts or route.js`,
          confidence: 80,
          risk: "low",
          recommendation: "Verify this directory is intentionally empty or remove it.",
          suggestedFix:
            "Add page.tsx for a page route, route.ts for an API route, or delete the directory.",
        });
      }
    }
  }

  // Detect metadata/viewport exports
  for (const file of appFiles) {
    const content = readFile(file.absPath);
    if (!content) continue;

    if (content.includes("export const metadata")) {
      findings.push({
        file: file.relPath,
        reason: "Static metadata export (good practice)",
        evidence: "File exports static metadata object for SEO",
        confidence: 100,
        risk: "none",
        recommendation: "No action needed — this is correct App Router usage.",
        suggestedFix: null,
      });
    }

    if (content.includes("export async function generateMetadata")) {
      findings.push({
        file: file.relPath,
        reason: "Dynamic metadata generation (good practice)",
        evidence: "File exports generateMetadata function for dynamic SEO",
        confidence: 100,
        risk: "none",
        recommendation: "No action needed — this is correct App Router usage.",
        suggestedFix: null,
      });
    }

    if (content.includes("export const viewport")) {
      findings.push({
        file: file.relPath,
        reason: "Static viewport export (good practice)",
        evidence: "File exports static viewport configuration",
        confidence: 100,
        risk: "none",
        recommendation: "No action needed — this is correct App Router usage.",
        suggestedFix: null,
      });
    }

    // Detect "use client" and "use server"
    if (content.includes('"use client"') || content.includes("'use client'")) {
      findings.push({
        file: file.relPath,
        reason: "Client Component boundary",
        evidence: "File uses 'use client' directive",
        confidence: 100,
        risk: "none",
        recommendation: "No action needed.",
        suggestedFix: null,
      });
    }
    if (content.includes('"use server"') || content.includes("'use server'")) {
      if (content.includes("export async function") || content.includes('"use server"')) {
        findings.push({
          file: file.relPath,
          reason: "Server Action",
          evidence: "File uses 'use server' directive",
          confidence: 100,
          risk: "none",
          recommendation: "No action needed.",
          suggestedFix: null,
        });
      }
    }
  }

  // API route analysis
  const apiRoutes = allFiles.filter(
    (f) => f.relPath.startsWith("src/app/api/") && f.name.startsWith("route.")
  );

  for (const route of apiRoutes) {
    const content = readFile(route.absPath);
    if (!content) continue;

    const httpMethods = [];
    for (const method of ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]) {
      if (content.includes(`export async function ${method}`) || content.includes(`export function ${method}`)) {
        httpMethods.push(method);
      }
    }

    if (httpMethods.length > 0) {
      findings.push({
        file: route.relPath,
        reason: `API Route Handler: ${httpMethods.join(", ")}`,
        evidence: `Exports ${httpMethods.length} HTTP method handler(s): ${httpMethods.join(", ")}`,
        confidence: 100,
        risk: "none",
        recommendation: "No action needed — active API route.",
        suggestedFix: null,
      });
    } else {
      findings.push({
        file: route.relPath,
        reason: "API route with no HTTP method exports",
        evidence: "route.ts exists but exports no GET/POST/PUT/PATCH/DELETE functions",
        confidence: 95,
        risk: "medium",
        recommendation: "If this route is unused, remove it. Otherwise, add method handlers.",
        suggestedFix: "Export handler functions: export async function GET(request) { ... }",
      });
    }
  }

  // Middleware analysis
  const middlewareFiles = allFiles.filter(
    (f) => f.name === "middleware.ts" || f.name === "middleware.js"
  );
  for (const mw of middlewareFiles) {
    const content = readFile(mw.absPath);
    if (content && content.includes("export function middleware") || content.includes("export { middleware }")) {
      findings.push({
        file: mw.relPath,
        reason: "Active middleware (good practice)",
        evidence: "Exports middleware function for request interception",
        confidence: 100,
        risk: "none",
        recommendation: "No action needed — active middleware.",
        suggestedFix: null,
      });
    }
  }

  return findings;
}

// ─── 7. Supabase / SQL Analyzer ─────────────────────────────────────────────────

function analyzeSQLFiles(allFiles) {
  const sqlFiles = allFiles.filter((f) => f.ext === ".sql");
  const findings = [];

  const allTables = new Map();
  const allFunctions = new Map();
  const allPolicies = new Map();
  const allIndexes = new Map();

  for (const file of sqlFiles) {
    const content = readFile(file.absPath);
    if (!content) continue;

    // Detect CREATE TABLE
    const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?(\w+)/gi;
    let match;
    while ((match = tableRegex.exec(content)) !== null) {
      if (!allTables.has(match[1])) allTables.set(match[1], []);
      allTables.get(match[1]).push(file.relPath);
    }

    // Detect CREATE FUNCTION / RPC
    const funcRegex = /CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+(?:public\.)?(\w+)/gi;
    while ((match = funcRegex.exec(content)) !== null) {
      if (!allFunctions.has(match[1])) allFunctions.set(match[1], []);
      allFunctions.get(match[1]).push(file.relPath);
    }

    // Detect CREATE POLICY
    const policyRegex = /CREATE\s+POLICY\s+"?(\w+)"?\s+ON/i;
    while ((match = policyRegex.exec(content)) !== null) {
      if (!allPolicies.has(match[1])) allPolicies.set(match[1], []);
      allPolicies.get(match[1]).push(file.relPath);
    }

    // Detect CREATE INDEX
    const indexRegex = /CREATE\s+(?:UNIQUE\s+)?INDEX\s+(?:\w+\s+)?ON\s+(?:public\.)?(\w+)/gi;
    while ((match = indexRegex.exec(content)) !== null) {
      if (!allIndexes.has(match[1])) allIndexes.set(match[1], []);
      allIndexes.get(match[1]).push(file.relPath);
    }

    // Detect CREATE SEQUENCE
    const seqRegex = /CREATE\s+SEQUENCE\s+(?:\w+\.)?(\w+)/gi;
    while ((match = seqRegex.exec(content)) !== null) {
      if (!allFunctions.has(`sequence:${match[1]}`)) {
        allFunctions.set(`sequence:${match[1]}`, []);
      }
      allFunctions.get(`sequence:${match[1]}`).push(file.relPath);
    }
  }

  // Check for duplicate table/function definitions
  for (const [name, locations] of allTables) {
    if (locations.length > 1) {
      findings.push({
        file: locations.join(", "),
        reason: `Table "${name}" defined in multiple SQL files`,
        evidence: `Found in ${locations.length} files: ${locations.join(", ")}`,
        confidence: 100,
        risk: "high",
        recommendation: "Consolidate table definition into a single migration file.",
        suggestedFix: "Keep the definition only in the active migration and remove from archived files.",
      });
    }
  }

  // Check migration history
  const activeMigrations = sqlFiles.filter(
    (f) =>
      !f.relPath.includes("archive") &&
      !f.relPath.includes("archive")
  );
  const archivedMigrations = sqlFiles.filter(
    (f) => f.relPath.includes("archive")
  );

  if (archivedMigrations.length > 0) {
    findings.push({
      file: archivedMigrations.map((f) => f.relPath).join(", "),
      reason: "Archived/historical migrations detected",
      evidence: `${archivedMigrations.length} migration(s) found in archive/ directory: ${archivedMigrations.map((f) => f.relPath).join(", ")}`,
      confidence: 100,
      risk: "info",
      recommendation: "Good practice — keep archive for history, do NOT delete. These may be needed for rollback reference.",
      suggestedFix: null,
    });
  }

  // Check for orphaned RPCs (defined but never called in code)
  const rpcCalls = [];
  const sourceFiles = allFiles.filter(
    (f) => FILE_CATEGORIES.source.has(f.ext) && !f.relPath.includes("node_modules")
  );
  for (const file of sourceFiles) {
    const content = readFile(file.absPath);
    if (!content) continue;
    const rpcMatch = /\.rpc\s*\(\s*["'](\w+)["']/g;
    let m;
    while ((m = rpcMatch.exec(content)) !== null) {
      rpcCalls.push({ name: m[1], file: file.relPath });
    }
  }

  const definedFunctions = new Set(allFunctions.keys());
  const calledFunctions = new Map();
  for (const call of rpcCalls) {
    if (!calledFunctions.has(call.name)) calledFunctions.set(call.name, []);
    calledFunctions.get(call.name).push(call.file);
  }

  for (const [funcName, locations] of allFunctions) {
    if (funcName.startsWith("sequence:")) continue;
    if (!calledFunctions.has(funcName)) {
      findings.push({
        file: locations.join(", "),
        reason: `RPC/Function "${funcName}" defined but never called in application code`,
        evidence: `Defined in ${locations.join(", ")} but no .rpc("${funcName}") calls found in source`,
        confidence: 95,
        risk: "medium",
        recommendation: "If unused, consider removing; if called indirectly, add a comment.",
        suggestedFix: "Remove the function definition or add it to a cleanup migration.",
      });
    }
  }

  return {
    findings,
    summary: {
      tables: Array.from(allTables.keys()),
      functions: Array.from(allFunctions.keys()).filter((k) => !k.startsWith("sequence:")),
      sequences: Array.from(allFunctions.keys()).filter((k) => k.startsWith("sequence:")).map((k) => k.replace("sequence:", "")),
      policies: Array.from(allPolicies.keys()),
      indexes: Array.from(allIndexes.keys()),
      activeMigrations: activeMigrations.length,
      archivedMigrations: archivedMigrations.length,
      rpcCalls: Array.from(calledFunctions.keys()),
    },
  };
}

// ─── 8. Unused Code Detector ────────────────────────────────────────────────────

function detectUnusedCode(allFiles, dependencyGraph) {
  const findings = [];
  const { referenced } = collectAllReferences(dependencyGraph);

  // Build set of all source files
  const sourceFiles = allFiles.filter((f) =>
    FILE_CATEGORIES.source.has(f.ext)
  );

  // Find files not referenced
  for (const file of sourceFiles) {
    if (FRAMEWORK_MANAGED_FILES.has(file.name)) continue;
    if (file.relPath.includes("__tests__")) continue;

    // Check if it's a Next.js convention file by directory
    const isInAppDir = file.relPath.startsWith("src/app/");
    const isAppRouterFile =
      isInAppDir &&
      (file.name === "page.tsx" ||
        file.name === "layout.tsx" ||
        file.name === "loading.tsx" ||
        file.name === "error.tsx" ||
        file.name === "template.tsx" ||
        file.name === "not-found.tsx" ||
        file.name === "default.tsx");

    if (isAppRouterFile) continue;

    // Check if referenced via dependency graph
    if (!referenced.has(file.relPath)) {
      // Double-check with content analysis
      const content = readFile(file.absPath);
      if (!content) continue;

      // Check for string references across all source files
      const fileName = path.basename(file.name, path.extname(file.name));
      const fileRefPattern = new RegExp(
        fileName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      let stringReferenced = false;
      for (const otherFile of sourceFiles) {
        if (otherFile.absPath === file.absPath) continue;
        const otherContent = readFile(otherFile.absPath);
        if (otherContent && fileRefPattern.test(otherContent)) {
          stringReferenced = true;
          break;
        }
      }

      // Check for references in markdown
      if (!stringReferenced) {
        const mdFiles = allFiles.filter((f) => f.ext === ".md");
        for (const mf of mdFiles) {
          const mc = readFile(mf.absPath);
          if (mc && fileRefPattern.test(mc)) {
            stringReferenced = true;
            break;
          }
        }
      }

      // Check for references in config files
      if (!stringReferenced) {
        const configFiles = allFiles.filter((f) => f.name === "next.config.mjs" || f.name === "tailwind.config.ts" || f.name === "postcss.config.js" || f.name === ".eslintrc.json");
        for (const cf of configFiles) {
          const cc = readFile(cf.absPath);
          if (cc && fileRefPattern.test(cc)) {
            stringReferenced = true;
            break;
          }
        }
      }

      if (stringReferenced) {
        findings.push({
          file: file.relPath,
          reason: "No direct import found but string-referenced in other files",
          evidence: `File ${file.name} is not directly imported but name matches strings in other files`,
          confidence: 50,
          risk: "low",
          recommendation: "Manual review — likely used indirectly or dynamically.",
          suggestedFix: "Verify usage manually. If truly unused, remove.",
        });
      } else {
        const confidence = file.relPath.includes("__tests__") ? 50 : 80;
        findings.push({
          file: file.relPath,
          reason: "No imports or references found across the codebase",
          evidence: `No static import, dynamic import, require(), or string reference to ${file.relPath} found in any source/config/doc file`,
          confidence,
          risk: confidence >= 80 ? "medium" : "low",
          recommendation: confidence >= 80
            ? "Likely unused — remove if confirmed."
            : "Manual review recommended — may be used indirectly.",
          suggestedFix: "Remove file or add import.",
        });
      }
    }
  }

  // Check for unused exports within files
  for (const [filePath, node] of Object.entries(dependencyGraph)) {
    if (node.isFrameworkManaged) continue;
    if (filePath.includes("__tests__")) continue;

    for (const exp of node.exports) {
      if (exp.type === "default") continue; // Can't easily track default exports

      // Check if this export is imported anywhere
      let importCount = 0;
      for (const [otherPath, otherNode] of Object.entries(dependencyGraph)) {
        if (otherPath === filePath) continue;
        for (const imp of otherNode.imports) {
          if (imp.resolved === filePath || imp.resolved === filePath.replace(/\.tsx?$/, "")) {
            importCount++;
          }
        }
      }

      // Check for barrel re-exports
      const parentDirImports = [];
      for (const [op, on] of Object.entries(dependencyGraph)) {
        for (const imp of on.imports) {
          if (imp.resolved && imp.resolved.endsWith("/index") && imp.source.includes(path.basename(filePath, path.extname(filePath)))) {
            parentDirImports.push(op);
          }
        }
      }

      if (importCount === 0 && parentDirImports.length === 0) {
        const content = readFile(
          path.join(ROOT_DIR, filePath)
        );
        if (content && content.includes(exp.name)) {
          // Check string references
          let totalRefs = 0;
          for (const [op, on] of Object.entries(dependencyGraph)) {
            if (op === filePath) continue;
            const oc = readFile(path.join(ROOT_DIR, op));
            if (oc && new RegExp(`\\b${exp.name}\\b`).test(oc)) {
              totalRefs++;
            }
          }

          if (totalRefs === 0) {
            findings.push({
              file: filePath,
              reason: `Export "${exp.name}" is not imported by any other module`,
              evidence: `Declared in ${filePath} but no import statements reference it in any other file`,
              confidence: 80,
              risk: "low",
              recommendation: "If this export is part of a public API, it may still be used externally or via barrel exports.",
              suggestedFix: "Remove the export or add a comment documenting its intended usage.",
            });
          }
        }
      }
    }
  }

  return findings;
}

// ─── 9. Duplicate Code Detector ─────────────────────────────────────────────────

function detectDuplicates(allFiles) {
  const findings = [];

  // Detect duplicate or very similar files by content hash
  const contentHashes = new Map();
  const sourceFiles = allFiles.filter((f) =>
    FILE_CATEGORIES.source.has(f.ext) && !f.relPath.includes("__tests__")
  );

  for (const file of sourceFiles) {
    const content = readFile(file.absPath);
    if (!content || content.length < 50) continue;
    const h = hashContent(content);

    if (!contentHashes.has(h)) contentHashes.set(h, []);
    contentHashes.get(h).push(file.relPath);
  }

  for (const [hash, paths] of contentHashes) {
    if (paths.length > 1) {
      findings.push({
        file: paths.join(", "),
        reason: `Identical content in ${paths.length} files`,
        evidence: `Files have identical SHA-256 hash: ${paths.join(", ")}`,
        confidence: 100,
        risk: "medium",
        recommendation: "Consolidate into a single file and import where needed.",
        suggestedFix: `Keep one canonical file and update imports in: ${paths.slice(1).join(", ")} to reference the original.`,
      });
    }
  }

  // Detect duplicate CSS keyframes
  const cssFiles = allFiles.filter((f) => f.ext === ".css");
  const keyframeNames = new Map();

  for (const file of cssFiles) {
    const content = readFile(file.absPath);
    if (!content) continue;

    const keyframeRegex = /@keyframes\s+(\w+)\s*\{/g;
    let match;
    while ((match = keyframeRegex.exec(content)) !== null) {
      if (!keyframeNames.has(match[1])) keyframeNames.set(match[1], []);
      keyframeNames.get(match[1]).push(file.relPath);
    }
  }

  for (const [name, locations] of keyframeNames) {
    if (locations.length > 1) {
      findings.push({
        file: locations.join(", "),
        reason: `Duplicate keyframe "${name}" defined in multiple CSS files`,
        evidence: `Found in: ${locations.join(", ")}`,
        confidence: 100,
        risk: "low",
        recommendation: "Consolidate duplicate keyframe definitions into one location.",
        suggestedFix: `Keep one definition of @keyframes ${name} and remove duplicates.`,
      });
    }
  }

  return findings;
}

// ─── 10. Asset Analyzer ─────────────────────────────────────────────────────────

function analyzeAssets(allFiles, dependencyGraph) {
  const findings = [];

  // Check public/ directory assets
  const publicFiles = allFiles.filter((f) => f.relPath.startsWith("public/"));
  const sourceFiles = allFiles.filter((f) =>
    FILE_CATEGORIES.source.has(f.ext)
  );

  for (const asset of publicFiles) {
    const assetName = path.basename(asset.relPath);
    const assetNameNoExt = path.basename(asset.relPath, path.extname(asset.relPath));
    const publicRelPath = asset.relPath.replace(/^public\//, "/");

    // Check for references in source files
    let referenced = false;
    for (const file of sourceFiles) {
      const content = readFile(file.absPath);
      if (!content) continue;

      // Check for direct references: strings containing the asset name or path
      if (
        content.includes(publicRelPath) ||
        content.includes(assetName) ||
        content.includes(assetNameNoExt)
      ) {
        referenced = true;
        break;
      }

      // Check for dynamic references like `/Golden_Crown.png`
      const refPattern = new RegExp(
        `["'\`]${publicRelPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'\`]`,
        "i"
      );
      if (refPattern.test(content)) {
        referenced = true;
        break;
      }
    }

    // Also check markdown files
    if (!referenced) {
      const mdFiles = allFiles.filter((f) => f.ext === ".md");
      for (const mf of mdFiles) {
        const mc = readFile(mf.absPath);
        if (mc && mc.includes(publicRelPath)) {
          referenced = true;
          break;
        }
      }
    }

    // Check config files
    if (!referenced) {
      const configPaths = [
        "next.config.mjs",
        "tailwind.config.ts",
        ".github/PULL_REQUEST_TEMPLATE.md",
      ];
      for (const cp of configPaths) {
        const fullPath = path.join(ROOT_DIR, cp);
        if (fileExists(fullPath)) {
          const cc = readFile(fullPath);
          if (cc && cc.includes(publicRelPath)) {
            referenced = true;
            break;
          }
        }
      }
    }

    if (!referenced) {
      findings.push({
        file: asset.relPath,
        reason: "Public asset with no references in source, markdown, or config files",
        evidence: `File ${asset.relPath} exists in public/ but is never referenced in any .ts, .tsx, .js, .jsx, .md, or config file`,
        confidence: 80,
        risk: "low",
        recommendation:
          "If this asset is used dynamically (e.g., constructed path), add a comment. Otherwise remove.",
        suggestedFix: "Remove file or add an import/reference in the appropriate component.",
      });
    }
  }

  return findings;
}

// ─── 11. Dependency/CORS Analyzer ───────────────────────────────────────────────

function analyzeDependencies(allFiles) {
  const findings = [];

  const pkgPath = path.join(ROOT_DIR, "package.json");
  const pkgContent = readFile(pkgPath);
  if (!pkgContent) return findings;

  let pkg;
  try {
    pkg = JSON.parse(pkgContent);
  } catch {
    return findings;
  }

  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };
  const depNames = Object.keys(allDeps);

  // Find which packages are actually imported
  const usedPackages = new Set();
  const sourceFiles = allFiles.filter((f) =>
    FILE_CATEGORIES.source.has(f.ext) || f.ext === ".css" || f.ext === ".mjs" || f.ext === ".js"
  );

  for (const file of sourceFiles) {
    const content = readFile(file.absPath);
    if (!content) continue;

    // Check imports for package names
    for (const depName of depNames) {
      // Handle scoped packages
      const importPattern = new RegExp(
        `from\\s+['"]${depName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:/|['"])`,
        "g"
      );
      if (importPattern.test(content)) {
        usedPackages.add(depName);
      }

      // Check dynamic imports
      const dynamicPattern = new RegExp(
        `import\\(\\s*['"]${depName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:/|['"])`,
        "g"
      );
      if (dynamicPattern.test(content)) {
        usedPackages.add(depName);
      }

      // Check require
      const requirePattern = new RegExp(
        `require\\(\\s*['"]${depName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:/|['"])`,
        "g"
      );
      if (requirePattern.test(content)) {
        usedPackages.add(depName);
      }
    }
  }

  // Check for packages used only in scripts/
  const scriptFiles = allFiles.filter((f) => f.relPath.startsWith("scripts/"));
  for (const file of scriptFiles) {
    const content = readFile(file.absPath);
    if (!content) continue;
    for (const depName of depNames) {
      const requirePattern = new RegExp(
        `require\\(\\s*['"]${depName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:/|['"])`,
        "g"
      );
      if (requirePattern.test(content)) {
        usedPackages.add(depName);
      }
    }
  }

  // Check for packages used in config files
  const configFilePaths = [
    "next.config.mjs",
    "tailwind.config.ts",
    "postcss.config.js",
    "vitest.config.ts",
  ];
  for (const cfp of configFilePaths) {
    const fullPath = path.join(ROOT_DIR, cfp);
    if (fileExists(fullPath)) {
      const cc = readFile(fullPath);
      if (cc) {
        for (const depName of depNames) {
          const requirePattern = new RegExp(
            `require\\(\\s*['"]${depName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:/|['"])`,
            "g"
          );
          if (requirePattern.test(cc)) {
            usedPackages.add(depName);
          }
          // Also check import pattern for ESM configs
          const importPattern = new RegExp(
            `from\\s+['"]${depName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:/|['"])`,
            "g"
          );
          if (importPattern.test(cc)) {
            usedPackages.add(depName);
          }
        }
      }
    }
  }

  // Check for packages used only in scripts
  // (handled above with the script loop)

  const isDevDep = (name) => pkg.devDependencies && pkg.devDependencies[name];
  const isProdDep = (name) => pkg.dependencies && pkg.dependencies[name];

  for (const depName of depNames) {
    if (!usedPackages.has(depName)) {
      // Check if it's a TypeScript type package (starts with @types/)
      if (depName.startsWith("@types/")) {
        const typeFor = depName.slice(7);
        if (usedPackages.has(typeFor)) continue; // needed for its types
        // Check if the corresponding package exists as dependency
        if (depNames.includes(typeFor)) continue;
      }

      // Check if it's an ESLint plugin or config package
      if (
        depName.startsWith("eslint-config-") ||
        depName.startsWith("@typescript-eslint/") ||
        depName === "eslint"
      ) continue;

      // Check if it's a PostCSS plugin
      if (depName === "autoprefixer" || depName === "postcss") continue;

      // Check if it's Tailwind CSS
      if (depName === "tailwindcss") continue;

      // Check if it's TypeScript
      if (depName === "typescript") continue;

      // Check if it's vitest
      if (depName === "vitest") continue;

      // Check if it's react, react-dom (required by Next.js)
      if (depName === "react" || depName === "react-dom") continue;

      // Check if it's @types/react, @types/react-dom, @types/node (required by Next.js/TS)
      if (depName === "@types/react" || depName === "@types/react-dom" || depName === "@types/node") continue;

      // Check if referenced in package.json scripts (e.g., next, vitest)
      const scripts = pkg.scripts || {};
      let inScripts = false;
      for (const [scriptName, scriptCmd] of Object.entries(scripts)) {
        if (scriptCmd.includes(depName)) {
          inScripts = true;
          break;
        }
      }
      if (inScripts) continue;

      findings.push({
        file: "package.json",
        reason: `Unused ${isDevDep(depName) ? "devDependency" : "dependency"}: "${depName}"`,
        evidence: `Package "${depName}" is listed in package.json but no import/require/dynamic import references found in any source, script, or config file`,
        confidence: 80,
        risk: isProdDep(depName) ? "medium" : "low",
        recommendation: isProdDep(depName)
          ? "Remove unused production dependency to reduce bundle size."
          : "Remove unused devDependency.",
        suggestedFix: `Run: npm uninstall ${depName}`,
      });
    }
  }

  // Check for known deprecated packages
  for (const depName of depNames) {
    if (KNOWN_DEPRECATED_PACKAGES[depName]) {
      findings.push({
        file: "package.json",
        reason: `Deprecated package: "${depName}"`,
        evidence: `"${depName}" is deprecated. ${KNOWN_DEPRECATED_PACKAGES[depName]}`,
        confidence: 100,
        risk: "low",
        recommendation: `Replace "${depName}" with recommended alternative.`,
        suggestedFix: KNOWN_DEPRECATED_PACKAGES[depName],
      });
    }
  }

  // Check for replaceable packages
  for (const depName of depNames) {
    if (REPLACEABLE_WITH_BUILTIN[depName]) {
      if (usedPackages.has(depName)) {
        findings.push({
          file: "package.json",
          reason: `Package "${depName}" can be replaced with Node.js built-in`,
          evidence: `"${depName}" usage can be replaced with: ${REPLACEABLE_WITH_BUILTIN[depName]}`,
          confidence: 80,
          risk: "low",
          recommendation: `Replace with built-in API to reduce dependencies.`,
          suggestedFix: REPLACEABLE_WITH_BUILTIN[depName],
        });
      }
    }
  }

  return findings;
}

// ─── 12. Environment Variable Analyzer ──────────────────────────────────────────

function analyzeEnvVars(allFiles) {
  const findings = [];

  // Read env files
  const envFiles = {
    env: path.join(ROOT_DIR, ".env"),
    envExample: path.join(ROOT_DIR, ".env.example"),
  };

  const envContent = {};
  for (const [key, filePath] of Object.entries(envFiles)) {
    const content = readFile(filePath);
    if (content) {
      envContent[key] = content;
    }
  }

  // Parse env vars from .env and .env.example
  const parseEnvFile = (content) => {
    const vars = new Map();
    const lines = content.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const name = trimmed.substring(0, eqIdx).trim();
      const value = trimmed.substring(eqIdx + 1).trim();
      vars.set(name, { name, value, redacted: value.includes("your-") || value.includes("xxx") || value.includes("generate-with-") || value.includes("ghp_") });
    }
    return vars;
  };

  const envVars = parseEnvFile(envContent.env || "");
  const envExampleVars = parseEnvFile(envContent.envExample || "");

  // Find all process.env references in source files
  const envReferences = new Map();
  const sourceFiles = allFiles.filter(
    (f) =>
      FILE_CATEGORIES.source.has(f.ext) &&
      !f.relPath.includes("node_modules") &&
      !f.relPath.includes("__tests__")
  );

  for (const file of sourceFiles) {
    const content = readFile(file.absPath);
    if (!content) continue;

    const envRefRegex = /process\.env\.(\w+)/g;
    let match;
    while ((match = envRefRegex.exec(content)) !== null) {
      if (!envReferences.has(match[1])) envReferences.set(match[1], []);
      envReferences.get(match[1]).push(file.relPath);
    }

    // Also catch process.env["VAR"] style
    const bracketRefRegex = /process\.env\s*\[\s*["'](\w+)["']\s*\]/g;
    while ((match = bracketRefRegex.exec(content)) !== null) {
      if (!envReferences.has(match[1])) envReferences.set(match[1], []);
      envReferences.get(match[1]).push(file.relPath);
    }
  }

  // Check config files too
  const configFiles = ["next.config.mjs", "tailwind.config.ts"];
  for (const cf of configFiles) {
    const cfPath = path.join(ROOT_DIR, cf);
    if (fileExists(cfPath)) {
      const cc = readFile(cfPath);
      if (cc) {
        const envRefRegex = /process\.env\.(\w+)/g;
        let match;
        while ((match = envRefRegex.exec(cc)) !== null) {
          if (!envReferences.has(match[1])) envReferences.set(match[1], []);
          envReferences.get(match[1]).push(cf);
        }
      }
    }
  }

  // Check scripts/
  const scriptFiles = allFiles.filter((f) => f.relPath.startsWith("scripts/"));
  for (const file of scriptFiles) {
    const content = readFile(file.absPath);
    if (!content) continue;
    const envRefRegex = /process\.env\.(\w+)/g;
    let match;
    while ((match = envRefRegex.exec(content)) !== null) {
      if (!envReferences.has(match[1])) envReferences.set(match[1], []);
      envReferences.get(match[1]).push(file.relPath);
    }
  }

  // Variables in .env.example but never used in code
  for (const [varName, varInfo] of envExampleVars) {
    if (!envReferences.has(varName)) {
      findings.push({
        file: ".env.example",
        reason: `Environment variable "${varName}" documented but never used in code`,
        evidence: `"${varName}" is in .env.example but no process.env.${varName} reference found in any source file`,
        confidence: 95,
        risk: "low",
        recommendation: "Either remove from .env.example or add usage (if planned for future).",
        suggestedFix: "Remove the variable from .env.example or implement the feature that uses it.",
      });
    }
  }

  // Variables used in code but missing from .env.example
  for (const [varName, refs] of envReferences) {
    if (!envExampleVars.has(varName)) {
      findings.push({
        file: refs.join(", "),
        reason: `Environment variable "${varName}" used in code but missing from .env.example`,
        evidence: `"${varName}" referenced in ${refs.join(", ")} but not documented in .env.example`,
        confidence: 100,
        risk: "medium",
        recommendation: "Add to .env.example with a placeholder value and comment explaining its purpose.",
        suggestedFix: `Add to .env.example:\n# ${varName}\n${varName}=your-value-here`,
      });
    }
  }

  // Variables in .env but not in .env.example
  if (envContent.env) {
    for (const [varName, varInfo] of envVars) {
      // Filter out comments and common local-only vars
      if (varName.startsWith("LOCAL_") || varName.startsWith("DEV_")) continue;
      if (!envExampleVars.has(varName)) {
        findings.push({
          file: ".env",
          reason: `Environment variable "${varName}" in .env but not in .env.example`,
          evidence: `"${varName}" exists in .env but is missing from .env.example`,
          confidence: 80,
          risk: "low",
          recommendation: "Add to .env.example (with placeholder) to document required variables.",
          suggestedFix: `Add to .env.example:\n# ${varName}\n${varName}=your-value-here`,
        });
      }
    }
  }

  // Detect hardcoded secrets in source files (NOT env var references)
  for (const file of sourceFiles) {
    const content = readFile(file.absPath);
    if (!content) continue;

    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip lines that are process.env references
      if (line.includes("process.env.")) continue;

      for (const pattern of SECRET_PATTERNS) {
        if (pattern.test(line)) {
          // Skip if the match is inside a comment
          if (line.trim().startsWith("//") || line.trim().startsWith("#") || line.trim().startsWith("/*")) continue;

          const sanitized = line.replace(
            /['"][A-Za-z0-9_\-]{20,}['"]/g,
            "'***REDACTED***'"
          );
          findings.push({
            file: file.relPath,
            reason: `Possible hardcoded secret on line ${i + 1}`,
            evidence: sanitized.trim().substring(0, 120),
            confidence: 80,
            risk: "critical",
            recommendation: "Move hardcoded secrets to environment variables.",
            suggestedFix: `Replace with: process.env.YOUR_VAR_NAME`,
          });
          break;
        }
      }
    }
  }

  return findings;
}

// ─── 13. Documentation Analyzer ─────────────────────────────────────────────────

function analyzeDocumentation(allFiles) {
  const findings = [];
  const mdFiles = allFiles.filter((f) => f.ext === ".md");

  // Link extraction and validation
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const internalLinkRegex = /\[([^\]]+)\]\((\/[^)]+)\)/g;
  const anchorRegex = /^#{1,6}\s+(.+)$/gm;
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;

  // Collect all anchors from all markdown files
  const allAnchors = new Map();
  for (const file of mdFiles) {
    const content = readFile(file.absPath);
    if (!content) continue;

    let match;
    while ((match = anchorRegex.exec(content)) !== null) {
      const headingText = match[1].trim();
      const anchor = slugify(headingText);
      if (!allAnchors.has(anchor)) allAnchors.set(anchor, []);
      allAnchors.get(anchor).push(file.relPath);
    }
  }

  // Extract all links from each markdown file
  for (const file of mdFiles) {
    const content = readFile(file.absPath);
    if (!content) continue;

    // Check internal links
    let match;
    while ((match = internalLinkRegex.exec(content)) !== null) {
      const linkText = match[1];
      const linkUrl = match[2];
      const linkPath = linkUrl.split("#")[0];
      const linkAnchor = linkUrl.includes("#") ? linkUrl.split("#")[1] : null;

      if (linkPath) {
        const resolvedPath = path.join(ROOT_DIR, linkPath.replace(/^\//, ""));
        if (!fileExists(resolvedPath)) {
          // Try with .md extension if no extension
          const withMd = resolvedPath + ".md";
          if (!fileExists(withMd)) {
            findings.push({
              file: file.relPath,
              reason: "Broken internal link",
              evidence: `Link "${linkText}" points to "${linkUrl}" but ${linkPath} does not exist`,
              confidence: 100,
              risk: "medium",
              recommendation: "Update or remove the broken link.",
              suggestedFix: `Fix path: ${linkUrl} → correct path`,
            });
          }
        }
      }

      // Check anchors
      if (linkAnchor && !allAnchors.has(linkAnchor)) {
        // Check if anchor might be different casing
        let foundAnchor = false;
        for (const [existingAnchor] of allAnchors) {
          if (existingAnchor.toLowerCase() === linkAnchor.toLowerCase()) {
            foundAnchor = true;
            break;
          }
        }
        if (!foundAnchor) {
          findings.push({
            file: file.relPath,
            reason: "Broken anchor reference",
            evidence: `Link "${linkText}" points to anchor "#${linkAnchor}" but no matching heading found in any markdown file`,
            confidence: 95,
            risk: "low",
            recommendation: "Fix the anchor reference or add the missing heading.",
            suggestedFix: `Update anchor: #${linkAnchor} → #correct-anchor`,
          });
        }
      }
    }

    // Check image references
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    while ((match = imageRegex.exec(content)) !== null) {
      const imagePath = match[2];

      // Skip external URLs
      if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) continue;
      if (imagePath.startsWith("data:")) continue;

      // Resolve local image path
      const mdDir = path.dirname(file.absPath);
      const resolvedImagePath = path.resolve(mdDir, imagePath);

      if (!fileExists(resolvedImagePath)) {
        findings.push({
          file: file.relPath,
          reason: "Broken image reference",
          evidence: `Image "${match[1] || "unnamed"}" references "${imagePath}" but file not found at ${relativePath(resolvedImagePath)}`,
          confidence: 100,
          risk: "medium",
          recommendation: "Fix the image path or add the missing image file.",
          suggestedFix: `Place image at: ${relativePath(resolvedImagePath)} or update path`,
        });
      }
    }

    // Check for outdated commands
    const cmdPatterns = [
      { pattern: /npm\s+run\s+dev/g, suggestion: "Verify if still the correct dev command" },
      { pattern: /npm\s+run\s+build/g, suggestion: "Verify if still the correct build command" },
      { pattern: /npx\s+ts-node/g, suggestion: "ts-node may not be installed — check if needed" },
    ];

    for (const { pattern, suggestion } of cmdPatterns) {
      if (pattern.test(content)) {
        // Don't flag these as issues — just note them
        break;
      }
    }
  }

  // Check for duplicate content between docs
  const mdContentMap = new Map();
  for (const file of mdFiles) {
    const content = readFile(file.absPath);
    if (!content) continue;

    // Extract meaningful content (skip boilerplate like license, code of conduct)
    const firstHeading = content.match(/^#\s+(.+)$/m);
    const title = firstHeading ? firstHeading[1].trim() : file.name;

    const cleanContent = content
      .replace(/^#\s+.+$/m, "")
      .replace(/\s+/g, " ")
      .trim();

    mdContentMap.set(file.relPath, { title, content: cleanContent });
  }

  // Check for docs that mention deprecated folder structures
  const oldFolderPatterns = [
    { pattern: /pages\//g, suggestion: "Should be src/app/ (App Router), not pages/" },
    { pattern: /components\/ui\//g, suggestion: "Verify if this directory structure exists" },
    { pattern: /src\/styles\//g, suggestion: "Verify if this directory structure exists" },
  ];

  for (const file of mdFiles) {
    const content = readFile(file.absPath);
    if (!content) continue;

    for (const { pattern, suggestion } of oldFolderPatterns) {
      if (pattern.test(content)) {
        findings.push({
          file: file.relPath,
          reason: "Possibly outdated folder reference",
          evidence: `References "${pattern.source.replace(/\\//g, "/")}" which may no longer exist`,
          confidence: 50,
          risk: "low",
          recommendation: suggestion,
          suggestedFix: `Update references to reflect current directory structure`,
        });
      }
    }
  }

  return findings;
}

// ─── 14. CSS Analyzer ───────────────────────────────────────────────────────────

function analyzeCSS(allFiles) {
  const findings = [];

  const cssFiles = allFiles.filter((f) => f.ext === ".css");

  // Collect all used CSS classes from source files
  const usedClasses = new Set();
  const usedKeyframes = new Set();
  const usedAnimations = new Set();
  const usedCSSVars = new Set();

  const sourceFiles = allFiles.filter(
    (f) => FILE_CATEGORIES.source.has(f.ext)
  );

  for (const file of sourceFiles) {
    const content = readFile(file.absPath);
    if (!content) continue;

    // Extract className strings
    const classNameRegex = /className\s*=\s*{?\s*["'`]([^"'`]+)["'`]\s*}?/g;
    let match;
    while ((match = classNameRegex.exec(content)) !== null) {
      const classes = match[1].split(/\s+/);
      for (const cls of classes) {
        if (cls.startsWith("animate-")) {
          usedAnimations.add(cls.replace("animate-", ""));
        }
        usedClasses.add(cls);
      }
    }

    // Extract template literal classNames
    const templateClassRegex = /className\s*=\s*{?\s*`([^`]*)`\s*}?/g;
    while ((match = templateClassRegex.exec(content)) !== null) {
      const parts = match[1].split(/\${[^}]+}/);
      for (const part of parts) {
        const classes = part.split(/\s+/);
        for (const cls of classes) {
          if (cls) usedClasses.add(cls);
        }
      }
    }

    // Extract CSS var references
    const cssVarRegex = /var\(--(\w[\w-]*)\)/g;
    while ((match = cssVarRegex.exec(content)) !== null) {
      usedCSSVars.add(`--${match[1]}`);
    }
  }

  // Also check CSS files for cross-references
  for (const file of cssFiles) {
    const content = readFile(file.absPath);
    if (!content) continue;

    // Find CSS var references within CSS
    const cssVarRefRegex = /var\(--(\w[\w-]*)\)/g;
    let match;
    while ((match = cssVarRefRegex.exec(content)) !== null) {
      usedCSSVars.add(`--${match[1]}`);
    }
  }

  // Now analyze each CSS file for unused definitions
  for (const file of cssFiles) {
    const content = readFile(file.absPath);
    if (!content) continue;

    // Check keyframes
    const keyframeRegex = /@keyframes\s+(\w+)\s*\{/g;
    let match;
    while ((match = keyframeRegex.exec(content)) !== null) {
      const keyframeName = match[1];
      if (!usedKeyframes.has(keyframeName) && !usedAnimations.has(keyframeName)) {
        // Check in source files for animation-name or animation property
        let foundInSource = false;
        for (const sf of sourceFiles) {
          const sc = readFile(sf.absPath);
          if (sc && (sc.includes(`animation-name: ${keyframeName}`) || sc.includes(`animation: ${keyframeName}`) || sc.includes(`"${keyframeName}"`))) {
            foundInSource = true;
            break;
          }
        }
        if (!foundInSource) {
          findings.push({
            file: file.relPath,
            reason: `Unused @keyframes "${keyframeName}"`,
            evidence: `@keyframes ${keyframeName} defined in ${file.relPath} but no animation-name or animation property references it in any source file`,
            confidence: 90,
            risk: "low",
            recommendation: "Remove unused keyframe.",
            suggestedFix: `Delete @keyframes ${keyframeName} { ... }`,
          });
        }
      }
    }

    // Detect unused CSS custom properties
    // (defined with --var-name but never used via var(--var-name))
    const definedVars = new Set();
    const cssPropRegex = /\s(--[\w-]+)\s*:/g;
    while ((match = cssPropRegex.exec(content)) !== null) {
      if (match[1].startsWith("--")) {
        definedVars.add(match[1]);
      }
    }

    // Check :root variable definitions
    const rootVarRegex = /:root\s*\{([^}]+)\}/g;
    while ((match = rootVarRegex.exec(content)) !== null) {
      const varDefs = match[1];
      const singleVarRegex = /(--[\w-]+)\s*:/g;
      let vm;
      while ((vm = singleVarRegex.exec(varDefs)) !== null) {
        definedVars.add(vm[1]);
      }
    }

    for (const varName of definedVars) {
      if (!usedCSSVars.has(varName)) {
        findings.push({
          file: file.relPath,
          reason: `Unused CSS variable "${varName}"`,
          evidence: `CSS variable ${varName} defined in ${file.relPath} but never referenced via var() in any source or CSS file`,
          confidence: 80,
          risk: "low",
          recommendation: "Remove unused CSS variable.",
          suggestedFix: `Delete --${varName} declaration`,
        });
      }
    }
  }

  // Tailwind config analysis
  const twConfigPath = path.join(ROOT_DIR, "tailwind.config.ts");
  if (fileExists(twConfigPath)) {
    const twContent = readFile(twConfigPath);
    if (twContent) {
      // Check for custom animations defined but not used
      const animRegex = /animation\s*:\s*\{[^}]+\}/g;
      const animMatch = animRegex.exec(twContent);
      // We already check keyframes above — this is supplementary
    }

    // Check for custom colors defined
    const colorRegex = /colors\s*:\s*\{([^}]+)\}/g;
    let colorMatch;
    while ((colorMatch = colorRegex.exec(twContent)) !== null) {
      const colorDefs = colorMatch[1];
      const colorNameRegex = /(\w+)\s*:/g;
      let cm;
      while ((cm = colorNameRegex.exec(colorDefs)) !== null) {
        const colorName = cm[1];
        // Check if used as text-{color}-*, bg-{color}-*, border-{color}-*, etc.
        let found = false;
        for (const sf of sourceFiles) {
          const sc = readFile(sf.absPath);
          if (sc && (sc.includes(`${colorName}-`) || sc.includes(`"${colorName}"`))) {
            found = true;
            break;
          }
        }
        if (!found && !["inherit", "current", "transparent", "black", "white"].includes(colorName)) {
          findings.push({
            file: "tailwind.config.ts",
            reason: `Custom color "${colorName}" defined but possibly unused`,
            evidence: `Color "${colorName}" defined in tailwind.config.ts theme.extend.colors but no ${colorName}-{*} class or "${colorName}" string found in source files`,
            confidence: 50,
            risk: "low",
            recommendation: "If unused, remove the color definition.",
            suggestedFix: `Remove "${colorName}" from tailwind.config.ts colors definition.`,
          });
        }
      }
    }
  }

  return findings;
}

// ─── 15. Security Analyzer ──────────────────────────────────────────────────────

function analyzeSecurity(allFiles) {
  const findings = [];

  const sourceFiles = allFiles.filter(
    (f) =>
      FILE_CATEGORIES.source.has(f.ext) &&
      !f.relPath.includes("node_modules") &&
      !f.relPath.includes("__tests__")
  );

  // Check for console.log/debug/warn/error in production code
  for (const file of sourceFiles) {
    const content = readFile(file.absPath);
    if (!content) continue;

    for (const method of CONSOLE_METHODS) {
      const consoleRegex = new RegExp(
        `console\\.${method}\\s*\\(`,
        "g"
      );
      if (consoleRegex.test(content)) {
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(`console.${method}`)) {
            findings.push({
              file: file.relPath,
              reason: `console.${method}() found in production code`,
              evidence: `Line ${i + 1}: ${lines[i].trim().substring(0, 120)}`,
              confidence: 100,
              risk: method === "log" || method === "debug" ? "low" : "info",
              recommendation:
                method === "log" || method === "debug"
                  ? "Remove or replace with proper logging."
                  : `console.${method}() may be intentional — review context.`,
              suggestedFix: "Remove console statement or use a structured logging library.",
            });
          }
        }
      }
    }

    // Check for debugger statements
    if (/\bdebugger\b/.test(content)) {
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("debugger")) {
          findings.push({
            file: file.relPath,
            reason: "debugger statement found in production code",
            evidence: `Line ${i + 1}: ${lines[i].trim()}`,
            confidence: 100,
            risk: "medium",
            recommendation: "Remove debugger statement before deployment.",
            suggestedFix: "Delete the line containing 'debugger'.",
          });
        }
      }
    }
  }

  // Check CSP in next.config.mjs
  const nextConfigPath = path.join(ROOT_DIR, "next.config.mjs");
  if (fileExists(nextConfigPath)) {
    const ncContent = readFile(nextConfigPath);

    if (ncContent) {
      // Check for unsafe-inline in script-src
      if (
        ncContent.includes("script-src") &&
        ncContent.includes("'unsafe-inline'")
      ) {
        findings.push({
          file: "next.config.mjs",
          reason: "CSP allows 'unsafe-inline' for scripts",
          evidence:
            "Content-Security-Policy script-src includes 'unsafe-inline' which weakens XSS protection",
          confidence: 100,
          risk: "medium",
          recommendation:
            "Consider using strict CSP with nonces or hashes instead of 'unsafe-inline'.",
          suggestedFix:
            "Replace 'unsafe-inline' with a nonce-based approach: script-src 'self' 'nonce-{random}'",
        });
      }

      if (
        ncContent.includes("script-src") &&
        ncContent.includes("'unsafe-eval'")
      ) {
        findings.push({
          file: "next.config.mjs",
          reason: "CSP allows 'unsafe-eval' for scripts",
          evidence:
            "Content-Security-Policy script-src includes 'unsafe-eval' which allows eval()",
          confidence: 100,
          risk: "info",
          recommendation:
            "If possible, remove 'unsafe-eval'. Required by some frameworks/libraries like GSAP.",
          suggestedFix:
            "Remove 'unsafe-eval' from script-src or document why it's needed in a comment.",
        });
      }
    }
  }

  // Check for debug API routes
  const apiRoutes = allFiles.filter(
    (f) =>
      f.relPath.startsWith("src/app/api/") &&
      f.name.startsWith("route.")
  );

  // Check for debug endpoints that shouldn't be public
  for (const route of apiRoutes) {
    if (route.relPath.includes("/debug/") || route.relPath.includes("/dev/")) {
      const content = readFile(route.absPath);
      if (content) {
        findings.push({
          file: route.relPath,
          reason: "Debug API endpoint should not be public in production",
          evidence: `Route handler at ${route.relPath} is a debug endpoint accessible via HTTP`,
          confidence: 100,
          risk: "high",
          recommendation:
            "Protect debug endpoints with authentication or disable in production.",
          suggestedFix:
            "Add authentication check or environment guard: if (process.env.NODE_ENV === 'production') return NextResponse.json({ error: 'Not found' }, { status: 404 })",
        });
      }
    }
  }

  return findings;
}

// ─── 16. Performance Analyzer ───────────────────────────────────────────────────

function analyzePerformance(allFiles) {
  const findings = [];

  // Check for large source files (>500 lines)
  for (const file of allFiles) {
    if (!FILE_CATEGORIES.source.has(file.ext)) continue;
    const content = readFile(file.absPath);
    if (!content) continue;

    const lineCount = countLines(content);
    if (lineCount > 500) {
      findings.push({
        file: file.relPath,
        reason: `Large file (${lineCount} lines)`,
        evidence: `${file.relPath} has ${lineCount} lines of code`,
        confidence: 100,
        risk: lineCount > 1000 ? "medium" : "low",
        recommendation:
          "Consider splitting into smaller, focused modules.",
        suggestedFix: `Split ${file.relPath} into multiple files grouped by concern.`,
      });
    }

    // Check for missing dynamic imports in large components
    if (
      file.ext === ".tsx" &&
      lineCount > 200 &&
      !content.includes("dynamic(") &&
      !content.includes("React.lazy")
    ) {
      findings.push({
        file: file.relPath,
        reason: "Large component without dynamic import",
        evidence: `${file.relPath} has ${lineCount} lines but no dynamic() or React.lazy() usage`,
        confidence: 50,
        risk: "low",
        recommendation:
          "Consider lazy loading sub-components if they are not needed on initial render.",
        suggestedFix:
          "Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))",
      });
    }
  }

  // Check for large assets (>500KB)
  const assetFiles = allFiles.filter(
    (f) =>
      FILE_CATEGORIES.image.has(f.ext) &&
      !f.relPath.startsWith("node_modules")
  );

  for (const asset of assetFiles) {
    if (asset.size > 500 * 1024) {
      findings.push({
        file: asset.relPath,
        reason: "Large asset — may impact load times",
        evidence: `${asset.relPath} is ${(asset.size / 1024).toFixed(1)} KB`,
        confidence: 100,
        risk: asset.size > 1024 * 1024 ? "high" : "medium",
        recommendation:
          "Optimize large assets with compression, resizing, or modern formats (WebP, AVIF).",
        suggestedFix:
          "Consider converting to WebP or AVIF format and compressing to <200 KB.",
      });
    }
  }

  // Check for SVG files
  const svgFiles = allFiles.filter((f) => f.ext === ".svg");
  for (const svg of svgFiles) {
    if (svg.size > 50 * 1024) {
      findings.push({
        file: svg.relPath,
        reason: "Large SVG file — consider optimization",
        evidence: `${svg.relPath} is ${(svg.size / 1024).toFixed(1)} KB`,
        confidence: 100,
        risk: "low",
        recommendation:
          "Optimize SVG with SVGO or similar tool to reduce file size.",
        suggestedFix:
          "Run: npx svgo " + svg.relPath,
      });
    }
  }

  return findings;
}

// ─── 17. GitHub Analyzer ────────────────────────────────────────────────────────

function analyzeGitHub() {
  const findings = [];
  const githubDir = path.join(ROOT_DIR, ".github");

  if (!dirExists(githubDir)) {
    findings.push({
      file: ".github/",
      reason: "No .github directory found",
      evidence:
        "Missing .github/ directory — no issue templates, PR templates, or CI/CD workflows configured",
      confidence: 100,
      risk: "medium",
      recommendation:
        "Create .github/ directory with issue templates, PR template, and CI/CD workflows.",
      suggestedFix:
        "Add .github/ISSUE_TEMPLATE/, .github/PULL_REQUEST_TEMPLATE.md, and .github/workflows/ci.yml",
    });
    return findings;
  }

  // Check for issue templates
  const issueTemplateDir = path.join(githubDir, "ISSUE_TEMPLATE");
  const hasIssueTemplates =
    dirExists(issueTemplateDir) &&
    fs.readdirSync(issueTemplateDir).some((f) => f.endsWith(".md"));

  if (!hasIssueTemplates) {
    findings.push({
      file: ".github/ISSUE_TEMPLATE/",
      reason: "No issue templates found",
      evidence: ".github/ISSUE_TEMPLATE/ directory missing or empty",
      confidence: 100,
      risk: "low",
      recommendation:
        "Add bug report and feature request issue templates.",
      suggestedFix:
        "Create .github/ISSUE_TEMPLATE/bug_report.md and .github/ISSUE_TEMPLATE/feature_request.md",
    });
  } else {
    // Check templates for completeness
    const templates = fs.readdirSync(issueTemplateDir).filter((f) => f.endsWith(".md"));
    const templateNames = templates.map((t) => t.replace(/\.md$/, ""));

    if (!templateNames.some((t) => t.includes("bug"))) {
      findings.push({
        file: ".github/ISSUE_TEMPLATE/",
        reason: "Missing bug report template",
        evidence: "No bug report template found in .github/ISSUE_TEMPLATE/",
        confidence: 100,
        risk: "low",
        recommendation: "Add a bug report template.",
        suggestedFix: "Create .github/ISSUE_TEMPLATE/bug_report.md",
      });
    }
  }

  // Check for PR template
  const hasPRTemplate = fileExists(path.join(githubDir, "PULL_REQUEST_TEMPLATE.md"));
  if (!hasPRTemplate) {
    findings.push({
      file: ".github/PULL_REQUEST_TEMPLATE.md",
      reason: "No PR template found",
      evidence: "Missing PULL_REQUEST_TEMPLATE.md",
      confidence: 100,
      risk: "low",
      recommendation: "Add a PR template to standardize contributions.",
      suggestedFix: "Create .github/PULL_REQUEST_TEMPLATE.md",
    });
  }

  // Check for CI/CD workflows
  const workflowsDir = path.join(githubDir, "workflows");
  if (!dirExists(workflowsDir)) {
    findings.push({
      file: ".github/workflows/",
      reason: "No CI/CD workflows configured",
      evidence:
        ".github/workflows/ directory does not exist — no automated testing, building, or deployment",
      confidence: 100,
      risk: "high",
      recommendation:
        "Set up CI/CD with GitHub Actions to automate testing and deployment.",
      suggestedFix:
        "Create .github/workflows/ci.yml with Node.js CI workflow:\n- Run tests on PR\n- Run lint on PR\n- Build check on PR",
    });
  } else {
    const workflows = fs.readdirSync(workflowsDir).filter(
      (f) => f.endsWith(".yml") || f.endsWith(".yaml")
    );
    if (workflows.length === 0) {
      findings.push({
        file: ".github/workflows/",
        reason: "Empty workflows directory",
        evidence: ".github/workflows/ exists but contains no workflow files",
        confidence: 100,
        risk: "high",
        recommendation: "Add CI/CD workflow files.",
        suggestedFix: "Create .github/workflows/ci.yml",
      });
    }
  }

  // Check for CODEOWNERS
  if (!fileExists(path.join(githubDir, "CODEOWNERS"))) {
    findings.push({
      file: ".github/CODEOWNERS",
      reason: "No CODEOWNERS file",
      evidence: "Missing CODEOWNERS — no automated code review assignments",
      confidence: 100,
      risk: "low",
      recommendation: "Add CODEOWNERS to automatically assign reviewers.",
      suggestedFix:
        "Create .github/CODEOWNERS:\n* @owner\n/src/ @owner\n/src/app/api/ @owner",
    });
  }

  // Check for FUNDING.yml
  if (!fileExists(path.join(githubDir, "FUNDING.yml"))) {
    findings.push({
      file: ".github/FUNDING.yml",
      reason: "No FUNDING.yml",
      evidence: "No funding configuration found",
      confidence: 100,
      risk: "info",
      recommendation: "Add FUNDING.yml if you want to accept sponsorships.",
      suggestedFix: "Create .github/FUNDING.yml with GitHub Sponsors or other links.",
    });
  }

  return findings;
}

// ─── 18. Scoring Engine ─────────────────────────────────────────────────────────

function calculateScores(allFiles, allFindings) {
  const scores = {};

  // Total issues
  const totalIssues = allFindings.length;
  const criticalIssues = allFindings.filter((f) => f.risk === "critical").length;
  const highIssues = allFindings.filter((f) => f.risk === "high").length;
  const mediumIssues = allFindings.filter((f) => f.risk === "medium").length;
  const lowIssues = allFindings.filter((f) => f.risk === "low").length;
  const infoIssues = allFindings.filter((f) => f.risk === "info" || f.risk === "none").length;

  // Repository Health Score
  // 100 - (issues per file * 5) - (critical * 10 + high * 5 + medium * 2 + low * 1)
  const sourceCount = allFiles.filter((f) => FILE_CATEGORIES.source.has(f.ext)).length;
  const docCount = allFiles.filter((f) => f.ext === ".md").length;
  const totalFiles = allFiles.length;

  // Normalize by source file count for fair scoring
  const issueDensity = sourceCount > 0 ? totalIssues / sourceCount : 0;

  let healthScore = 100;
  healthScore -= issueDensity * 20;
  healthScore -= criticalIssues * 8;
  healthScore -= highIssues * 4;
  healthScore -= mediumIssues * 2;
  healthScore -= lowIssues * 0.5;
  healthScore = Math.max(10, Math.min(100, Math.round(healthScore)));

  // Security Score
  let secScore = 100;
  const secFindings = allFindings.filter(
    (f) =>
      (f.risk === "critical") ||
      (f.reason.toLowerCase().includes("secret") && f.risk === "critical") ||
      f.reason.toLowerCase().includes("debugger") ||
      (f.reason.toLowerCase().includes("csp") && f.risk === "medium")
  );
  secScore -= secFindings.length * 8;
  secScore = Math.max(10, Math.min(100, Math.round(secScore)));

  // Documentation Score
  let docScore = 100;
  const brokenLinks = allFindings.filter(
    (f) => f.reason.toLowerCase().includes("broken link") || f.reason.toLowerCase().includes("broken anchor")
  ).length;
  const outdatedDocs = allFindings.filter(
    (f) => f.reason.toLowerCase().includes("outdated") || f.reason.toLowerCase().includes("old folder")
  ).length;
  docScore -= brokenLinks * 10;
  docScore -= outdatedDocs * 5;
  // Bonus for having docs
  if (docCount >= 10) docScore += 10;
  else if (docCount >= 5) docScore += 5;
  docScore = Math.max(0, Math.min(100, Math.round(docScore)));

  // Performance Score
  let perfScore = 100;
  const largeFiles = allFindings.filter((f) => f.reason.toLowerCase().includes("large file")).length;
  const largeAssets = allFindings.filter((f) => f.reason.toLowerCase().includes("large asset")).length;
  perfScore -= largeFiles * 5;
  perfScore -= largeAssets * 8;
  perfScore = Math.max(0, Math.min(100, Math.round(perfScore)));

  // Architecture Score
  let archScore = 100;
  const duplicates = allFindings.filter((f) => f.reason.toLowerCase().includes("duplicate")).length;
  const unusedFiles = allFindings.filter(
    (f) => f.confidence >= 80 && f.risk !== "info" && f.risk !== "none"
  ).length;
  archScore -= duplicates * 8;
  archScore -= unusedFiles * (sourceCount > 0 ? 15 / sourceCount : 1);
  archScore = Math.max(10, Math.min(100, Math.round(archScore)));

  // Maintainability Score
  let maintScore = 100;
  const unusedDeps = allFindings.filter((f) => f.reason.toLowerCase().includes("unused dep")).length;
  const unusedExports = allFindings.filter((f) => f.reason.toLowerCase().includes("export") && f.reason.includes("not imported")).length;
  maintScore -= unusedDeps * 5;
  maintScore -= unusedExports * 3;
  maintScore -= largeFiles * 2;
  maintScore = Math.max(10, Math.min(100, Math.round(maintScore)));

  // Technical Debt Score (inverted — higher means more debt)
  let debtScore = 0;
  debtScore += criticalIssues * 15;
  debtScore += highIssues * 8;
  debtScore += mediumIssues * 4;
  debtScore += lowIssues * 1;
  debtScore = Math.min(100, debtScore);

  // Overall Score (weighted average)
  const overall = Math.round(
    healthScore * 0.25 +
    secScore * 0.20 +
    docScore * 0.10 +
    perfScore * 0.10 +
    archScore * 0.15 +
    maintScore * 0.10 +
    (100 - debtScore) * 0.10
  );

  return {
    repositoryHealth: healthScore,
    security: secScore,
    documentation: docScore,
    performance: perfScore,
    architecture: archScore,
    maintainability: maintScore,
    technicalDebt: debtScore,
    overall,
    breakdown: {
      totalIssues,
      criticalIssues,
      highIssues,
      mediumIssues,
      lowIssues,
      infoIssues,
      totalFiles,
      sourceFiles: sourceCount,
      docFiles: docCount,
    },
  };
}

// ─── 19. Report Generator — Markdown ────────────────────────────────────────────

function generateMarkdownReport(
  allFiles,
  allFindings,
  dependencyGraph,
  scores,
  sqlAnalysis,
  startTime
) {
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const categories = categorizeFiles(allFiles);

  // Categorize findings
  const safeToDelete = allFindings.filter((f) => f.confidence >= 95 && f.risk !== "info" && f.risk !== "none" && !f.reason.toLowerCase().includes("console") && f.suggestedFix !== null);
  const possiblyUnused = allFindings.filter((f) => f.confidence >= 80 && f.confidence < 95 && f.risk !== "info" && f.risk !== "none");
  const manualReview = allFindings.filter((f) => f.confidence < 80 || f.risk === "info" || f.risk === "none");
  const duplicates = allFindings.filter((f) => f.reason.toLowerCase().includes("duplicate"));
  const securityFindings = allFindings.filter((f) => f.reason.toLowerCase().includes("secret") || f.reason.toLowerCase().includes("console") || f.reason.toLowerCase().includes("debugger") || f.reason.toLowerCase().includes("debug api") || f.reason.toLowerCase().includes("csp") || f.reason.toLowerCase().includes("unsafe"));
  const performanceFindings = allFindings.filter((f) => f.reason.toLowerCase().includes("large file") || f.reason.toLowerCase().includes("large asset") || f.reason.toLowerCase().includes("dynamic import"));const brokenDocLinks = allFindings.filter((f) => f.reason.toLowerCase().includes("broken link") || f.reason.toLowerCase().includes("broken anchor") || f.reason.toLowerCase().includes("broken image"));
  const unusedDeps = allFindings.filter((f) => f.reason.toLowerCase().includes("unused dep") || f.reason.toLowerCase().includes("deprecated package") || f.reason.toLowerCase().includes("replaceable"));
  const unusedEnv = allFindings.filter((f) => f.reason.toLowerCase().includes("environment variable") && (f.reason.includes("missing") || f.reason.includes("unused")));
  const nextjsFindings = allFindings.filter((f) => f.file.includes("src/app/") || f.file.includes("next.config") || f.file.includes("middleware"));

  const scoreEmoji = (score) => {
    if (score >= 90) return "🟢";
    if (score >= 75) return "🟡";
    if (score >= 50) return "🟠";
    return "🔴";
  };

  const riskBadge = (risk) => {
    const badges = {
      critical: "🔴 CRITICAL",
      high: "🟠 HIGH",
      medium: "🟡 MEDIUM",
      low: "🔵 LOW",
      info: "ℹ️ INFO",
      none: "✅ NONE",
    };
    return badges[risk] || risk;
  };

  const confidenceStars = (c) => {
    if (c === 100) return "★★★★★";
    if (c >= 95) return "★★★★☆";
    if (c >= 80) return "★★★☆☆";
    if (c >= 50) return "★★☆☆☆";
    return "★☆☆☆☆ MANUAL REVIEW";
  };

  let md = "";
  md += `# DevMon Repository Analysis Report\n\n`;
  md += `> **Generated:** ${new Date().toISOString()} | **Duration:** ${duration}s | **Total Files Scanned:** ${allFiles.length}\n\n`;
  md += `---\n\n`;

  // ── Executive Summary ──
  md += `## Executive Summary\n\n`;
  md += `This report is a production-grade static analysis of the DevMon repository at \`${ROOT_DIR}\`. `;
  md += `It identifies unused code, security concerns, performance optimization opportunities, documentation issues, `;
  md += `and structural improvements across ${allFiles.length} files.\n\n`;

  md += `### Health Dashboard\n\n`;
  md += `| Metric | Score | Status |\n`;
  md += `|--------|-------|--------|\n`;
  md += `| **Repository Health** | ${scores.repositoryHealth}/100 | ${scoreEmoji(scores.repositoryHealth)} |\n`;
  md += `| **Security** | ${scores.security}/100 | ${scoreEmoji(scores.security)} |\n`;
  md += `| **Documentation** | ${scores.documentation}/100 | ${scoreEmoji(scores.documentation)} |\n`;
  md += `| **Performance** | ${scores.performance}/100 | ${scoreEmoji(scores.performance)} |\n`;
  md += `| **Architecture** | ${scores.architecture}/100 | ${scoreEmoji(scores.architecture)} |\n`;
  md += `| **Maintainability** | ${scores.maintainability}/100 | ${scoreEmoji(scores.maintainability)} |\n`;
  md += `| **Technical Debt** | ${scores.technicalDebt}/100 | ${scoreEmoji(100 - scores.technicalDebt)} |\n`;
  md += `| **Overall** | **${scores.overall}/100** | **${scoreEmoji(scores.overall)}** |\n\n`;

  md += `### Issue Breakdown\n\n`;
  md += `| Severity | Count |\n`;
  md += `|----------|-------|\n`;
  md += `| 🔴 Critical | ${scores.breakdown.criticalIssues} |\n`;
  md += `| 🟠 High | ${scores.breakdown.highIssues} |\n`;
  md += `| 🟡 Medium | ${scores.breakdown.mediumIssues} |\n`;
  md += `| 🔵 Low | ${scores.breakdown.lowIssues} |\n`;
  md += `| ℹ️ Info | ${scores.breakdown.infoIssues} |\n`;
  md += `| **Total** | **${scores.breakdown.totalIssues}** |\n\n`;

  // ── Repository Statistics ──
  md += `## Repository Statistics\n\n`;
  md += `| Category | Count | Total Size |\n`;
  md += `|----------|-------|------------|\n`;
  md += `| **Source Files** (ts/tsx/js/jsx) | ${categories.source.length} | ${(categories.source.reduce((s, f) => s + f.size, 0) / 1024).toFixed(1)} KB |\n`;
  md += `| **Styles** (css/scss) | ${categories.styles.length} | ${(categories.styles.reduce((s, f) => s + f.size, 0) / 1024).toFixed(1)} KB |\n`;
  md += `| **Documentation** (md/mdx) | ${categories.markdown.length} | ${(categories.markdown.reduce((s, f) => s + f.size, 0) / 1024).toFixed(1)} KB |\n`;
  md += `| **Assets** (png/jpg/svg/ico/webp) | ${categories.image.length} | ${(categories.image.reduce((s, f) => s + f.size, 0) / 1024).toFixed(1)} KB |\n`;
  md += `| **Fonts** | ${categories.font.length} | ${(categories.font.reduce((s, f) => s + f.size, 0) / 1024).toFixed(1)} KB |\n`;
  md += `| **SQL** | ${categories.sql.length} | ${(categories.sql.reduce((s, f) => s + f.size, 0) / 1024).toFixed(1)} KB |\n`;
  md += `| **Configuration** | ${categories.config.length} | ${(categories.config.reduce((s, f) => s + f.size, 0) / 1024).toFixed(1)} KB |\n`;
  md += `| **Scripts** | ${categories.scripts.length} | ${(categories.scripts.reduce((s, f) => s + f.size, 0) / 1024).toFixed(1)} KB |\n`;
  md += `| **Other** | ${categories.other.length} | ${(categories.other.reduce((s, f) => s + f.size, 0) / 1024).toFixed(1)} KB |\n`;
  md += `| **Total** | **${allFiles.length}** | **${(allFiles.reduce((s, f) => s + f.size, 0) / 1024).toFixed(1)} KB** |\n\n`;

  // ── Next.js Architecture ──
  md += `## Next.js Architecture\n\n`;
  const nextFindings = allFindings.filter(
    (f) =>
      f.file.startsWith("src/app/") ||
      f.file.includes("next.config") ||
      f.file.includes("middleware")
  );

  if (nextFindings.length > 0) {
    md += `### Findings\n\n`;
    for (const finding of nextFindings) {
      md += `- **${finding.file}** — ${finding.reason} (${riskBadge(finding.risk)}, ${confidenceStars(finding.confidence)})\n`;
    }
    md += "\n";
  }

  // App Router structure
  const appDirs = new Map();
  for (const file of allFiles) {
    if (!file.relPath.startsWith("src/app/")) continue;
    const dir = path.dirname(file.relPath);
    if (!appDirs.has(dir)) appDirs.set(dir, []);
    appDirs.get(dir).push(file.name);
  }

  md += `### App Router Structure\n\n`;
  md += `| Route | Files |\n`;
  md += `|-------|-------|\n`;
  const sortedDirs = Array.from(appDirs.keys()).sort();
  for (const dir of sortedDirs) {
    const files = appDirs.get(dir);
    const route = dir.replace(/^src\/app/, "").replace(/\\/g, "/") || "/";
    md += `| \`${route}\` | ${files.sort().join(", ")} |\n`;
  }
  md += "\n";

  // ── Safe To Delete ──
  md += `## Safe To Delete\n\n`;
  if (safeToDelete.length === 0) {
    md += `> ✅ No items confidently identified as safe to delete.\n\n`;
  } else {
    md += `> ⚠️ Items in this section are **safe to delete** with high confidence. Remove with normal caution.\n\n`;
    md += `| File | Issue | Confidence | Risk |\n`;
    md += `|------|-------|------------|------|\n`;
    for (const item of safeToDelete.slice(0, 20)) {
      md += `| \`${item.file}\` | ${item.reason} | ${item.confidence}% | ${riskBadge(item.risk)} |\n`;
    }
    if (safeToDelete.length > 20) {
      md += `| ... and ${safeToDelete.length - 20} more | | | |\n`;
    }
    md += "\n";
  }

  // ── Possibly Unused ──
  md += `## Possibly Unused\n\n`;
  if (possiblyUnused.length === 0) {
    md += `> ✅ No possibly unused items found.\n\n`;
  } else {
    md += `> 🔍 These items appear unused but need confirmation. Review before deleting.\n\n`;
    for (const item of possiblyUnused) {
      md += `### ${item.file}\n\n`;
      md += `- **Issue:** ${item.reason}\n`;
      md += `- **Evidence:** ${item.evidence}\n`;
      md += `- **Confidence:** ${item.confidence}% ${confidenceStars(item.confidence)}\n`;
      md += `- **Risk:** ${riskBadge(item.risk)}\n`;
      md += `- **Recommendation:** ${item.recommendation}\n`;
      if (item.suggestedFix) {
        md += `- **Suggested Fix:** ${item.suggestedFix}\n`;
      }
      md += "\n";
    }
  }

  // ── Manual Review Required ──
  md += `## Manual Review Required\n\n`;
  const manualItems = manualReview.filter((f) => f.risk !== "none" && f.risk !== "info");
  if (manualItems.length === 0) {
    md += `> ✅ No items requiring manual review.\n\n`;
  } else {
    for (const item of manualItems) {
      md += `### ${item.file}\n\n`;
      md += `- **Issue:** ${item.reason}\n`;
      md += `- **Evidence:** ${item.evidence}\n`;
      md += `- **Confidence:** ${item.confidence}% ${confidenceStars(item.confidence)}\n`;
      md += `- **Risk:** ${riskBadge(item.risk)}\n`;
      md += `- **Recommendation:** ${item.recommendation}\n`;
      if (item.suggestedFix) {
        md += `- **Suggested Fix:** ${item.suggestedFix}\n`;
      }
      md += "\n";
    }
  }

  // ── Duplicate Code ──
  md += `## Duplicate Code\n\n`;
  if (duplicates.length === 0) {
    md += `> ✅ No duplicate code detected.\n\n`;
  } else {
    for (const item of duplicates) {
      md += `### ${item.file}\n\n`;
      md += `- **Issue:** ${item.reason}\n`;
      md += `- **Evidence:** ${item.evidence}\n`;
      md += `- **Confidence:** ${item.confidence}% ${confidenceStars(item.confidence)}\n`;
      md += `- **Risk:** ${riskBadge(item.risk)}\n`;
      md += `- **Recommendation:** ${item.recommendation}\n`;
      if (item.suggestedFix) {
        md += `- **Suggested Fix:** ${item.suggestedFix}\n`;
      }
      md += "\n";
    }
  }

  // ── Security Findings ──
  md += `## Security Findings\n\n`;
  if (securityFindings.length === 0) {
    md += `> ✅ No security issues found.\n\n`;
  } else {
    for (const item of securityFindings) {
      md += `### ${item.file}\n\n`;
      md += `- **Issue:** ${item.reason}\n`;
      md += `- **Evidence:** ${item.evidence}\n`;
      md += `- **Confidence:** ${item.confidence}% ${confidenceStars(item.confidence)}\n`;
      md += `- **Risk:** ${riskBadge(item.risk)}\n`;
      md += `- **Recommendation:** ${item.recommendation}\n`;
      if (item.suggestedFix) {
        md += `- **Suggested Fix:** ${item.suggestedFix}\n`;
      }
      md += "\n";
    }
  }

  // ── Unused Dependencies ──
  md += `## Unused Dependencies\n\n`;
  if (unusedDeps.length === 0) {
    md += `> ✅ No unused dependencies detected.\n\n`;
  } else {
    md += `| Package | Issue | Confidence | Risk |\n`;
    md += `|---------|-------|------------|------|\n`;
    for (const item of unusedDeps) {
      md += `| \`${item.reason.split('"')[1] || item.reason}\` | ${item.reason} | ${item.confidence}% | ${riskBadge(item.risk)} |\n`;
    }
    md += "\n";
  }

  // ── Environment Variables ──
  md += `## Environment Variables\n\n`;
  if (unusedEnv.length === 0) {
    md += `> ✅ No environment variable issues found.\n\n`;
  } else {
    for (const item of unusedEnv) {
      md += `### ${item.file}\n\n`;
      md += `- **Issue:** ${item.reason}\n`;
      md += `- **Evidence:** ${item.evidence}\n`;
      md += `- **Confidence:** ${item.confidence}% ${confidenceStars(item.confidence)}\n`;
      md += `- **Risk:** ${riskBadge(item.risk)}\n`;
      md += `- **Recommendation:** ${item.recommendation}\n`;
      if (item.suggestedFix) {
        md += `- **Suggested Fix:** ${item.suggestedFix}\n`;
      }
      md += "\n";
    }
  }

  // ── Documentation Issues ──
  md += `## Documentation Issues\n\n`;
  if (brokenDocLinks.length === 0) {
    md += `> ✅ No documentation issues found.\n\n`;
  } else {
    for (const item of brokenDocLinks) {
      md += `### ${item.file}\n\n`;
      md += `- **Issue:** ${item.reason}\n`;
      md += `- **Evidence:** ${item.evidence}\n`;
      md += `- **Confidence:** ${item.confidence}% ${confidenceStars(item.confidence)}\n`;
      md += `- **Risk:** ${riskBadge(item.risk)}\n`;
      md += `- **Recommendation:** ${item.recommendation}\n`;
      if (item.suggestedFix) {
        md += `- **Suggested Fix:** ${item.suggestedFix}\n`;
      }
      md += "\n";
    }
  }

  // ── Performance Findings ──
  md += `## Performance Findings\n\n`;
  if (performanceFindings.length === 0) {
    md += `> ✅ No performance issues found.\n\n`;
  } else {
    for (const item of performanceFindings) {
      md += `### ${item.file}\n\n`;
      md += `- **Issue:** ${item.reason}\n`;
      md += `- **Evidence:** ${item.evidence}\n`;
      md += `- **Confidence:** ${item.confidence}% ${confidenceStars(item.confidence)}\n`;
      md += `- **Risk:** ${riskBadge(item.risk)}\n`;
      md += `- **Recommendation:** ${item.recommendation}\n`;
      if (item.suggestedFix) {
        md += `- **Suggested Fix:** ${item.suggestedFix}\n`;
      }
      md += "\n";
    }
  }

  // ── Supabase / Database Analysis ──
  md += `## Supabase / Database Analysis\n\n`;
  if (sqlAnalysis) {
    md += `### Database Objects\n\n`;
    md += `| Object Type | Names |\n`;
    md += `|-------------|-------|\n`;
    if (sqlAnalysis.summary.tables.length > 0) {
      md += `| Tables | ${sqlAnalysis.summary.tables.join(", ")} |\n`;
    }
    if (sqlAnalysis.summary.functions.length > 0) {
      md += `| Functions/RPCs | ${sqlAnalysis.summary.functions.join(", ")} |\n`;
    }
    if (sqlAnalysis.summary.policies.length > 0) {
      md += `| RLS Policies | ${sqlAnalysis.summary.policies.join(", ")} |\n`;
    }
    if (sqlAnalysis.summary.indexes.length > 0) {
      md += `| Indexes | ${sqlAnalysis.summary.indexes.join(", ")} |\n`;
    }
    if (sqlAnalysis.summary.rpcCalls.length > 0) {
      md += `| Called RPCs | ${sqlAnalysis.summary.rpcCalls.join(", ")} |\n`;
    }
    md += `| Active Migrations | ${sqlAnalysis.summary.activeMigrations} |\n`;
    md += `| Archived Migrations | ${sqlAnalysis.summary.archivedMigrations} |\n`;
    md += "\n";

    if (sqlAnalysis.findings.length > 0) {
      md += `### Database Findings\n\n`;
      for (const item of sqlAnalysis.findings) {
        md += `- **${item.file}** — ${item.reason} (${riskBadge(item.risk)})\n`;
      }
      md += "\n";
    }
  }

  // ── Clean Up Priority ──
  md += `## Cleanup Priority\n\n`;

  // Build priority items
  const priorityItems = [];
  for (const item of allFindings) {
    let priority = 0;
    if (item.risk === "critical") priority += 100;
    if (item.risk === "high") priority += 50;
    if (item.risk === "medium") priority += 20;
    if (item.confidence >= 95) priority += 30;
    if (item.confidence >= 80) priority += 10;
    if (item.suggestedFix === null) continue;

    priorityItems.push({ ...item, priority });
  }
  priorityItems.sort((a, b) => b.priority - a.priority);

  md += `| Priority | File | Issue | Risk |\n`;
  md += `|----------|------|-------|------|\n`;
  for (const item of priorityItems.slice(0, 15)) {
    const prioLabel = item.priority >= 100 ? "🔴 P0" : item.priority >= 60 ? "🟠 P1" : item.priority >= 30 ? "🟡 P2" : "🔵 P3";
    md += `| ${prioLabel} | \`${item.file}\` | ${item.reason} | ${riskBadge(item.risk)} |\n`;
  }
  md += "\n";

  // ── Repository Health Checks ──
  md += `## Repository Health Checks\n\n`;

  // Check for missing files
  const checks = [
    { name: "README.md", passes: fileExists(path.join(ROOT_DIR, "README.md")), desc: "Repository README" },
    { name: "LICENSE", passes: fileExists(path.join(ROOT_DIR, "LICENSE")), desc: "License file" },
    { name: "CONTRIBUTING.md", passes: fileExists(path.join(ROOT_DIR, "CONTRIBUTING.md")), desc: "Contribution guide" },
    { name: "SECURITY.md", passes: fileExists(path.join(ROOT_DIR, "SECURITY.md")), desc: "Security policy" },
    { name: "CODE_OF_CONDUCT.md", passes: fileExists(path.join(ROOT_DIR, "CODE_OF_CONDUCT.md")), desc: "Code of conduct" },
    { name: ".gitignore", passes: fileExists(path.join(ROOT_DIR, ".gitignore")), desc: "Git ignore rules" },
    { name: ".env.example", passes: fileExists(path.join(ROOT_DIR, ".env.example")), desc: "Environment template" },
    { name: "CI/CD Workflows", passes: dirExists(path.join(ROOT_DIR, ".github", "workflows")), desc: "Automated CI/CD" },
    { name: "PR Template", passes: fileExists(path.join(ROOT_DIR, ".github", "PULL_REQUEST_TEMPLATE.md")), desc: "PR template" },
    { name: "Issue Templates", passes: dirExists(path.join(ROOT_DIR, ".github", "ISSUE_TEMPLATE")), desc: "Issue templates" },
    { name: "tsconfig.json", passes: fileExists(path.join(ROOT_DIR, "tsconfig.json")), desc: "TypeScript config" },
    { name: "next.config.mjs", passes: fileExists(path.join(ROOT_DIR, "next.config.mjs")), desc: "Next.js config" },
    { name: "tailwind.config.ts", passes: fileExists(path.join(ROOT_DIR, "tailwind.config.ts")), desc: "Tailwind config" },
    { name: "Vitest Config", passes: fileExists(path.join(ROOT_DIR, "vitest.config.ts")), desc: "Test runner config" },
    { name: "ESLint Config", passes: fileExists(path.join(ROOT_DIR, ".eslintrc.json")), desc: "Linter config" },
  ];

  md += `| Check | Status | Description |\n`;
  md += `|-------|--------|-------------|\n`;
  for (const check of checks) {
    const status = check.passes ? "✅" : "❌";
    md += `| ${check.name} | ${status} | ${check.desc} |\n`;
  }
  md += "\n";

  // ── All Findings (Full List) ──
  md += `## All Findings (${allFindings.length})\n\n`;
  md += `| # | File | Issue | Confidence | Risk |\n`;
  md += `|---|------|-------|------------|------|\n`;
  let idx = 0;
  for (const item of allFindings) {
    idx++;
    md += `| ${idx} | \`${item.file}\` | ${item.reason} | ${item.confidence === "MANUAL REVIEW" ? item.confidence : item.confidence + "%"} | ${riskBadge(item.risk)} |\n`;
  }
  md += "\n";

  // ── Footer ──
  md += `---\n\n`;
  md += `> **Report generated by DevMon Repository Analyzer v1.0.0**\n`;
  md += `> Run \`node analyze-repo.js\` to regenerate.\n`;
  md += `> Scanned ${allFiles.length} files in ${duration}s.\n`;

  return md;
}

// ─── 20. Report Generator — JSON ───────────────────────────────────────────────

function generateJSONReport(allFiles, allFindings, scores, sqlAnalysis, startTime) {
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const categories = categorizeFiles(allFiles);

  const findingsByCategory = {
    safeToDelete: allFindings.filter((f) => f.confidence >= 95 && f.risk !== "info" && f.risk !== "none"),
    possiblyUnused: allFindings.filter((f) => f.confidence >= 80 && f.confidence < 95 && f.risk !== "info" && f.risk !== "none"),
    manualReview: allFindings.filter((f) => f.confidence < 80 && f.risk !== "info" && f.risk !== "none"),
    info: allFindings.filter((f) => f.risk === "info" || f.risk === "none"),
  };

  return {
    metadata: {
      analyzer: "DevMon Repository Analyzer v1.0.0",
      generatedAt: new Date().toISOString(),
      scanDuration: `${duration}s`,
      repository: "DevMon",
      rootPath: ROOT_DIR,
      totalFiles: allFiles.length,
    },
    statistics: {
      filesByCategory: Object.fromEntries(
        Object.entries(categories).map(([k, v]) => [k, v.length])
      ),
      totalSizeKB: (allFiles.reduce((s, f) => s + f.size, 0) / 1024).toFixed(1),
      sourceFiles: categories.source.length,
      documentationFiles: categories.markdown.length,
      assetFiles: categories.image.length,
      sqlFiles: categories.sql.length,
      configFiles: categories.config.length,
    },
    scores,
    findings: {
      total: allFindings.length,
      bySeverity: {
        critical: scores.breakdown.criticalIssues,
        high: scores.breakdown.highIssues,
        medium: scores.breakdown.mediumIssues,
        low: scores.breakdown.lowIssues,
        info: scores.breakdown.infoIssues,
      },
      byCategory: {
        safeToDelete: findingsByCategory.safeToDelete.length,
        possiblyUnused: findingsByCategory.possiblyUnused.length,
        manualReview: findingsByCategory.manualReview.length,
        info: findingsByCategory.info.length,
      },
      items: allFindings,
    },
    nextjs: {
      appRouterDirectories: sortedDirsCount(allFiles),
      apiRoutes: allFiles.filter((f) => f.relPath.startsWith("src/app/api/") && f.name.startsWith("route.")).length,
      middleware: allFiles.filter((f) => f.name === "middleware.ts" || f.name === "middleware.js").length,
      hasLoadingUI: allFiles.some((f) => f.name === "loading.tsx"),
      hasErrorUI: allFiles.some((f) => f.name === "error.tsx"),
      hasNotFoundUI: allFiles.some((f) => f.name === "not-found.tsx"),
    },
    supabase: sqlAnalysis
      ? {
          tables: sqlAnalysis.summary.tables,
          functions: sqlAnalysis.summary.functions,
          policies: sqlAnalysis.summary.policies,
          indexes: sqlAnalysis.summary.indexes,
          activeMigrations: sqlAnalysis.summary.activeMigrations,
          archivedMigrations: sqlAnalysis.summary.archivedMigrations,
          rpcCalls: sqlAnalysis.summary.rpcCalls,
        }
      : null,
  };
}

function sortedDirsCount(allFiles) {
  const dirs = new Set();
  for (const file of allFiles) {
    if (file.relPath.startsWith("src/app/")) {
      dirs.add(path.dirname(file.relPath));
    }
  }
  return Array.from(dirs).sort();
}

// ─── 21. Orchestrator ───────────────────────────────────────────────────────────

function main() {
  const startTime = Date.now();
  console.log("🔍 DevMon Repository Analyzer v1.0.0");
  console.log(`📂 Scanning: ${ROOT_DIR}`);
  console.log("");

  // Step 1: Scan all files
  console.log("  📁 Scanning filesystem...");
  const allFiles = walkDirectory(ROOT_DIR, "");
  console.log(`     Found ${allFiles.length} files`);

  // Step 2: Build dependency graph
  console.log("  🔗 Building dependency graph...");
  const dependencyGraph = buildDependencyGraph(allFiles);
  const importCount = Object.values(dependencyGraph).reduce(
    (s, n) => s + n.imports.length,
    0
  );
  console.log(`     ${Object.keys(dependencyGraph).length} source files, ${importCount} imports analyzed`);

  // Step 3: Run all analyzers
  console.log("  🧪 Running analyzers...");
  const allFindings = [];

  console.log("     - Next.js conventions...");
  allFindings.push(...analyzeNextJS(allFiles));

  console.log("     - SQL/Supabase analysis...");
  const sqlAnalysis = analyzeSQLFiles(allFiles);
  allFindings.push(...sqlAnalysis.findings);

  console.log("     - Unused code detection...");
  allFindings.push(...detectUnusedCode(allFiles, dependencyGraph));

  console.log("     - Duplicate code detection...");
  allFindings.push(...detectDuplicates(allFiles));

  console.log("     - Asset analysis...");
  allFindings.push(...analyzeAssets(allFiles, dependencyGraph));

  console.log("     - Dependency analysis...");
  allFindings.push(...analyzeDependencies(allFiles));

  console.log("     - Environment variable analysis...");
  allFindings.push(...analyzeEnvVars(allFiles));

  console.log("     - Documentation analysis...");
  allFindings.push(...analyzeDocumentation(allFiles));

  console.log("     - CSS/Tailwind analysis...");
  allFindings.push(...analyzeCSS(allFiles));

  console.log("     - Security analysis...");
  allFindings.push(...analyzeSecurity(allFiles));

  console.log("     - Performance analysis...");
  allFindings.push(...analyzePerformance(allFiles));

  console.log("     - GitHub analysis...");
  allFindings.push(...analyzeGitHub());

  // Step 4: Calculate scores
  console.log("  📊 Calculating scores...");
  const scores = calculateScores(allFiles, allFindings);

  // Step 5: Generate reports
  console.log("  📝 Generating reports...");

  const mdReport = generateMarkdownReport(
    allFiles,
    allFindings,
    dependencyGraph,
    scores,
    sqlAnalysis,
    startTime
  );
  fs.writeFileSync(REPORT_MD, mdReport, "utf-8");
  console.log(`     ✅ ${REPORT_MD}`);

  const jsonReport = generateJSONReport(
    allFiles,
    allFindings,
    scores,
    sqlAnalysis,
    startTime
  );
  fs.writeFileSync(REPORT_JSON, JSON.stringify(jsonReport, null, 2), "utf-8");
  console.log(`     ✅ ${REPORT_JSON}`);

  // Step 6: Print summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("");
  console.log("  ─────────────────────────────────────────────");
  console.log(`  ✅ Analysis complete in ${duration}s`);
  console.log("");
  console.log(`  📊 Health Score:     ${scores.repositoryHealth}/100`);
  console.log(`  🔒 Security Score:   ${scores.security}/100`);
  console.log(`  📚 Documentation:    ${scores.documentation}/100`);
  console.log(`  ⚡ Performance:      ${scores.performance}/100`);
  console.log(`  🏗️  Architecture:     ${scores.architecture}/100`);
  console.log(`  🔧 Maintainability:  ${scores.maintainability}/100`);
  console.log(`  💳 Technical Debt:   ${scores.technicalDebt}/100`);
  console.log(`  ★ Overall:           ${scores.overall}/100`);
  console.log("");
  console.log(`  Found ${allFindings.length} issues:`);
  const critical = allFindings.filter((f) => f.risk === "critical").length;
  const high = allFindings.filter((f) => f.risk === "high").length;
  const medium = allFindings.filter((f) => f.risk === "medium").length;
  const low = allFindings.filter((f) => f.risk === "low").length;
  console.log(`     🔴 ${critical} critical  🟠 ${high} high  🟡 ${medium} medium  🔵 ${low} low`);
  console.log("");
  console.log(`  ▶ Reports: repository-analysis.md, repository-analysis.json`);
}

main();
