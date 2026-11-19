import { test } from "node:test";
import assert from "node:assert/strict";
import { baslat, teklifVer, kabulEt, vazgec } from "../lib/patron.ts";

const L = 1_245_000; // 12.450 TL

test("liste fiyatına yakın teklif kabul edilir ve liste fiyatını aşmaz", () => {
  const s = teklifVer(baslat(L), 1_300_000, 1);
  assert.equal(s.durum, "ANLASMA");
  assert.equal(s.anlasilan, L);
});

test("orta teklife karşı teklif, ikinci teklife son fiyat gelir; son fiyatta yeni teklif verilemez", () => {
  let s = teklifVer(baslat(L), 1_150_000, 1);
  assert.equal(s.durum, "KARSI_TEKLIF");
  assert.ok(s.patronTeklif! > 1_150_000 && s.patronTeklif! < L);
  s = teklifVer(s, 1_160_000, 2);
  assert.equal(s.durum, "SON_FIYAT");
  assert.ok(s.patronTeklif! >= Math.round(L * 0.92));
  assert.throws(() => teklifVer(s, 1_170_000, 3));
  const k = kabulEt(s, 4);
  assert.equal(k.durum, "ANLASMA");
  assert.equal(k.anlasilan, s.patronTeklif);
});

test("çok düşük teklif reddedilir, müşteri yeniden teklif verebilir", () => {
  const s = teklifVer(baslat(L), 500_000, 1);
  assert.equal(s.durum, "BEKLIYOR");
  assert.equal(s.olaylar.at(-1)!.tur, "ret");
  assert.equal(teklifVer(s, 1_150_000, 2).durum, "KARSI_TEKLIF");
});

test("karşı teklifi tutan ya da aşan teklif kabul edilir", () => {
  const s = teklifVer(baslat(L), 1_150_000, 1);
  const k = teklifVer(s, s.patronTeklif!, 2);
  assert.equal(k.durum, "ANLASMA");
});

test("son fiyat taban fiyatın altına inmez", () => {
  let s = teklifVer(baslat(L), 1_000_000, 1);
  s = teklifVer(s, 1_000_000, 2);
  assert.equal(s.durum, "SON_FIYAT");
  assert.ok(s.patronTeklif! >= Math.round(L * 0.92));
});

test("vazgeçince pazarlık kapanır", () => {
  assert.equal(vazgec(baslat(L), 1).durum, "KAPANDI");
});
