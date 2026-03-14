// Intelligence monitoring keywords (English + Tamil)
// Updated with full classification keyword list per spec
module.exports = {

  // ============================================================
  // PRIMARY \u2014 Core English crime/intelligence keywords
  // ============================================================
  primary: [
    'crime', 'pocso', 'weapon', 'aruval', 'caste', 'religious',
    'protest', 'firearms', 'rowdy', 'gang', 'murder', 'theft', 'robbery',
    'drugs', 'violence', 'riot', 'arrest', 'police', 'accused'
  ],

  // ============================================================
  // TAMIL \u2014 Full GPT-4 classification keyword list per spec
  // ============================================================
  tamil: [
    // Spec-required Tamil keywords
    '\u0B95\u0BCA\u0BB2\u0BC8',         // murder
    '\u0B95\u0BCA\u0BB3\u0BCD\u0BB3\u0BC8',       // robbery
    '\u0B95\u0BB1\u0BCD\u0BAA\u0BB4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1',   // rape
    '\u0B86\u0BAF\u0BC1\u0BA4\u0BAE\u0BCD',       // weapon
    '\u0B9C\u0BBE\u0BA4\u0BBF \u0B95\u0BB2\u0BB5\u0BB0\u0BAE\u0BCD',  // caste violence
    '\u0BAE\u0BA4 \u0B95\u0BB2\u0BB5\u0BB0\u0BAE\u0BCD',    // religious riot
    '\u0BAA\u0BCB\u0BB0\u0BBE\u0B9F\u0BCD\u0B9F\u0BAE\u0BCD',    // protest
    '\u0B95\u0BC1\u0BAE\u0BCD\u0BAA\u0BAF',       // gang
    '\u0BA4\u0BC1\u0BAA\u0BCD\u0BAA\u0BBE\u0B95\u0BCD\u0B95\u0BBF',   // firearms
    '\u0B85\u0BB0\u0BBF\u0BB5\u0BBE\u0BB3\u0BCD',      // aruval (sickle)
    '\u0BAA\u0BCB\u0BA4\u0BC8\u0BAA\u0BCA\u0BB0\u0BC1\u0BB3\u0BCD',   // drugs
    // Additional Tamil keywords (existing)
    '\u0B95\u0BC1\u0BB1\u0BCD\u0BB1\u0BAE\u0BCD', '\u0BAA\u0BCB\u0B95\u0BCD\u0B9A\u0BCB', '\u0B86\u0BAF\u0BC1\u0BA4\u0BBF\u0BB2\u0BCD', '\u0B9A\u0BBE\u0BA4\u0BBF', '\u0BAE\u0BA4\u0BAE\u0BCD', '\u0BB0\u0BB5\u0BC1\u0BA0\u0BBF', '\u0BA4\u0BBF\u0BB0\u0BC1\u0BA0\u0BCD\u0BA0\u0BC1', '\u0BB5\u0BC6\u0BA7\u0BBF\u0B95\u0BC1\u0BA3\u0BCD\u0BA7\u0BC1', '\u0BAE\u0BBF\u0BB0\u0BB7\u0BCD\u0BB7\u0BB2\u0BCD', '\u0B95\u0BA0\u0BA4\u0BCD\u0BA4\u0BB2\u0BCD',
    '\u0BB5\u0BA9\u0BCD\u0BAE\u0BC1\u0BA1\u0BC8', '\u0BA4\u0BBE\u0B95\u0BCD\u0B95\u0BC1\u0BA4\u0BB2\u0BCD', '\u0BAA\u0BCB\u0BA4\u0BC8', '\u0B95\u0BA0\u0BCD\u0B9A\u0BBE', '\u0B95\u0BB2\u0BB5\u0BB0\u0BAE\u0BCD',
    '\u0B95\u0BC8\u0BA4\u0BC1', '\u0B95\u0BC8\u0BA4\u0BBF\u0B95\u0BB3\u0BCD', '\u0BAA\u0BAF\u0BA5\u0BCD\u0B95\u0BB0\u0BB5\u0BBE\u0BA4\u0BAE\u0BCD', '\u0B95\u0BA0\u0BA4\u0BCD\u0BA4\u0BB2\u0BCD', '\u0B9A\u0BA4\u0BBF'
  ],

  // ============================================================
  // EXTENDED \u2014 GPT-4 classification English keywords per spec
  // ============================================================
  extended: [
    // Spec-required English keywords
    'murder', 'robbery', 'POCSO', 'weapon', 'caste violence',
    'religious riot', 'protest', 'gang', 'firearms', 'aruval', 'drugs', 'rowdy',
    // Additional
    'attack', 'bomb', 'explosive', 'kidnap', 'abduction', 'rape',
    'assault', 'riot', 'communal', 'tension', 'clash', 'arson',
    'smuggling', 'ganja', 'liquor', 'illicit',
    'threat', 'extortion', 'dacoity', 'burglary', 'snatch',
    'accused', 'arrested', 'detained', 'encounter', 'firing'
  ],

  // ============================================================
  // DISTRICT \u2014 Virudhunagar district + all 10 taluks
  // ============================================================
  virudhunagar: [
    // District
    '\u0BB5\u0BBF\u0BB0\u0BC1\u0BA4\u0BC1\u0BA8\u0B95\u0BB0\u0BCD', 'Virudhunagar',
    // Taluks \u2014 English
    'Srivilliputhur', 'Rajapalayam', 'Sivakasi', 'Sattur',
    'Aruppukkottai', 'Tiruchuli', 'Watrap', 'Vembakottai', 'Krishnankoil',
    // Taluks \u2014 Tamil
    '\u0BB8\u0BCD\u0BB0\u0BC0\u0BB5\u0BBF\u0BB2\u0BCD\u0BB2\u0BBF\u0BAA\u0BC1\u0BA4\u0BCD\u0BA4\u0BC2\u0BB0\u0BCD', '\u0BB0\u0BBE\u0B9C\u0BAA\u0BBE\u0BB3\u0BC8\u0BAF\u0BAE\u0BCD', '\u0B9A\u0BBF\u0BB5\u0B95\u0BBE\u0B9A\u0BBF', '\u0B9A\u0BBE\u0BA4\u0BCD\u0BA4\u0BC2\u0BB0\u0BCD',
    '\u0B85\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BCD\u0B95\u0BCB\u0B9F\u0BCD\u0B9F\u0BC8', '\u0BA4\u0BBF\u0BB0\u0BC1\u0B9A\u0BCD\u0B9A\u0BC1\u0BB4\u0BBF', '\u0BB5\u0BA4\u0BCD\u0BA4\u0BBF\u0BB0\u0BBE\u0BAF\u0BBF\u0BB0\u0BBE\u0BAA\u0BCD\u0BAA\u0BC1',
    '\u0BB5\u0BC7\u0BAE\u0BCD\u0BAA\u0B95\u0BCD\u0B95\u0BCB\u0BA0\u0BCD\u0BA0\u0BC8', '\u0B95\u0BBF\u0BB0\u0BC1\u0BB7\u0BCD\u0BA3\u0BA9\u0BCD\u0B95\u0BCB\u0BAF\u0BBF\u0BB2\u0BCD'
  ],

  // ============================================================
  // TALUK MAP \u2014 For district-level filtering in alerts
  // ============================================================
  talukMap: {
    'Srivilliputhur': 'Srivilliputhur',
    '\u0BB8\u0BCD\u0BB0\u0BC0\u0BB5\u0BBF\u0BB2\u0BCD\u0BB2\u0BBF\u0BAA\u0BC1\u0BA4\u0BCD\u0BA4\u0BC2\u0BB0\u0BCD': 'Srivilliputhur',
    'Rajapalayam': 'Rajapalayam',
    '\u0BB0\u0BBE\u0B9C\u0BAA\u0BBE\u0BB3\u0BC8\u0BAF\u0BAE\u0BCD': 'Rajapalayam',
    'Sivakasi': 'Sivakasi',
    '\u0B9A\u0BBF\u0BB5\u0B95\u0BBE\u0B9A\u0BBF': 'Sivakasi',
    'Sattur': 'Sattur',
    '\u0B9A\u0BBE\u0BA4\u0BCD\u0BA4\u0BC2\u0BB0\u0BCD': 'Sattur',
    'Aruppukkottai': 'Aruppukkottai',
    '\u0B85\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BCD\u0B95\u0BCB\u0B9F\u0BCD\u0B9F\u0BC8': 'Aruppukkottai',
    'Tiruchuli': 'Tiruchuli',
    '\u0BA4\u0BBF\u0BB0\u0BC1\u0B9A\u0BCD\u0B9A\u0BC1\u0BB4\u0BBF': 'Tiruchuli',
    'Watrap': 'Watrap',
    '\u0BB5\u0BA4\u0BCD\u0BA4\u0BBF\u0BB0\u0BBE\u0BAF\u0BBF\u0BB0\u0BBE\u0BAA\u0BCD\u0BAA\u0BC1': 'Watrap',
    'Vembakottai': 'Vembakottai',
    '\u0BB5\u0BC7\u0BAE\u0BCD\u0BAA\u0B95\u0BCD\u0B95\u0BCB\u0BA0\u0BCD\u0BA0\u0BC8': 'Vembakottai',
    'Krishnankoil': 'Krishnankoil',
    '\u0B95\u0BBF\u0BB0\u0BC1\u0BB7\u0BCD\u08E3\u0BA9\u0BCD\u0B95\u0BCB\u0BAF\u0BBF\u0BB2\u0BCD': 'Krishnankoil'
  },

  // ============================================================
  // CATEGORY MAP \u2014 keyword \u2192 category label
  // ============================================================
  categoryMap: {
    // POCSO
    'pocso': 'POCSO',
    '\u0BAA\u0BCB\u0B95\u0BCD\u0B9A\u0BCB': 'POCSO',
    'child': 'POCSO',
    'minor': 'POCSO',
    'POCSO': 'POCSO',
    // Weapons
    'weapon': 'Weapons',
    '\u0B86\u0BAF\u0BC1\u0BA4\u0BAE\u0BCD': 'Weapons',
    'aruval': 'Weapons',
    '\u0B85\u0BB0\u0BC1\u0BB5\u0BBE\u0BB3\u0BCD': 'Weapons',
    '\u0B85\u0BB0\u0BBF\u0BB5\u0BBE\u0BB3\u0BCD': 'Weapons',
    'knife': 'Weapons',
    'sword': 'Weapons',
    // Caste
    'caste': 'Caste',
    '\u0B9A\u0BBE\u0BA4\u0BBF': 'Caste',
    'communal': 'Caste',
    'caste violence': 'Caste',
    '\u0B9C\u0BBE\u0BA4\u0BBF \u0B95\u0BB2\u0BB5\u0BB0\u0BAE\u0BCD': 'Caste',
    '\u0B9C\u0BBE\u0BA4\u0BBF': 'Caste',
    // Religious
    'religious': 'Religious',
    '\u0BAE\u0BA4\u0BAE\u0BCD': 'Religious',
    '\u0BAE\u0BA4 \u0B95\u0BB2\u0BB5\u0BB0\u0BAE\u0BCD': 'Religious',
    'temple': 'Religious',
    'mosque': 'Religious',
    'church': 'Religious',
    'religious riot': 'Religious',
    // Protest
    'protest': 'Protest',
    '\u0BAA\u0BCB\u0BB0\u0BBE\u0B9F\u0BCD\u0B9F\u0BAE\u0BCD': 'Protest',
    'rally': 'Protest',
    'strike': 'Protest',
    'bandh': 'Protest',
    '\u0B95\u0BB2\u0BB5\u0BB0\u0BAE\u0BCD': 'Protest',
    // Firearms
    'firearm': 'Firearms',
    'firearms': 'Firearms',
    'gun': 'Firearms',
    '\u0BA4\u0BC1\u0BAA\u0BCD\u0BAA\u0BBE\u0B95\u0BCD\u0B95\u0BBF': 'Firearms',
    'pistol': 'Firearms',
    'rifle': 'Firearms',
    'firing': 'Firearms',
    // Gang / Rowdy
    'rowdy': 'Gang',
    'gang': 'Gang',
    '\u0BB0\u0BB5\u0BC1\u0B9F\u0BBF': 'Gang',
    '\u0B95\u0BC1\u0BAE\u0BCD\u0BAA\u0BB2\u0BCD': 'Gang',
    // Murder
    'murder': 'Murder',
    '\u0B95\u0BCA\u0BB2\u0BC8': 'Murder',
    'homicide': 'Murder',
    'kill': 'Murder',
    '\u0B95\u0BB1\u0BCD\u0BAA\u0BB4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1': 'POCSO',
    'rape': 'POCSO',
    // Theft
    'theft': 'Theft',
    '\u0BA4\u0BBF\u0BB0\u0BC1\u0B9F\u0BCD\u0B9F\u0BC1': 'Theft',
    'steal': 'Theft',
    'burglary': 'Theft',
    // Robbery
    'robbery': 'Robbery',
    '\u0B95\u0BCA\u0BB3\u0BCD\u0BB3\u0BC8': 'Robbery',
    'loot': 'Robbery',
    'dacoity': 'Robbery',
    // Drugs
    'drugs': 'Drugs',
    '\u0BAA\u0BCB\u0BA4\u0BC8\u0BAA\u0BCA\u0BB0\u0BC1\u0BB3\u0BCD': 'Drugs',
    '\u0BAA\u0BCB\u0BA4\u0BC8': 'Drugs',
    'ganja': 'Drugs',
    '\u0B95\u0BA0\u0BCD\u0B9A\u0BBE': 'Drugs',
    'drug': 'Drugs',
    'narcotic': 'Drugs',
    'smuggling': 'Drugs'
  }
};
