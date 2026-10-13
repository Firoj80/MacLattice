import assert from 'node:assert/strict';
import { test } from 'node:test';
import { datafastVisitorId, datafastPageUrl } from '../src/lib/datafast-attribution.ts';

test('reads only a valid, exact DataFast cookie without requiring tracking', () => {
  const id = '12345678-1234-1234-1234-123456789abc';
  assert.equal(datafastVisitorId(`smd_checkout=private; datafast_visitor_id=${id}; other=1`), id);
  for (const cookie of [null, '', 'datafast_visitor_id=', 'datafast_visitor_id=%ZZ',
    'not_datafast_visitor_id=other', 'datafast_visitor_id=%0D%0Asecret',
    'datafast_visitor_id=a; datafast_visitor_id=b', `datafast_visitor_id=${'a'.repeat(129)}`]) {
    assert.equal(datafastVisitorId(cookie), undefined);
  }
});

test('campaign URL preserves only marketing parameters, never checkout secrets', () => {
  const safe = new URL(datafastPageUrl('https://www.scanmydisk.com/thanks?order_id=private&license_key=secret&email=private&utm_source=google&utm_medium=cpc&utm_campaign=launch#private'));
  assert.equal(safe.pathname, '/thanks');
  assert.equal(safe.search, '?utm_source=google&utm_medium=cpc&utm_campaign=launch');
  assert.equal(safe.hash, '');
});
