import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

// Plugin to load .html files as string modules
const htmlPlugin = {
  name: 'html-loader',
  setup(build) {
    build.onLoad({ filter: /\.html$/ }, async (args) => {
      const text = await fs.promises.readFile(args.path, 'utf8');
      return {
        contents: `export default ${JSON.stringify(text)};`,
        loader: 'js',
      };
    });
  },
};

async function build() {
  console.log('Building get.gs with esbuild...');

  await esbuild.build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    outfile: 'get.gs',
    format: 'iife',
    globalName: '_App',
    target: 'es2020',
    plugins: [htmlPlugin],
    banner: {
      js: `// สร้างอัตโนมัติจาก src/ — ห้ามแก้ไฟล์นี้โดยตรง\n`
    },
    footer: {
      js: `
// --- Google Apps Script Global Triggers & Entry Points ---
function doGet(e) { return _App.doGet(e); }
function doPost(e) { return _App.doPost(e); }
function onOpen() { return _App.onOpen(); }
function setupTriggers() { return _App.setupTriggers(); }
function syncOtaCalendars() { return _App.syncOtaCalendars(); }
function menuTestEmails() { return _App.menuTestEmails(); }
function menuCheckQuota() { return _App.menuCheckQuota(); }
function menuVerifySetup() { return _App.menuVerifySetup(); }
function menuCleanup() { return _App.menuCleanup(); }
function menuSyncOta() { return _App.menuSyncOta(); }
function menuCheckOtaUrls() { return _App.menuCheckOtaUrls(); }
`
    }
  });

  const stats = fs.statSync('get.gs');
  console.log(`Build completed: get.gs (${(stats.size / 1024).toFixed(1)} KB)`);
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
