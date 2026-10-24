/* Scout broker directory — Germany (v1)
 * Coarse, slow-changing facts only, compiled from public comparison sites (Oct 2026).
 * Fees, promotions and stock lists CHANGE. Every entry points to the broker's own site to confirm.
 * This is information, not a recommendation. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Brokers = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const UPDATED = '2026-10';
  const LIST = [
    { id: 'tr', name: 'Trade Republic', kind: 'German bank (BaFin-supervised)', us: true, eu: true, fractional: 'Yes — amounts from about €1 via savings plans; check amount-based orders',
      feeNote: 'Small fixed fee per trade reported (about €1) — confirm', url: 'https://traderepublic.com', plus: 'Simple phone app, low minimums', watch: 'Selection of very small or new companies is limited' },
    { id: 'sc', name: 'Scalable Capital', kind: 'BaFin-regulated broker', us: true, eu: true, fractional: 'Yes — savings plans from about €1',
      feeNote: 'Fees vary by plan and venue (Gettex / Xetra) — confirm', url: 'https://de.scalable.capital', plus: 'Wide German-market offer, savings plans', watch: 'Trades via German venues, not directly on NASDAQ/NYSE, per comparison sites — confirm' },
    { id: 't212', name: 'Trading 212', kind: 'Investment firm (EU-licensed, not a bank)', us: true, eu: true, fractional: 'Yes — fractional shares, small minimum',
      feeNote: 'No per-trade commission reported on stocks, but about 0.15% currency-conversion fee — confirm', url: 'https://www.trading212.com', plus: 'Cheap for small orders, large stock list', watch: 'Lower deposit-protection limit than a German bank; check the rules for your account type' },
    { id: 'ibkr', name: 'Interactive Brokers', kind: 'Large international broker (EU clients via its Irish entity — confirm)', us: true, eu: true, fractional: 'Yes on eligible US/EU stocks; list can change',
      feeNote: 'Commissions depend on plan and exchange — check the rate card', url: 'https://www.interactivebrokers.ie', plus: 'Widest market access, including many small companies', watch: 'More complex; the app is harder for beginners' }
  ];
  const URL_CHECK = 'https://www.bafin.de';

  /* Rough availability from the listing venue. Never a guarantee: always confirm by searching the ticker in the broker's app. */
  function venueClass(snap) {
    const ex = String((snap && snap.exchange) || '').toUpperCase();
    if (!ex) return 'unknown';
    if (/OTC|PINK|GREY|BB/.test(ex)) return 'otc';
    if (/NASDAQ|NYSE|AMEX|ARCA|BATS|NEW YORK/.test(ex)) return 'us';
    if (/XETRA|FRANKFURT|XETR|GETTEX|EURONEXT|PARIS|AMSTERDAM|MILAN|LONDON|SWISS|SIX|STOCKHOLM|COPENHAGEN|OSLO|HELSINKI|MADRID|VIENNA|BRUSSELS|LISBON|DUBLIN/.test(ex)) return 'eu';
    return 'unknown';
  }
  function forStock(snap) {
    const v = venueClass(snap), mc = snap && snap.mcapUsd;
    const tiny = mc != null && mc < 300e6;
    let level, text;
    if (v === 'otc') { level = 'unlikely'; text = 'Traded over-the-counter. Most retail brokers in Germany do not offer these shares. Check carefully, and treat this as a red flag on its own.'; }
    else if (v === 'us') { level = tiny ? 'maybe' : 'likely'; text = tiny ? 'US-listed but small. Some brokers carry only part of the small-company list, so search the ticker before counting on it.' : 'US-listed on a main exchange. Usually offered by brokers with US stock access.'; }
    else if (v === 'eu') { level = 'likely'; text = 'Listed in Europe. Usually available at German brokers with European stock access.'; }
    else { level = 'maybe'; text = 'Listing venue unknown. Search the ticker in each broker app to confirm.'; }
    const brokers = LIST.map(b => {
      let fit = 'verify';
      if (level !== 'unlikely') { if (v === 'us' && b.us) fit = tiny && (b.id === 'tr' || b.id === 'sc') ? 'verify' : 'likely'; else if (v === 'eu' && b.eu) fit = 'likely'; }
      if (level === 'unlikely') fit = b.id === 'ibkr' ? 'verify' : 'unlikely';
      return Object.assign({}, b, { fit });
    });
    return { level, text, venue: v, brokers };
  }
  return { LIST, UPDATED, URL_CHECK, venueClass, forStock };
});
