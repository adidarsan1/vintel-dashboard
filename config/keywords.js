// Intelligence monitoring keywords (English + Tamil)
// Updated with full classification keyword list per spec
module.exports = {

  // ============================================================
  // PRIMARY — Core English crime/intelligence keywords
  // ============================================================
  primary: [
    'crime', 'pocso', 'weapon', 'aruval', 'caste', 'religious',
    'protest', 'firearms', 'rowdy', 'gang', 'murder', 'theft', 'robbery',
    'drugs', 'violence', 'riot', 'arrest', 'police', 'accused'
  ],

  // ============================================================
  // TAMIL — Full GPT-4 classification keyword list per spec
  // ============================================================
  tamil: [
    // Spec-required Tamil keywords
    'கொலை',         // murder
    'கொள்ளை',       // robbery
    'கற்பழிப்பு',   // rape
    'ஆயுதம்',       // weapon
    'ஜாதி கலவரம்',  // caste violence
    'மத கலவரம்',    // religious riot
    'போராட்டம்',    // protest
    'கும்பய',       // gang
    'துப்பாக்கி',   // firearms
    'அரிவாள்',      // aruval (sickle)
    'போதைபொருள்',   // drugs
    // Additional Tamil keywords (existing)
    'குற்றம்', 'போக்சோ', 'ஆயுதில்', 'சாதி', 'மதம்', 'ரவு஠ி', 'திரு஠்஠ு', 'வெ஧ிகுண்஧ு', 'மிரஷ்ஷல்', 'க஠த்தல்',
    'வன்மு஡ை', 'தாக்குதல்', 'போதை', 'க஠்சா', 'கலவரம்',
    'கைது', 'கைதிகள்', 'பய஥்கரவாதம்', 'க஠த்தல்', 'சதி'
  ],

  // ============================================================
  // EXTENDED — GPT-4 classification English keywords per spec
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
  // DISTRICT — Virudhunagar district + all 10 taluks
  // ============================================================
  virudhunagar: [
    // District
    'விருதுநகர்', 'Virudhunagar',
    // Taluks — English
    'Srivilliputhur', 'Rajapalayam', 'Sivakasi', 'Sattur',
    'Aruppukkottai', 'Tiruchuli', 'Watrap', 'Vembakottai', 'Krishnankoil',
    // Taluks — Tamil
    'ஸ்ரீவில்லிபுத்தூர்', 'ராஜபாளையம்', 'சிவகாசி', 'சாத்தூர்',
    'அருப்புக்கோட்டை', 'திருச்சுழி', 'வத்திராயிராப்பு',
    'வேம்பக்கோ஠்஠ை', 'கிருஷ்ணன்கோயில்'
  ],

  // ============================================================
  // TALUK MAP — For district-level filtering in alerts
  // ============================================================
  talukMap: {
    'Srivilliputhur': 'Srivilliputhur',
    'ஸ்ரீவில்லிபுத்தூர்': 'Srivilliputhur',
    'Rajapalayam': 'Rajapalayam',
    'ராஜபாளையம்': 'Rajapalayam',
    'Sivakasi': 'Sivakasi',
    'சிவகாசி': 'Sivakasi',
    'Sattur': 'Sattur',
    'சாத்தூர்': 'Sattur',
    'Aruppukkottai': 'Aruppukkottai',
    'அருப்புக்கோட்டை': 'Aruppukkottai',
    'Tiruchuli': 'Tiruchuli',
    'திருச்சுழி': 'Tiruchuli',
    'Watrap': 'Watrap',
    'வத்திராயிராப்பு': 'Watrap',
    'Vembakottai': 'Vembakottai',
    'வேம்பக்கோ஠்஠ை': 'Vembakottai',
    'Krishnankoil': 'Krishnankoil',
    'கிருஷ்ࣣன்கோயில்': 'Krishnankoil'
  },

  // ============================================================
  // CATEGORY MAP — keyword → category label
  // ============================================================
  categoryMap: {
    // POCSO
    'pocso': 'POCSO',
    'போக்சோ': 'POCSO',
    'child': 'POCSO',
    'minor': 'POCSO',
    'POCSO': 'POCSO',
    // Weapons
    'weapon': 'Weapons',
    'ஆயுதம்': 'Weapons',
    'aruval': 'Weapons',
    'அருவாள்': 'Weapons',
    'அரிவாள்': 'Weapons',
    'knife': 'Weapons',
    'sword': 'Weapons',
    // Caste
    'caste': 'Caste',
    'சாதி': 'Caste',
    'communal': 'Caste',
    'caste violence': 'Caste',
    'ஜாதி கலவரம்': 'Caste',
    'ஜாதி': 'Caste',
    // Religious
    'religious': 'Religious',
    'மதம்': 'Religious',
    'மத கலவரம்': 'Religious',
    'temple': 'Religious',
    'mosque': 'Religious',
    'church': 'Religious',
    'religious riot': 'Religious',
    // Protest
    'protest': 'Protest',
    'போராட்டம்': 'Protest',
    'rally': 'Protest',
    'strike': 'Protest',
    'bandh': 'Protest',
    'கலவரம்': 'Protest',
    // Firearms
    'firearm': 'Firearms',
    'firearms': 'Firearms',
    'gun': 'Firearms',
    'துப்பாக்கி': 'Firearms',
    'pistol': 'Firearms',
    'rifle': 'Firearms',
    'firing': 'Firearms',
    // Gang / Rowdy
    'rowdy': 'Gang',
    'gang': 'Gang',
    'ரவுடி': 'Gang',
    'கும்பல்': 'Gang',
    // Murder
    'murder': 'Murder',
    'கொலை': 'Murder',
    'homicide': 'Murder',
    'kill': 'Murder',
    'கற்பழிப்பு': 'POCSO',
    'rape': 'POCSO',
    // Theft
    'theft': 'Theft',
    'திருட்டு': 'Theft',
    'steal': 'Theft',
    'burglary': 'Theft',
    // Robbery
    'robbery': 'Robbery',
    'கொள்ளை': 'Robbery',
    'loot': 'Robbery',
    'dacoity': 'Robbery',
    // Drugs
    'drugs': 'Drugs',
    'போதைபொருள்': 'Drugs',
    'போதை': 'Drugs',
    'ganja': 'Drugs',
    'க஠்சா': 'Drugs',
    'drug': 'Drugs',
    'narcotic': 'Drugs',
    'smuggling': 'Drugs'
  }
};
