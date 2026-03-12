#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const SITE_DIR = path.join(__dirname, '..');
const BACKUP_ROOT = path.join(SITE_DIR, '.sanity-backups');
const CACHE_ROOT = path.join(SITE_DIR, '.sanity-cache');
const LANDING_PAGES_CACHE_DIR = path.join(SITE_DIR, '.sanity-landing-pages');
const LANDING_PAGES_GENERATED_FILE = path.join(
  SITE_DIR,
  'src',
  'data',
  'sanity-landing-pages.generated.json'
);
const RELEASE_NOTES_GENERATED_FILE = path.join(
  SITE_DIR,
  'src',
  'data',
  'sanity-release-notes.generated.json'
);

function formatRunId(date) {
  return date.toISOString().replace(/[:.]/g, '-');
}

function getBackupDirectories() {
  if (!fs.existsSync(BACKUP_ROOT)) return [];
  return fs
    .readdirSync(BACKUP_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();
}

function parseArgs(argv) {
  const args = Array.isArray(argv) ? argv : [];
  const list = args.includes('--list');
  const apply = args.includes('--apply');
  const noSafetyBackup = args.includes('--no-safety-backup');
  const runFlagIndex = args.indexOf('--run');
  const runFlagValue = runFlagIndex >= 0 ? args[runFlagIndex + 1] : null;
  const runInline = args.find((arg) => arg.startsWith('--run='));
  const runId = runInline ? runInline.slice('--run='.length) : runFlagValue || null;
  return {
    list,
    apply,
    noSafetyBackup,
    runId,
  };
}

function copyIfExists(sourcePath, targetPath, kind) {
  if (!fs.existsSync(sourcePath)) return false;
  if (kind === 'directory') {
    fs.rmSync(targetPath, { recursive: true, force: true });
    fs.cpSync(sourcePath, targetPath, { recursive: true });
    return true;
  }
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.cpSync(sourcePath, targetPath);
  return true;
}

function createSafetyBackup() {
  const runId = `manual-pre-rollback-${formatRunId(new Date())}`;
  const targetDir = path.join(BACKUP_ROOT, runId);
  fs.mkdirSync(targetDir, { recursive: true });

  if (fs.existsSync(CACHE_ROOT)) {
    fs.cpSync(CACHE_ROOT, path.join(targetDir, 'sanity-cache'), { recursive: true });
  }
  if (fs.existsSync(LANDING_PAGES_CACHE_DIR)) {
    fs.cpSync(LANDING_PAGES_CACHE_DIR, path.join(targetDir, 'sanity-landing-pages'), { recursive: true });
  }
  if (fs.existsSync(LANDING_PAGES_GENERATED_FILE)) {
    fs.cpSync(
      LANDING_PAGES_GENERATED_FILE,
      path.join(targetDir, 'sanity-landing-pages.generated.json')
    );
  }
  if (fs.existsSync(RELEASE_NOTES_GENERATED_FILE)) {
    fs.cpSync(
      RELEASE_NOTES_GENERATED_FILE,
      path.join(targetDir, 'sanity-release-notes.generated.json')
    );
  }
  return targetDir;
}

function run(options) {
  const backupDirs = getBackupDirectories();
  if (backupDirs.length === 0) {
    throw new Error('[sanity-rollback] No backup directories found in .sanity-backups/');
  }

  if (options.list) {
    console.log('[sanity-rollback] Available backups:');
    backupDirs.forEach((name) => console.log(`- ${name}`));
    return;
  }

  const selected = options.runId || backupDirs[0];
  const selectedDir = path.join(BACKUP_ROOT, selected);
  if (!fs.existsSync(selectedDir)) {
    throw new Error(`[sanity-rollback] Backup not found: ${selected}`);
  }

  if (!options.apply) {
    console.log(`[sanity-rollback] Selected backup: ${selected}`);
    console.log('[sanity-rollback] Dry run only. Re-run with --apply to restore files.');
    return;
  }

  if (!options.noSafetyBackup) {
    const safetyBackupDir = createSafetyBackup();
    console.log(
      `[sanity-rollback] Safety backup created -> ${path.relative(SITE_DIR, safetyBackupDir).replace(/\\/g, '/')}`
    );
  }

  const restored = [];
  if (copyIfExists(path.join(selectedDir, 'sanity-cache'), CACHE_ROOT, 'directory')) {
    restored.push('.sanity-cache/');
  }
  if (copyIfExists(path.join(selectedDir, 'sanity-landing-pages'), LANDING_PAGES_CACHE_DIR, 'directory')) {
    restored.push('.sanity-landing-pages/');
  }
  if (
    copyIfExists(
      path.join(selectedDir, 'sanity-landing-pages.generated.json'),
      LANDING_PAGES_GENERATED_FILE,
      'file'
    )
  ) {
    restored.push('src/data/sanity-landing-pages.generated.json');
  }
  if (
    copyIfExists(
      path.join(selectedDir, 'sanity-release-notes.generated.json'),
      RELEASE_NOTES_GENERATED_FILE,
      'file'
    )
  ) {
    restored.push('src/data/sanity-release-notes.generated.json');
  }

  if (restored.length === 0) {
    console.log(`[sanity-rollback] Backup ${selected} did not contain restorable files.`);
    return;
  }

  console.log(`[sanity-rollback] Restored from ${selected}:`);
  restored.forEach((entry) => console.log(`- ${entry}`));
}

if (require.main === module) {
  const options = parseArgs(process.argv.slice(2));
  try {
    run(options);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = { run };
