export const INSIGHTS_COLORS = {
  navy: "#0f1a4e", steel: "#3a5f8a", light: "#7a8fa6", gold: "#c8a86e",
  page: "#f7f9fb", white: "#fff", line: "rgba(15,26,78,0.09)",
  red: "#c0392b", goldBg: "rgba(200,168,110,0.06)"
};

export const GEO_ITEMS = [
  { n:"01", title:"US\u2013Iran Standoff: Gulf on War Footing", body:"Russia struck Ukraine with 948 drones. The Strait of Hormuz (20% of global oil supply) remained largely closed to commercial shipping.", india:"Prolonged disruption structurally pressures India\u2019s CAD, OMC margins, and RBI\u2019s inflation tolerance." },
  { n:"02", title:"Brent >$110/bbl: Singapore GRMs Collapse", body:"Crude surged on supply fears. Singapore GRMs fell from ~$44/bbl to negative \u2014 direct margin shock for BPCL and HPCL.", india:"ONGC (+4.03%) and Coal India (+0.32%) were the only Nifty gainers on Mar 30. Aviation faces structural cost pressure." },
  { n:"03", title:"Gold Falls 20% from Peak", body:"Gold fell nearly 20% from its recent high on forced liquidation as investors sold gold to meet equity margin calls.", india:"MCX gold\u2019s correction reduces near-term hedging value for equity-market participants who had rotated into gold." },
  { n:"04", title:"ECB: Lagarde Says Damage May Last \u2018Years\u2019", body:"ECB President Lagarde said the bank was prepared to change policy at any meeting and that the Iran war disruption \u2018could last years.\u2019", india:"ECB hawkishness widens global yield differentials, tightens EM dollar liquidity, accelerates FII outflows." },
  { n:"05", title:"TotalEnergies Exits US Wind; Pivots to Fossil Fuels", body:"TotalEnergies agreed to renounce offshore-wind US licences and invest $928m in a Texas LNG plant.", india:"Reduces global capital competition for Indian renewable projects \u2014 marginally positive for India\u2019s clean-energy capex cycle." },
  { n:"06", title:"ARM Unveils AGI CPU", body:"ARM (SoftBank-controlled) launched its first AI data-centre chip. Lead customers: Meta and OpenAI.", india:"Reinforces AI-driven EM rotation to Korea (+22% YTD) and Taiwan (+10% YTD). India\u2019s MSCI EM weight: sub-14% vs 21% in 2024." },
  { n:"07", title:"OpenAI Cancels $1bn Disney Deal", body:"OpenAI cancelled Sora\u2019s $1bn Disney deal for AI video generation using Disney characters.", india:"Tightening AI content regulation is a medium-term positive for India\u2019s sovereign AI model initiative." },
  { n:"08", title:"Australia\u2013EU FTA Signed; Mercosur from May 1", body:"After 8 years, Australia and EU signed a free-trade pact. EU-Mercosur pact takes provisional effect May 1.", india:"Increases competitive pressure on Indian exporters; accelerates urgency of India-EU and India-UK FTA negotiations." },
  { n:"09", title:"India\u2013Israel: Defence JV + 50,000 Worker Visas", body:"PM Modi confirmed joint defence development, technology transfer. Israel agreed to 50,000 additional Indian worker visas.", india:"Positive for domestic defence manufacturers. FTA conclusion expands high-value export market access." },
  { n:"10", title:"IMF Approves \u20b974,700 Cr Ukraine Loan", body:"The IMF approved a 4-year loan for Ukraine. Ukraine faces a \u20b94.8 lakh Cr financing gap in 2026.", india:"Prolonged conflict sustains wheat and sunflower oil supply chain stress \u2014 direct input to India\u2019s food CPI basket." },
  { n:"11", title:"Danish Election: Greenland Features in Campaign", body:"Denmark\u2019s indecisive election triggered coalition talks. Greenland featured as a campaign issue amid US interest.", india:"Arctic resource politics and NATO cohesion affect long-term global energy supply diversification timelines." },
  { n:"12", title:"US Midterm: Democrats Win Trump\u2019s Florida District", body:"Democrats won a special election in a Republican +19pt district \u2014 the one containing Trump\u2019s Mar-a-Lago estate.", india:"A US Congressional shift by end-2026 could affect Iran sanctions, trade policy, and energy transition pace." },
];

export const POSTS = [
  {
    id:"mmp-mar26", type:"Newsletter", label:"Makia Market Pulse", date:"30 Mar 2026", isoDate:"2026-03-30", readTime:"8 min",
    title:"Market Pulse \u2014 March 2026: India\u2019s Worst Month in FY26",
    excerpt:"Nifty fell 11.3% (25,178 \u2192 22,331) \u2014 its sharpest monthly decline since Feb \u201922. Brent crossed $110/bbl, the rupee hit near-record lows, and FII outflows reached a FY26 high of \u20b91,11,377 Cr.",
    tags:["Capital Markets","FII/DII","Macro","IPO"],
    keyStats:[
      {label:"Nifty 50 MTD",value:"\u201311.3%",sub:"25,178 \u2192 22,331"},
      {label:"FII Net Selling",value:"\u20b91,11,377 Cr",sub:"FY26 high"},
      {label:"DII Net Buying",value:"\u20b91,28,066 Cr",sub:"Structural floor"},
      {label:"Brent Crude",value:">$110/bbl",sub:"US\u2013Iran escalation"},
      {label:"USD/INR",value:"96.72",sub:"Mar 30 futures"},
      {label:"PSU Bank MTD",value:"\u201320.0%",sub:"Worst sector FY26"},
    ],
    body:[
      { kind:"text", heading:"Executive Summary", text:"March 2026 was the worst month for Indian equities in FY26. The Nifty 50 fell 11.3% \u2014 its sharpest monthly decline since Feb \u201922. Brent crude surged past $110/bbl on US\u2013Iran escalation, the rupee hit near-record lows (USD/INR futures: 96.72 on Mar 30), and FII net outflows reached a FY26 high. DII inflows of \u20b91,28,066 Cr provided a structural floor but could not prevent an 11% index decline. No sector offered shelter \u2014 PSU Banks reversed Feb\u2019s entire 15.3% rally in a single month." },
      { kind:"table", heading:"Market Indices \u2014 1 Mar to 30 Mar 2026",
        headers:["Index","28 Feb Base","30 Mar Close","MTD Change","1M Return"],
        rows:[["Nifty 50","25,178.6","22,331.4","\u20132,847.2 pts","\u201311.3%"],["Nifty Midcap 100","59,146.8","53,025.5","\u20136,121.3 pts","\u201310.3%"],["Nifty Smallcap 100","16,911.3","15,203.8","\u20131,707.5 pts","\u201310.1%"]] },
      { kind:"text", heading:"Sectoral Performance", text:"PSU Bank (\u201320.0%): Reversed Feb\u2019s entire rally in one month. SBI (51% index weight) fell 3.9% on Mar 27 alone \u2014 FII concentrated selling, NRI deposit outflow risk, and rising bond yields combined to erase 12 months of gains.\n\nPharma (\u20130.8%): The relative outperformer \u2014 held up by USD earnings translation benefit, US generics demand stability, and defensive rotation. ONGC (+4.03%) and Coal India (+0.32%) were the only Nifty 50 stocks with meaningful positive closes." },
      { kind:"table", heading:"IPO Activity \u2014 Mainboard Listings (March 2026)",
        headers:["Company","Sector","Issue Price","Issue Size","Subscription","Listing Price","P / L"],
        rows:[["GSP Crop Science","Agrochemicals","\u20b9320","\u20b9400 Cr","1.64\u00d7 (QIB 2.66\u00d7, Retail 0.42\u00d7)","Data n/a","\u2014"],["CMPDI (Coal India sub.)","Mining Consulting","\u20b9172","\u20b91,842 Cr","1.05\u00d7","\u20b9160 NSE / \u20b9162.8 BSE","\u20137.0% / \u20135.3%"]],
        note:"CMPDI: 100% OFS \u2014 zero fresh capital raised. GSP Crop Science: retail subscription at 0.42\u00d7 signals no retail conviction despite 2.66\u00d7 QIB demand." },
      { kind:"table", heading:"IPO Activity \u2014 SME Listings (March 2026)",
        headers:["Company","Sector","Issue Price","Issue Size","Subscription","Listing Day P/L"],
        rows:[["Novus Loyalty Ltd","Loyalty Tech","\u20b9146","\u20b960.2 Cr","\u2014","+1.0%"],["Apsis Aerocom Ltd","Aerospace / MRO","~\u20b940","\u20b935.8 Cr","129.1\u00d7","\u2014"],["Raajmarg Infra InvIT","Infrastructure","\u2014","\u2014","\u2014","\u2014"]],
        note:"Apsis Aerocom\u2019s 129.1\u00d7 subscription in a \u201311% market demonstrates sector-specific narratives override macro headwinds." },
      { kind:"table", heading:"FY26 IPO Context",
        headers:["Metric","FY26 YTD (Apr\u2013Feb)","FY25 Full Year","Change"],
        rows:[["Mainboard listings","99","79","+25.3%"],["Mainboard fundraise","\u20b91,65,000 Cr","\u20b91,62,000 Cr","+1.9%"],["SME listings (NSE)","105","163","\u201335.6%"],["Avg SME issue size","~\u20b950 Cr","\u20b944 Cr","+13.6%"]] },
      { kind:"geo", heading:"Global & Geopolitical Developments \u2014 March 2026" },
      { kind:"pitch" },
      { kind:"disclaimer" },
    ],
  },
  {
    id:"mrs-smallcaps", type:"Research", label:"Makia Research Series", date:"15 Mar 2026", isoDate:"2026-03-15", readTime:"10 min",
    title:"Fundamentals Build Value, Liquidity Unlocks It",
    excerpt:"Why does a company growing at 30% a year, with no debt and clean governance, trade at 10\u00d7 while large caps command 30\u201340\u00d7? The answer is structural \u2014 and understanding it is the edge most investors never develop.",
    tags:["SME","Small Cap","Liquidity","Valuation","AIF"],
    keyStats:[
      {label:"Liquidity Threshold",value:"\u20b93,000 Cr",sub:"Below = no institutional capital"},
      {label:"SME PE Range",value:"10\u201315\u00d7",sub:"vs. 30\u201340\u00d7 for large caps"},
      {label:"PEG Trap",value:"0.5\u00d7",sub:"Persists without catalyst"},
      {label:"Ksolves Re-rating",value:"~3\u00d7 in 12mo",sub:"Post mainboard migration"},
    ],
    body:[
      { kind:"text", heading:"The Central Question", text:"Why does an SME company \u2014 growing at 30% a year, carrying no debt, run by a clean promoter, and available at 10\u00d7 earnings \u2014 find nobody buying it? The answer is not fundamental. It is structural. Understanding this structure is the single most important edge an SME investor can possess." },
      { kind:"text", heading:"Why Small Caps Are Structurally Ignored", text:"For an \u20b910,000\u201315,000 Cr company, fair value is live and continuously enforced by sell-side analysts, mutual funds, PMSes, AIFs, and FIIs. For an \u20b91,500 Cr company, three things are absent:\n\nNo analyst covers it \u2014 no brokerage income justifies the effort. No large mutual fund can build a meaningful position without moving price against itself. No index forces passive buying \u2014 no mandate requires ownership.", callout:"Fair value is a large-cap concept. For small caps, value exists \u2014 but it waits for liquidity to discover it." },
      { kind:"text", heading:"The Re-Rating Reality", text:"A stock at 10\u00d7 for three years can move to 25\u00d7 in months. Not because earnings surprised \u2014 but because sentiment created liquidity that created price discovery. The sequence matters: Liquidity \u2192 Price Discovery \u2192 Re-rating.\n\nA stock can grow earnings at 20% for years and still remain stuck at 12\u201315\u00d7. Not because growth disappointed, but because capital never needed to participate. The PEG ratio assumes demand is automatic. It is not." },
      { kind:"case", heading:"Case Study: Ksolves India Ltd", text:"Listed on NSE SME in 2020 at ~\u20b975 with ~\u20b9150\u2013200 Cr market cap, Ksolves delivered strong growth but saw limited valuation expansion due to low liquidity (\u20b920\u201330 lakh daily volumes) and negligible institutional participation.\n\nPost migration to the NSE Mainboard in 2023, liquidity rose materially (\u20b92\u20135 Cr daily volumes). The stock was trading at \u20b9200\u2013220 upon migration. Within 12 months it rallied to ~\u20b9660 \u2014 a near 3\u00d7 re-rating driven by improved liquidity, not a fundamental change in the business." },
      { kind:"bullets", heading:"Makia\u2019s Framework for SME Investing", bullets:["Clear Path to Mainboard Migration \u2014 Prioritise companies with size, governance, and operational maturity to transition over time, unlocking institutional participation and valuation re-rating potential.","Long-Term Compounding Mindset \u2014 Partner with businesses thinking beyond quarterly performance, with clear long-term vision, scalable models, and consistent financial fundamentals.","Institutional-Grade Governance \u2014 Invest only where promoter integrity, transparency, capital allocation discipline, and compliance standards meet institutional benchmarks.","Structural Industry Tailwinds \u2014 Focus on sunrise sectors with high structural growth, supported by government policy and long-term demand drivers that create multi-year compounding opportunities."] },
      { kind:"text", heading:"The Investment Implication", text:"The opportunity in SME and small cap investing is precisely this structural ignorance. Patient capital that enters before the re-rating cycle captures both fundamental growth and valuation expansion.\n\nAt Makia, this is not a thesis. It is the operating framework behind every investment decision in our AIF.", callout:"Fundamentals determine how far a stock can go. Liquidity determines when it gets there." },
      { kind:"pitch" },
    ],
  }
];

export const TYPE_COLORS = { Newsletter: "#3a5f8a", Research: "#c8a86e", Blog: "#0f1a4e" };
