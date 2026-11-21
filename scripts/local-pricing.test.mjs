import assert from 'node:assert/strict';
import { test } from 'node:test';
import { priceFromPreview, pricingCountry, USD_PRICE } from '../src/lib/local-pricing.ts';

test('store maintains standard USD pricing ($6.99)', () => {
  assert.equal(USD_PRICE.currency, 'USD');
  assert.equal(USD_PRICE.early, '$6.99');
  assert.equal(USD_PRICE.regular, '$9.99');
  assert.equal(USD_PRICE.localized, false);
  assert.equal(priceFromPreview({}, 'smd').early, '$6.99');
  assert.equal(priceFromPreview({}, 'smd').localized, false);
});

test('country normalization defaults safely to US without localization', () => {
  assert.equal(pricingCountry('US'), 'US');
  assert.equal(pricingCountry(null), undefined);
  assert.equal(pricingCountry(undefined), undefined);
});
