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
    ['XOM','Exxon Mobil','Oil'],['BA','Boeing','Aircraft'],['F','Ford','Cars'],['GM','General Motors','Cars'],['RIVN','Rivian','Electric trucks'],['LCID','Lucid','Electric cars'],['NIO','NIO','Chinese electric cars'],
    ['BBAI','BigBear.ai','AI for defence'],['SERV','Serve Robotics','Sidewalk delivery robots'],['RR','Richtech Robotics','Service robots'],['NVTS','Navitas Semiconductor','Power chips'],['AEHR','Aehr Test Systems','Chip testing'],
    ['LAES','SEALSQ','Secure chips, quantum-safe'],['WULF','TeraWulf','Bitcoin mining, AI hosting'],['CIFR','Cipher Mining','Bitcoin mining, AI hosting'],['IREN','IREN','AI data centres'],['APLD','Applied Digital','AI data centres'],
    ['OUST','Ouster','Lidar sensors'],['INDI','indie Semiconductor','Car chips'],['MVIS','MicroVision','Lidar sensors'],['RZLV','Rezolve AI','Shopping AI'],['SPCE','Virgin Galactic','Space tourism'],
    ['BKSY','BlackSky','Satellite images'],['SATL','Satellogic','Earth-watching satellites'],['ONDS','Ondas Holdings','Drones, networks'],['RCAT','Red Cat Holdings','Military drones'],['UMAC','Unusual Machines','Drone parts'],
    ['DPRO','Draganfly','Drones'],['BEAM','Beam Therapeutics','Gene editing'],['SANA','Sana Biotechnology','Cell therapy'],['TARS','Tarsus Pharmaceuticals','Eye medicine'],['TMDX','TransMedics','Organ transport'],
    ['NXE','NexGen Energy','Uranium mining'],['DNN','Denison Mines','Uranium mining'],['UUUU','Energy Fuels','Uranium, rare earths'],['ASPI','ASP Isotopes','Isotopes for nuclear + medicine'],['LTBR','Lightbridge','Nuclear fuel design'],
    ['MP','MP Materials','Rare earth magnets'],['ENVX','Enovix','Batteries'],['AMPX','Amprius Technologies','Batteries'],['SLDP','Solid Power','Solid-state batteries'],['SES','SES AI','Batteries'],
    ['SG','Sweetgreen','Salad restaurants'],['ONON','On Holding','Running shoes (Switzerland)'],['YETI','Yeti','Coolers, outdoor gear'],['ELF','e.l.f. Beauty','Makeup'],['CAVA','Cava Group','Mediterranean restaurants'],
    ['BROS','Dutch Bros','Coffee drive-thrus'],['DAVE','Dave Inc','Small cash advances app'],['LMND','Lemonade','Insurance app'],['ROOT','Root Inc','Car insurance'],['OPEN','Opendoor','Home buying'],
    ['TOST','Toast','Restaurant software'],['SMAR','Smartsheet','Work software'],['ASAN','Asana','Work software'],['U','Unity Software','Game engine'],['PINS','Pinterest','Image search'],
    ['CORZ','Core Scientific','AI + bitcoin data centres'],['AAOI','Applied Optoelectronics','Data-centre lasers'],['LASR','nLight','Industrial lasers'],['CLS','Celestica','AI hardware maker'],['ZETA','Zeta Global','Marketing software'],['SMTC','Semtech','Chips'],
    ['ARRY','Array Technologies','Solar trackers'],['SHLS','Shoals Technologies','Solar parts'],['OPAL','OPAL Fuels','Biogas fuel'],['STEM','Stem Inc','Energy storage software'],['FREY','FREYR Battery','Batteries'],['SMMT','Summit Therapeutics','Cancer drug'],
    ['CELC','Celcuity','Cancer drug'],['ACLX','Arcellx','Cell therapy'],['TVTX','Travere Therapeutics','Rare disease drugs'],['IMNM','Immunome','Cancer medicine'],['LOVE','Lovesac','Furniture'],['VITL','Vital Farms','Pasture-raised eggs'],
    ['KRUS','Kura Sushi USA','Sushi restaurants'],['SHAK','Shake Shack','Burger restaurants'],['PAYO','Payoneer','Cross-border payments'],['FOUR','Shift4 Payments','Payments'],['MQ','Marqeta','Card payments tech'],['FLYW','Flywire','Payments'],
    ['LC','LendingClub','Online lender'],['CRCL','Circle Internet','Stablecoin issuer'],['SIDU','Sidus Space','Space hardware'],['MNTS','Momentus','Space transport'],['QMCO','Quantum Corp','Data storage']
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
