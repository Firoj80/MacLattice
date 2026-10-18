import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { earlyBirdSales, readEarlyBirdSales } from '../src/lib/early-bird.ts';

test('live purchase count includes 100%-discount purchases, deduplicates payments and follows new sales/refunds', async () => {
  const db = new PGlite();
  try {
    const migration = readFileSync(new URL('../migrations/0003_dodo_licensing.sql', import.meta.url), 'utf8');
    await db.exec(migration.match(/create table if not exists verified_payments[^;]+;/)[0]);
    const sql = async (parts, ...values) => (await db.query(parts.reduce((text, part, i) => text + (i ? `$${i}` : '') + part, ''), values)).rows;
    const add = async (id, product = 'smd-live', mode = 'live_mode', status = 'paid') => db.query('insert into verified_payments values ($1,$2,$3,$4) on conflict(payment_id) do nothing', [id, product, status, mode]);
    await add('paid-1'); await add('paid-2'); await add('coupon-OFF100');
    await add('coupon-OFF100'); // Replayed webhook or activation recovery.
    await add('other-product', 'other'); await add('test-payment', 'smd-live', 'test_mode');
    await add('failed-payment', 'smd-live', 'live_mode', 'failed');
    await add('refunded-payment', 'smd-live', 'live_mode', 'refunded');
    assert.deepEqual(await readEarlyBirdSales(sql, 'smd-live', 20), { sold: 3, limit: 20, claimed: 3, remaining: 17, percent: 15 });
    await add('new-sale');
    assert.equal((await readEarlyBirdSales(sql, 'smd-live', 20)).sold, 4);
    await db.query("update verified_payments set status='refunded' where payment_id='paid-1'");
    assert.equal((await readEarlyBirdSales(sql, 'smd-live', 20)).sold, 3);
  } finally { await db.close(); }
});

test('progress stays within the 20-license allocation and rejects untrusted counts', () => {
  assert.equal(earlyBirdSales(0, 20).percent, 0);
  assert.equal(earlyBirdSales(20, 20).percent, 100);
  assert.deepEqual(earlyBirdSales(23, 20), { sold: 23, limit: 20, claimed: 20, remaining: 0, percent: 100 });
  for (const n of [-1, 1.5, null, '3', NaN, Infinity]) assert.throws(() => earlyBirdSales(n, 20));
});
