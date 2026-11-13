import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { serve } from '../scripts/serve.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const qa = join(root, '.qa');
const paths = ['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','/usr/bin/google-chrome','/usr/bin/chromium','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
const executablePath = process.env.ATLAS_CHROME || paths.find(path => existsSync(path));
const { server, url } = await serve();
let browser;
try {
  browser = await chromium.launch({ executablePath, headless:true });
  await mkdir(qa, { recursive:true });
  const context = await browser.newContext({ viewport:{ width:1440,height:1000 }, serviceWorkers:'block' });
  const requests = [], errors = [], responses = [];
  context.on('request', req => requests.push({ url:req.url(), method:req.method(), body:req.postData() }));
  context.on('response', res => responses.push({ url:res.url(), status:res.status() }));
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const hasText = async (locator, expected) => {
    await locator.waitFor();
    assert.match(await locator.innerText(), expected);
  };
  assert.equal((await page.goto(url)).status(), 200);
  await page.screenshot({ path:join(qa,'desktop-start.png'), fullPage:true });
  await page.getByRole('button', { name:'공개 예제 열기' }).click();
  await hasText(page.locator('#project-title'), /add-trailing-comma/);
  for (const [label, target, line] of [
    [/AST로 변환/, 'ast_parse', 29],
    [/콜백 수집/, 'visit', 33],
    [/들여쓰기 정리/, 'fix_brace', 47],
  ]) {
    await page.getByRole('button', { name:label }).click();
    await hasText(page.locator('#route'), new RegExp('main → fix_file → _fix_src → ' + target));
    assert.equal(await page.locator('#graph [data-call-id]').count(), 3);
    await page.locator('#graph [data-call-id]').and(page.getByRole('button', { name:new RegExp(target + '.* ' + line + '줄') })).press('Enter');
    await hasText(page.locator('#details'), new RegExp('_main.py:' + line + '\\b'));
    await hasText(page.locator('#details'), new RegExp(target + '\\('));
    assert.equal(await page.locator('#details .permalink').first().getAttribute('href'),
      `https://github.com/asottile/add-trailing-comma/blob/73c775a66303f25cbf03b0c2e3c14e71253f198a/add_trailing_comma/_main.py#L${line}`);
  }
  await page.screenshot({ path:join(qa,'desktop-example.png'), fullPage:true });
  const beforeLocal = requests.length;
  await page.locator('#folder').setInputFiles(join(root,'tests','fixtures','local-project'));
  await page.getByRole('heading', { name:'local-project', exact:true }).waitFor();
  await hasText(page.locator('#project-title'), /^local-project$/);
  const entry = page.locator('#entry');
  assert.match(await entry.locator('option:checked').innerText(), /app/);
  const main = await entry.locator('option').filter({ hasText:/^app\.main ·/ }).first().getAttribute('value');
  await entry.selectOption(main);
  await hasText(page.locator('#route'), /진입점: app\.main/);
  const dynamic = page.locator('#graph [data-unresolved-call-id]').filter({ hasText:'callback' }).first();
  await dynamic.press('Space');
  await hasText(page.locator('#details'), /해석되지 않은 호출/);
  await hasText(page.locator('#details'), /app\.py:11/);
  await page.getByRole('searchbox').fill('total');
  await hasText(page.locator('#result-count'), /^3개$/);
  assert.equal(await page.locator('#results').getByRole('button').filter({ hasText:'shop/audit.py:1' }).count(), 1);
  await page.locator('#results').getByRole('button').filter({ hasText:'shop/sales.py:4' }).click();
  await hasText(page.locator('#route'), /main → run → total/);
  await hasText(page.locator('#details'), /shop\.sales\.total/);
  await page.locator('#graph [data-function-id]').filter({ hasText:'run' }).press('Enter');
  await hasText(page.locator('#details'), /shop\.sales\.run/);
  const firstEdge = page.locator('#graph [data-call-id] .atlas-graph__edge-hit').first();
  await firstEdge.scrollIntoViewIfNeeded();
  const position = await firstEdge.evaluate(path => {
    const point = path.getPointAtLength(path.getTotalLength() / 2);
    const { x, y } = point.matrixTransform(path.getScreenCTM());
    return { x, y };
  });
  await page.mouse.click(position.x, position.y);
  await hasText(page.locator('#details'), /app\.py:8/);
  await hasText(page.locator('#details'), /sales\.run\(\)/);
  assert.equal(await page.locator('#details .permalink').count(), 0);
  const storage = await page.evaluate(async () => ({
    local:localStorage.length, session:sessionStorage.length, databases:(await indexedDB.databases()).length,
    caches:(await caches.keys()).length, cookies:document.cookie
  }));
  assert.deepEqual(storage, { local:0,session:0,databases:0,caches:0,cookies:'' });
  assert.deepEqual(await context.cookies(), []);
  const localRequests = requests.slice(beforeLocal);
  assert.ok(localRequests.every(req => req.url === url + 'analysis-worker.js' && req.method === 'GET' && req.body === null),
    JSON.stringify(requests.slice(beforeLocal)));
  await page.reload();
  assert.equal(await page.locator('#workspace').isVisible(), false);
  assert.equal(await page.locator('#folder').evaluate(input => input.files.length), 0);
  assert.equal(await page.getByRole('searchbox', { includeHidden:true }).inputValue(), '');

  await page.setViewportSize({ width:390,height:844 });
  await page.getByRole('button', { name:'공개 예제 열기' }).click();
  await hasText(page.locator('#project-title'), /add-trailing-comma/);
  await page.getByRole('searchbox').fill('fix_brace');
  await page.locator('#results').getByRole('button').filter({ hasText:/_token_helpers\.py/ }).click();
  await hasText(page.locator('#details'), /_token_helpers\.py:113/);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth === innerWidth), true);
  assert.equal(await page.locator('#graph').evaluate(node => node.scrollWidth > node.clientWidth), true);
  await page.screenshot({ path:join(qa,'mobile-example.png'), fullPage:true });
  const allowed = new Set(['','index.html','app.js','analysis-worker.js','styles.css','graph.css','atlas.svg'].map(asset => url + asset));
  assert.ok(requests.every(req => allowed.has(req.url) && req.method === 'GET' && req.body === null), JSON.stringify(requests));
  assert.ok(responses.every(res => res.status === 200), JSON.stringify(responses));
  assert.deepEqual(errors, []);
  console.log(`Chromium ${browser.version()}: example (3 paths and pinned line links), folder picker (5 files), search, node/edge evidence, unresolved call, mobile (390px), refresh, and browser storage passed.`);
  console.log(`Network: ${requests.length} requests, all same-origin static GET with no body. During local analysis and navigation: ${localRequests.length ? localRequests.length + ' worker script GET only' : 'no requests'}. Screenshots: ${qa}`);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
