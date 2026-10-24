/* Scout — market discovery logic (pure functions, no network, no DOM).
   Information tool only: nothing here predicts prices or gives advice. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Scout = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const num = v => (typeof v === 'number' && isFinite(v)) ? v : null;

  /* ---------- themes (US-listed tickers, incl. big European ADRs). Missing / renamed tickers are skipped at scan time. ---------- */
  const THEMES = {
    ai:      { label: 'AI & CHIPS',      syms: ['NVDA', 'AMD', 'AVGO', 'SMCI', 'ARM', 'PLTR', 'AI', 'SOUN', 'TSM', 'ASML', 'MU', 'MRVL'] },
    quantum: { label: 'QUANTUM',         syms: ['IONQ', 'RGTI', 'QBTS', 'QUBT', 'IBM', 'GOOGL'] },
    space:   { label: 'SPACE & DRONES',  syms: ['RKLB', 'ASTS', 'LUNR', 'RDW', 'PL', 'ACHR', 'JOBY', 'KTOS', 'AVAV'] },
    nuclear: { label: 'NUCLEAR',         syms: ['OKLO', 'SMR', 'NNE', 'CCJ', 'UEC', 'LEU', 'BWXT', 'VST'] },
    bio:     { label: 'BIOTECH',         syms: ['LLY', 'NVO', 'VKTX', 'HIMS', 'RXRX', 'CRSP', 'MRNA', 'AZN'] },
    energy:  { label: 'CLEAN ENERGY',    syms: ['ENPH', 'FSLR', 'RUN', 'PLUG', 'BE', 'QS', 'EOSE', 'FLNC'] },
    robots:  { label: 'ROBOTICS',        syms: ['TSLA', 'SYM', 'TER', 'ISRG', 'PATH', 'ROK'] },
    crypto:  { label: 'FINTECH & CRYPTO', syms: ['COIN', 'HOOD', 'SOFI', 'AFRM', 'UPST', 'MSTR', 'MARA', 'RIOT', 'CLSK'] },
    defense: { label: 'DEFENCE & CYBER', syms: ['LMT', 'RTX', 'NOC', 'CRWD', 'PANW', 'S', 'ZS'] },
    europe:  { label: 'EUROPE (ADRs)',   syms: ['ASML', 'SAP', 'NVO', 'SPOT', 'ARM', 'AZN', 'SHEL', 'UL', 'ON', 'DUOL'] }
  };

  /* ---------- snapshot from Finnhub payloads ---------- */
  // quote: {c,d,dp,h,l,o,pc}; metric: {metric:{...}}; profile: {name,ipo,marketCapitalization,finnhubIndustry,country,exchange,currency}
  function buildSnapshot(symbol, quote, metricJson, profile) {
    const m = (metricJson && metricJson.metric) || {}, q = quote || {}, p = profile || {};
    const mcapM = num(m.marketCapitalization) != null ? m.marketCapitalization : num(p.marketCapitalization);
    return {
      symbol: String(symbol).toUpperCase(),
      name: p.name || symbol,
      price: num(q.c) && q.c > 0 ? q.c : null,
      changePct: num(q.dp),
      ret5d: num(m['5DayPriceReturnDaily']),
      ret13w: num(m['13WeekPriceReturnDaily']),
      ret26w: num(m['26WeekPriceReturnDaily']),
      retYtd: num(m['yearToDatePriceReturnDaily']),
      hi52: num(m['52WeekHigh']), lo52: num(m['52WeekLow']),
      avgVol10: num(m['10DayAverageTradingVolume']) != null ? m['10DayAverageTradingVolume'] * 1e6 : null,
      avgVol3m: num(m['3MonthAverageTradingVolume']) != null ? m['3MonthAverageTradingVolume'] * 1e6 : null,
      mcapUsd: mcapM != null ? mcapM * 1e6 : null,
      beta: num(m.beta),
      revGrowth: num(m['revenueGrowthTTMYoy']),
      ipo: p.ipo || null,
      industry: p.finnhubIndustry || null,
      country: p.country || null,
      exchange: p.exchange || null
    };
  }

  /* ---------- scoring: explainable, NOT a prediction ---------- */
  function monthsSince(dateStr, now) {
    if (!dateStr) return null;
    const t = Date.parse(dateStr); if (!isFinite(t)) return null;
    return ((now || Date.now()) - t) / (30.44 * 86400000);
  }
  function score(s, now) {
    const parts = [], flags = [], notes = [];
    // --- radar (0..100): how much "something is happening"
    const mom = s.ret13w != null ? s.ret13w : (s.ret26w != null ? s.ret26w / 2 : null);
    const pm = mom == null ? 0 : clamp(mom / 60, 0, 1) * 35;
    parts.push({ k: 'Momentum', pts: Math.round(pm), max: 35, txt: mom == null ? 'no data' : (mom >= 0 ? '+' : '') + mom.toFixed(0) + '% over ~3 months' });
    const near = (s.price && s.hi52) ? s.price / s.hi52 : null;
    const pp = near == null ? 0 : clamp((near - 0.7) / 0.3, 0, 1) * 20;
    parts.push({ k: 'Near its high', pts: Math.round(pp), max: 20, txt: near == null ? 'no data' : Math.round(near * 100) + '% of the 52-week high' });
    const surge = (s.avgVol10 && s.avgVol3m) ? s.avgVol10 / s.avgVol3m : null;
    const pv = surge == null ? 0 : clamp((surge - 0.9) / 1.1, 0, 1) * 20;
    parts.push({ k: 'Volume surge', pts: Math.round(pv), max: 20, txt: surge == null ? 'no data' : surge.toFixed(1) + '× its normal trading' });
    const pg = s.revGrowth == null ? 0 : clamp(s.revGrowth / 50, 0, 1) * 15;
    parts.push({ k: 'Sales growth', pts: Math.round(pg), max: 15, txt: s.revGrowth == null ? 'no data' : (s.revGrowth >= 0 ? '+' : '') + s.revGrowth.toFixed(0) + '% per year' });
    const age = monthsSince(s.ipo, now);
    const pf = age == null ? 0 : age < 24 ? clamp(1 - age / 24, 0, 1) * 10 : 0;
    parts.push({ k: 'Newly listed', pts: Math.round(pf), max: 10, txt: age == null ? 'listing date unknown' : age < 24 ? 'listed ' + Math.max(1, Math.round(age)) + ' months ago' : 'listed for years' });
    const radar = Math.round(clamp(pm + pp + pv + pg + pf, 0, 100));

    // --- risk (0..100): how easily this could go badly
    let risk = 0, gaps = 0;
    if (s.mcapUsd == null) { gaps++; } else if (s.mcapUsd < 3e8) { risk += 30; flags.push(['MICRO-CAP', 'Worth under $300M — a few sellers can move the price hard.']); }
    else if (s.mcapUsd < 2e9) { risk += 18; flags.push(['SMALL-CAP', 'Worth under $2B — prices swing more than big companies.']); }
    else if (s.mcapUsd < 1e10) risk += 8;
    if (s.avgVol3m == null) gaps++; else if (s.avgVol3m < 1.5e5) { risk += 20; flags.push(['THIN TRADING', 'Few shares trade daily — hard to sell quickly at a fair price.']); }
    else if (s.avgVol3m < 5e5) risk += 10;
    const rng = (s.hi52 && s.lo52 && s.lo52 > 0) ? s.hi52 / s.lo52 : null;
    if (rng == null) gaps++; else if (rng > 4) { risk += 15; flags.push(['EXTREME RANGE', 'The yearly high is over 4× the low — very volatile.']); }
    else if (rng > 2.5) risk += 8;
    if (mom != null && mom > 100) { risk += 20; flags.push(['OVERHEATED', 'More than doubled in about 3 months. Late buyers often get hurt when these reverse.']); }
    else if (mom != null && mom > 60) { risk += 12; flags.push(['RUN-UP', 'Up over 60% in about 3 months — much of the move may already be done.']); }
    if (age != null && age < 12) { risk += 10; flags.push(['RECENT IPO', 'Listed under a year ago — short track record and lock-up expiries can pressure the price.']); }
    if (s.beta != null && s.beta > 2) { risk += 8; flags.push(['HIGH BETA', 'Moves much more than the overall market, both ways.']); }
    if (s.revGrowth != null && s.revGrowth < 0) { risk += 8; flags.push(['SHRINKING SALES', 'Revenue is falling year on year.']); }
    if (gaps >= 2) { risk += 5; flags.push(['DATA GAPS', 'Some key numbers are missing, so this view is incomplete.']); }
    risk = Math.round(clamp(risk, 0, 100));

    const radarTier = radar >= 70 ? 'HOT' : radar >= 50 ? 'WARM' : radar >= 30 ? 'COOL' : 'COLD';
    const riskTier = risk >= 65 ? 'EXTREME' : risk >= 45 ? 'HIGH' : risk >= 25 ? 'MEDIUM' : 'LOWER';
    if (radar >= 60 && risk >= 45) notes.push('Strong activity but high risk: this is the profile where big gains AND big losses happen.');
    if (flags.some(f => f[0] === 'OVERHEATED')) notes.push('Already moved a lot. Chasing a spike is the classic way small investors lose money.');
    return { radar, risk, radarTier, riskTier, parts, flags, notes, mom, surge, near, age };
  }
  const rank = (snaps, now) => snaps.filter(s => s && s.price).map(s => Object.assign({ s }, score(s, now))).sort((a, b) => b.radar - a.radar || a.risk - b.risk);

  /* ---------- reality check ---------- */
  function realityCheck(startEur, targetEur, months) {
    const mult = targetEur / startEur, perMonth = Math.pow(mult, 1 / months) - 1;
    const yearly = Math.pow(1 + perMonth, 12);
    return { mult, perMonthPct: perMonth * 100, yearlyMult: yearly, afterYear: startEur * yearly, afterTwoYears: startEur * yearly * yearly };
  }

  /* ---------- paper trading (fake money, real prices, simulated friction) ---------- */
  const FRICTION = 0.005;   // 0.5% simulated spread / slippage each way
  function newAccount(cashEur, now) { return { startEur: cashEur, cashEur, pos: {}, hist: [], eq: [], created: now || Date.now() }; }
  function buy(acc, sym, eur, priceUsd, fx, now) {
    if (!(eur > 0) || !(priceUsd > 0) || !(fx > 0)) return { ok: false, err: 'Invalid order.' };
    if (eur > acc.cashEur + 1e-9) return { ok: false, err: 'Not enough paper cash.' };
    const net = eur * (1 - FRICTION), shares = net / (priceUsd * fx);
    const p = acc.pos[sym] || { shares: 0, costEur: 0 };
    p.shares += shares; p.costEur += eur; acc.pos[sym] = p; acc.cashEur -= eur;
    acc.hist.push({ t: now || Date.now(), side: 'BUY', sym, shares, priceUsd, fx, eur });
    return { ok: true, shares };
  }
  function sell(acc, sym, fraction, priceUsd, fx, now) {
    const p = acc.pos[sym]; if (!p || p.shares <= 0) return { ok: false, err: 'No position.' };
    const f = clamp(fraction == null ? 1 : fraction, 0, 1), sh = p.shares * f, gross = sh * priceUsd * fx, eur = gross * (1 - FRICTION);
    const cost = p.costEur * f;
    p.shares -= sh; p.costEur -= cost; acc.cashEur += eur;
    if (p.shares < 1e-9) delete acc.pos[sym];
    acc.hist.push({ t: now || Date.now(), side: 'SELL', sym, shares: sh, priceUsd, fx, eur, pnlEur: eur - cost });
    return { ok: true, eur, pnlEur: eur - cost };
  }
  function valueOf(acc, pricesUsd, fx) {
    let pos = 0; Object.keys(acc.pos).forEach(sym => { const px = pricesUsd[sym]; if (px) pos += acc.pos[sym].shares * px * fx * (1 - FRICTION); else pos += acc.pos[sym].costEur; });
    return { cashEur: acc.cashEur, posEur: pos, totalEur: acc.cashEur + pos };
  }
  function stats(acc) {
    const sells = acc.hist.filter(h => h.side === 'SELL'), wins = sells.filter(h => h.pnlEur > 0);
    const realised = sells.reduce((a, h) => a + h.pnlEur, 0);
    return { trades: sells.length, wins: wins.length, winRate: sells.length ? wins.length / sells.length : null, realisedEur: realised };
  }

  const fmt = {
    usd: v => v == null ? '—' : v >= 1000 ? '$' + v.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '$' + v.toFixed(v < 10 ? 3 : 2),
    big: v => v == null ? '—' : v >= 1e12 ? (v / 1e12).toFixed(2) + 'T' : v >= 1e9 ? (v / 1e9).toFixed(1) + 'B' : v >= 1e6 ? (v / 1e6).toFixed(0) + 'M' : v >= 1e3 ? (v / 1e3).toFixed(0) + 'K' : String(Math.round(v)),
    pct: v => v == null ? '—' : (v >= 0 ? '+' : '') + v.toFixed(1) + '%',
    eur: v => v == null ? '—' : (v < 0 ? '−' : '') + '€' + Math.abs(v).toFixed(2)
  };

  return { THEMES, buildSnapshot, score, rank, realityCheck, newAccount, buy, sell, valueOf, stats, fmt, FRICTION, clamp };
});
