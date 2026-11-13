import { build } from 'esbuild';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const portfolio = process.argv.includes('--portfolio');
const dist = portfolio ? join(root, '../../client/public/source-code-atlas') : join(root, 'dist');
await mkdir(join(dist, 'example'), { recursive: true });
await build({
  absWorkingDir: root,
  entryPoints: { app:'src/app.js', 'analysis-worker':'src/analysis-worker.js' },
  outdir: dist, bundle:true, minify:true, format:'esm', target:'es2022',
  legalComments:'none'
});
const require = createRequire(import.meta.url);
const deps = ['python', 'common', 'lr', 'highlight'];
const notices = await Promise.all(deps.map(async dep => {
  const entry = require.resolve('@lezer/' + dep);
  const pkg = dirname(dirname(entry));
  const { version } = JSON.parse(await readFile(join(pkg, 'package.json'), 'utf8'));
  return `@lezer/${dep} ${version}\n${await readFile(join(pkg, 'LICENSE'), 'utf8')}`;
}));
await Promise.all([
  ...['index.html','atlas.svg','src/styles.css','src/graph.css','example/LICENSE.txt'].map(file =>
    copyFile(join(root,file),join(dist,file.replace(/^src\//,'')))),
  ...(!portfolio ? [writeFile(join(dist,'.nojekyll'), '')] : []),
  writeFile(join(dist,'THIRD-PARTY-NOTICES.txt'), notices.join('\n\n'))
]);
console.log(`Built static demo: ${dist}`);
