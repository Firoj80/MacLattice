import assert from 'node:assert/strict';
import { test } from 'node:test';
import { priceFromPreview, pricingCountry } from '../src/lib/local-pricing.ts';
const preview = (currency, amount) => ({ currency, product_cart: [{ product_id: 'smd', quantity: 1, og_currency: 'USD', og_price: 500, currency, discounted_price: amount }] });
test('Dodo quote preserves minor units for two, zero and three decimal currencies', () => {
  assert.equal(priceFromPreview(preview('INR', 45321), 'smd').early, '₹453.21');
  assert.equal(priceFromPreview(preview('JPY', 750), 'smd').early, '¥750');
  assert.match(priceFromPreview(preview('KWD', 1543), 'smd').early, /1\.543/);
  assert.equal(priceFromPreview(preview('USD', 500), 'smd').localized, false);
});
test('invalid or mismatched offers never become localized advertisements', () => {
  for (const p of [null, {}, preview('INR', -1), preview('INR', Infinity), preview('no', 200), { ...preview('INR', 100), product_cart: [] }]) assert.equal(priceFromPreview(p, 'smd'), undefined);
  assert.equal(priceFromPreview(preview('INR', 40000), 'other'), undefined);
  const wrongDollars = preview('USD', 400); wrongDollars.product_cart[0].og_price = 999;
  assert.equal(priceFromPreview(wrongDollars, 'smd'), undefined);
  const converted = preview('INR', 40000); converted.product_cart[0].og_currency = 'INR'; converted.product_cart[0].og_price = 40000;
  assert.equal(priceFromPreview(converted, 'smd').early, '₹400.00');
  assert.equal(pricingCountry('in'), 'IN');
  for (const c of ['XX', '../IN', 'IN\r\n', null, '']) assert.equal(pricingCountry(c), undefined);
});
