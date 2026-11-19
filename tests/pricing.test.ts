import { test } from "node:test";
import assert from "node:assert/strict";
import { priceOf } from "../lib/pricing.ts";

test("altın bedeli gram × milyem × has fiyat, işçilik ayrı satır; ikisi karışmaz", () => {
  const b = priceOf({ netMg: 3200, ayarMilyem: 585, iscilikMilyem: 90, hasKurus: 585_000, satisPayiBinde: 0 });
  assert.equal(b.altinKurus, Math.round((3200 * 585 * 585_000) / 1e6));
  assert.equal(b.iscilikKurus, Math.round((3200 * 90 * 585_000) / 1e6));
  // KDV yalnız altın dışındaki kısım üzerinden (örnek özel matrah)
  assert.equal(b.kdvKurus, Math.round((b.iscilikKurus * 200) / 1000));
  assert.ok(b.toplamKurus >= b.altinKurus + b.iscilikKurus + b.kdvKurus);
  assert.equal(b.toplamKurus % 1000, 0);
});

test("pırlanta bedeli KDV matrahına girer", () => {
  const a = priceOf({ netMg: 2800, ayarMilyem: 585, iscilikMilyem: 140, tasKurus: 0, satisPayiBinde: 0 });
  const b = priceOf({ netMg: 2800, ayarMilyem: 585, iscilikMilyem: 140, tasKurus: 1_000_000, satisPayiBinde: 0 });
  assert.equal(b.kdvKurus - a.kdvKurus, 200_000);
});
