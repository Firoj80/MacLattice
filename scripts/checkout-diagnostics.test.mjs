import test from 'node:test';
import assert from 'node:assert/strict';
import { logCheckoutFailure } from '../src/lib/checkout-diagnostics.ts';

test('checkout diagnostics never log provider bodies, credentials or buyer data', () => {
  const original = console.error;
  const lines = [];
  console.error = (...args) => lines.push(args);
  try {
    logCheckoutFailure(new Error('secret-key buyer@example.test'));
    logCheckoutFailure(Object.assign(new Error('private SQL values'), {code: '42P01'}));
    logCheckoutFailure(new Error('Payment provider request failed (401).'));
    const output = JSON.stringify(lines);
    assert.ok(!output.includes('secret-key'));
    assert.ok(!output.includes('buyer@example.test'));
    assert.ok(!output.includes('private SQL values'));
    assert.equal(lines[1][1].databaseCode, '42P01');
    assert.equal(lines[2][1].providerStatus, '401');
  } finally { console.error = original; }
});
