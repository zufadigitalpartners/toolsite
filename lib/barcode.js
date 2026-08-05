// Barcode encoders, no dependencies. Two symbologies cover what small
// sellers actually print: Code 128 for SKUs and anything alphanumeric,
// EAN-13 for retail product codes.
//
// Both return an array of module widths [bar, space, bar, ...] starting
// with a bar, plus the text to print under the code. Rendering is the
// caller's job; these functions only know the standards.

/* ---------------- Code 128 ---------------- */

// Width patterns for values 0-106, from the symbology spec. Six digits per
// entry, alternating bar/space widths, each summing to 11 modules; the stop
// pattern (106) has seven elements summing to 13.
const C128 = (
  "212222 222122 222221 121223 121322 131222 122213 122312 132212 221213 " +
  "221312 231212 112232 122132 122231 113222 123122 123221 223211 221132 " +
  "221231 213212 223112 312131 311222 321122 321221 312212 322112 322211 " +
  "212123 212321 232121 111323 131123 131321 112313 132113 132311 211313 " +
  "231113 231311 112133 112331 132131 113123 113321 133121 313121 211331 " +
  "231131 213113 213311 213131 311123 311321 331121 312113 312311 332111 " +
  "314111 221411 431111 111224 111422 121124 121421 141122 141221 112214 " +
  "112412 122114 122411 142112 142211 241211 221114 413111 241112 134111 " +
  "111242 121142 121241 114212 124112 124211 411212 421112 421211 212141 " +
  "214121 412121 111143 111341 131141 114113 114311 411113 411311 113141 " +
  "114131 311141 411131 211412 211214 211232 2331112"
).split(" ");

const START_B = 104;
const START_C = 105;
const STOP = 106;

export function code128(text) {
  if (!text) throw new Error("Type something to encode");
  for (const ch of text) {
    const c = ch.charCodeAt(0);
    if (c < 32 || c > 126) {
      throw new Error(`"${ch}" cannot go in a Code 128 barcode. Plain letters, digits and punctuation work.`);
    }
  }

  // All digits and an even count: Code C packs two digits per symbol and
  // the bars come out almost half as wide. Otherwise Code B throughout.
  const values = [];
  if (/^\d+$/.test(text) && text.length % 2 === 0 && text.length >= 4) {
    values.push(START_C);
    for (let i = 0; i < text.length; i += 2) values.push(Number(text.slice(i, i + 2)));
  } else {
    values.push(START_B);
    for (const ch of text) values.push(ch.charCodeAt(0) - 32);
  }

  let check = values[0];
  for (let i = 1; i < values.length; i++) check += values[i] * i;
  values.push(check % 103);
  values.push(STOP);

  const widths = [];
  for (const v of values) for (const d of C128[v]) widths.push(Number(d));
  return { widths, label: text };
}

/* ---------------- EAN-13 ---------------- */

const L = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
// R is the bitwise complement of L; G is R reversed. Derived rather than
// typed out, so the three tables cannot drift apart.
const R = L.map((p) => p.replace(/./g, (b) => (b === "0" ? "1" : "0")));
const G = R.map((p) => p.split("").reverse().join(""));

// Which of the left six digits use L or G encoding, chosen by the first digit.
const PARITY = ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"];

export function ean13CheckDigit(digits12) {
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(digits12[i]) * (i % 2 === 0 ? 1 : 3);
  return (10 - (sum % 10)) % 10;
}

export function ean13(input) {
  const digits = String(input).replace(/[\s-]/g, "");
  if (!/^\d{12,13}$/.test(digits)) {
    throw new Error("EAN-13 needs 12 or 13 digits. With 12, the check digit is added for you.");
  }
  const check = ean13CheckDigit(digits);
  if (digits.length === 13 && Number(digits[12]) !== check) {
    throw new Error(`That is not a valid EAN-13: the check digit should be ${check}, not ${digits[12]}. Paste the first 12 digits and it is computed for you.`);
  }
  const full = digits.slice(0, 12) + String(check);

  let bits = "101";
  const parity = PARITY[Number(full[0])];
  for (let i = 1; i <= 6; i++) {
    const d = Number(full[i]);
    bits += parity[i - 1] === "L" ? L[d] : G[d];
  }
  bits += "01010";
  for (let i = 7; i <= 12; i++) bits += R[Number(full[i])];
  bits += "101";

  // Collapse the bit string into alternating widths. EAN bit strings start
  // with 1 and end with 1, so the widths array starts and ends on a bar.
  const widths = [];
  let run = 1;
  for (let i = 1; i < bits.length; i++) {
    if (bits[i] === bits[i - 1]) run++;
    else { widths.push(run); run = 1; }
  }
  widths.push(run);
  return { widths, label: full, bits };
}

/* Self-check data, exported for tests: every Code 128 pattern must sum to
   11 modules (13 for stop), and EAN-13 must produce exactly 95 modules. */
export const _tables = { C128, L, R, G, PARITY };
