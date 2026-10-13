import test from 'node:test';
import assert from 'node:assert/strict';
import { startInstallerDownload } from '../src/lib/installer-download.ts';

test('download starts once per verified order and waits for a license', () => {
  const originalDocument = globalThis.document;
  const originalStorage = globalThis.sessionStorage;
  const storage = new Map();
  const clicks = [];
  globalThis.sessionStorage = {getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value)};
  globalThis.document = {body: {appendChild() {}}, createElement: () => ({style: {}, click() {clicks.push(this.href)}, remove() {}})};
  try {
    const url = 'https://example.test/ScanMyDisk-Setup-x64.exe';
    startInstallerDownload('order-fixture', '', url);
    assert.equal(clicks.length, 0);
    startInstallerDownload('order-fixture', 'paid-license', url);
    startInstallerDownload('order-fixture', 'paid-license', url);
    assert.deepEqual(clicks, [url]);
    startInstallerDownload('order-other', 'paid-license', 'http://example.test/file.exe');
    assert.equal(clicks.length, 1);
    globalThis.sessionStorage = {getItem() {throw new Error('Blocked storage')}};
    assert.doesNotThrow(() => startInstallerDownload('order-other', 'paid-license', url));
    assert.equal(clicks.length, 1);
  } finally {
    if (originalDocument === undefined) delete globalThis.document; else globalThis.document = originalDocument;
    if (originalStorage === undefined) delete globalThis.sessionStorage; else globalThis.sessionStorage = originalStorage;
  }
});
