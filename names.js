/* Scout name directory: find a company by name or ticker. Offline, no API needed. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Names = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const D = [
    ['AAPL','Apple','iPhone, Mac'],['MSFT','Microsoft','Windows, cloud, AI'],['GOOGL','Alphabet (Google)','Search, YouTube'],['AMZN','Amazon','Shopping, cloud'],['META','Meta (Facebook)','Social media'],
    ['NVDA','Nvidia','AI chips'],['TSLA','Tesla','Electric cars'],['NFLX','Netflix','Streaming'],['AMD','AMD','Chips'],['AVGO','Broadcom','Chips'],['INTC','Intel','Chips'],['MU','Micron','Memory chips'],
    ['ARM','Arm Holdings','Chip designs'],['TSM','TSMC','Chip maker'],['ASML','ASML','Chip machines (Netherlands)'],['SMCI','Super Micro Computer','AI servers'],['PLTR','Palantir','Data / AI software'],
    ['AI','C3.ai','AI software'],['SOUN','SoundHound AI','Voice AI'],['MRVL','Marvell','Chips'],['IONQ','IonQ','Quantum computers'],['RGTI','Rigetti Computing','Quantum computers'],
    ['QBTS','D-Wave Quantum','Quantum computers'],['QUBT','Quantum Computing Inc','Quantum'],['IBM','IBM','Computers, quantum'],['RKLB','Rocket Lab','Small rockets'],['ASTS','AST SpaceMobile','Satellite phones'],
    ['LUNR','Intuitive Machines','Moon landers'],['RDW','Redwire','Space tech'],['PL','Planet Labs','Satellite images'],['ACHR','Archer Aviation','Air taxis'],['JOBY','Joby Aviation','Air taxis'],
    ['KTOS','Kratos Defense','Drones, defence'],['AVAV','AeroVironment','Drones'],['OKLO','Oklo','Small nuclear reactors'],['SMR','NuScale Power','Small nuclear reactors'],['NNE','Nano Nuclear Energy','Micro reactors'],
    ['CCJ','Cameco','Uranium'],['UEC','Uranium Energy','Uranium'],['LEU','Centrus Energy','Nuclear fuel'],['BWXT','BWX Technologies','Nuclear parts'],['VST','Vistra','Power producer'],
    ['LLY','Eli Lilly','Weight-loss drugs'],['NVO','Novo Nordisk','Weight-loss drugs (Denmark)'],['VKTX','Viking Therapeutics','Biotech'],['HIMS','Hims & Hers','Online health'],['RXRX','Recursion','AI drug discovery'],
    ['CRSP','CRISPR Therapeutics','Gene editing'],['MRNA','Moderna','mRNA medicine'],['AZN','AstraZeneca','Pharma (UK)'],['ENPH','Enphase Energy','Solar'],['FSLR','First Solar','Solar panels'],
    ['RUN','Sunrun','Home solar'],['PLUG','Plug Power','Hydrogen'],['BE','Bloom Energy','Fuel cells'],['QS','QuantumScape','EV batteries'],['EOSE','Eos Energy','Batteries'],['FLNC','Fluence Energy','Energy storage'],
    ['SYM','Symbotic','Warehouse robots'],['TER','Teradyne','Test + robots'],['ISRG','Intuitive Surgical','Surgery robots'],['PATH','UiPath','Software robots'],['ROK','Rockwell Automation','Factory automation'],
    ['COIN','Coinbase','Crypto exchange'],['HOOD','Robinhood','Trading app'],['SOFI','SoFi','Online bank'],['AFRM','Affirm','Buy now pay later'],['UPST','Upstart','AI lending'],
    ['MSTR','Strategy (MicroStrategy)','Bitcoin holder'],['MARA','Marathon Digital','Bitcoin mining'],['RIOT','Riot Platforms','Bitcoin mining'],['CLSK','CleanSpark','Bitcoin mining'],
    ['LMT','Lockheed Martin','Defence'],['RTX','RTX (Raytheon)','Defence'],['NOC','Northrop Grumman','Defence'],['CRWD','CrowdStrike','Cyber security'],['PANW','Palo Alto Networks','Cyber security'],
    ['S','SentinelOne','Cyber security'],['ZS','Zscaler','Cyber security'],['SAP','SAP','Business software (Germany)'],['SPOT','Spotify','Music streaming (Sweden)'],['SHEL','Shell','Oil (UK)'],
    ['UL','Unilever','Consumer goods (UK)'],['ON','ON Semiconductor','Chips'],['DUOL','Duolingo','Language app'],['DIS','Disney','Media, parks'],['NKE','Nike','Sportswear'],['KO','Coca-Cola','Drinks'],
    ['JPM','JPMorgan Chase','Bank'],['V','Visa','Payments'],['MA','Mastercard','Payments'],['PYPL','PayPal','Payments'],['SHOP','Shopify','Online shops'],['UBER','Uber','Rides'],['ABNB','Airbnb','Stays'],
    ['RBLX','Roblox','Games'],['SNOW','Snowflake','Data cloud'],['NET','Cloudflare','Internet security'],['DDOG','Datadog','Software monitoring'],['RDDT','Reddit','Social media'],['CELH','Celsius Holdings','Energy drinks'],
    ['XOM','Exxon Mobil','Oil'],['BA','Boeing','Aircraft'],['F','Ford','Cars'],['GM','General Motors','Cars'],['RIVN','Rivian','Electric trucks'],['LCID','Lucid','Electric cars'],['NIO','NIO','Chinese electric cars']
  ].map(r => ({ symbol: r[0], name: r[1], about: r[2] }));
  const norm = s => String(s).toLowerCase().replace(/[^a-z0-9 ]/g, '');
  function search(q, limit) {
    q = norm(q || '').trim(); if (!q) return [];
    const out = [];
    D.forEach(d => {
      const n = norm(d.name), a = norm(d.about), s = d.symbol.toLowerCase(); let sc = 0;
      if (s === q) sc = 100; else if (s.startsWith(q)) sc = 80; else if (n.startsWith(q)) sc = 75; else if (n.split(' ').some(w => w.startsWith(q))) sc = 60; else if (n.includes(q)) sc = 40; else if (a.includes(q)) sc = 25;
      if (sc) out.push({ d, sc });
    });
    return out.sort((x, y) => y.sc - x.sc).slice(0, limit || 8).map(x => x.d);
  }
  return { LIST: D, search };
});
