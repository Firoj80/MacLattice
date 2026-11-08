import assert from 'node:assert/strict';
import { test } from 'node:test';
import { minilyticsAttribution, extractMinilyticsAttribution } from '../src/lib/minilytics-attribution.ts';

test('reads only valid, exact Minilytics cookies (ml_vid, ml_sid)', () => {
  const vid = '12345678-1234-1234-1234-123456789abc';
  const sid = 'session_xyz_789';
  const parsed = minilyticsAttribution(`smd_checkout=private; ml_vid=${vid}; ml_sid=${sid}; other=1`);
  assert.equal(parsed.ml_visitor_id, vid);
  assert.equal(parsed.ml_session_id, sid);

  const empty = minilyticsAttribution(null);
  assert.equal(empty.ml_visitor_id, '');
  assert.equal(empty.ml_session_id, '');

  const invalid = minilyticsAttribution('ml_vid=%ZZ; ml_sid=%0D%0Asecret');
  assert.equal(invalid.ml_visitor_id, '');
  assert.equal(invalid.ml_session_id, '');
});

test('extractMinilyticsAttribution merges cookies and fallback attribution', () => {
  const parsed = extractMinilyticsAttribution('ml_vid=vid_cookie', {
    ml_session_id: 'sid_fallback',
  });
  assert.equal(parsed.ml_visitor_id, 'vid_cookie');
  assert.equal(parsed.ml_session_id, 'sid_fallback');
});
