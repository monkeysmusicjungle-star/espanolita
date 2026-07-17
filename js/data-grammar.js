// Grammar & spelling pop-up questions.
// q = question, opts = choices, a = index of correct answer,
// wEn/wNl = short explanation ("why") in English / Dutch.
const GRAMMAR = [
  // ---------- A1 : ser vs estar ----------
  {id:"g001", lv:"A1", q:"Yo ___ de Holanda.", opts:["soy","estoy"], a:0, wEn:"Origin is permanent → ser.", wNl:"Herkomst is blijvend → ser."},
  {id:"g002", lv:"A1", q:"El café ___ caliente.", opts:["es","está"], a:1, wEn:"A temporary state (temperature) → estar.", wNl:"Een tijdelijke toestand (temperatuur) → estar."},
  {id:"g003", lv:"A1", q:"María ___ en casa.", opts:["es","está"], a:1, wEn:"Location → always estar.", wNl:"Plaats → altijd estar."},
  {id:"g004", lv:"A1", q:"Nosotros ___ cansados.", opts:["somos","estamos"], a:1, wEn:"Being tired is temporary → estar.", wNl:"Moe zijn is tijdelijk → estar."},
  {id:"g005", lv:"A1", q:"Ella ___ profesora.", opts:["es","está"], a:0, wEn:"Profession → ser.", wNl:"Beroep → ser."},

  // ---------- A1 : gender el/la ----------
  {id:"g006", lv:"A1", q:"___ problema es grande.", opts:["El","La"], a:0, wEn:"'Problema' ends in -a but is masculine (Greek origin): el problema.", wNl:"'Problema' eindigt op -a maar is mannelijk: el problema."},
  {id:"g007", lv:"A1", q:"___ mano está fría.", opts:["El","La"], a:1, wEn:"'Mano' ends in -o but is feminine: la mano.", wNl:"'Mano' eindigt op -o maar is vrouwelijk: la mano."},
  {id:"g008", lv:"A1", q:"___ día es bonito.", opts:["El","La"], a:0, wEn:"'Día' is masculine despite the -a: el día.", wNl:"'Día' is mannelijk ondanks de -a: el día."},
  {id:"g009", lv:"A1", q:"___ noche es larga.", opts:["El","La"], a:1, wEn:"'Noche' is feminine: la noche.", wNl:"'Noche' is vrouwelijk: la noche."},
  {id:"g010", lv:"A1", q:"Which is correct?", opts:["la agua","el agua"], a:1, wEn:"'Agua' is feminine, but takes 'el' because it starts with stressed 'a'.", wNl:"'Agua' is vrouwelijk, maar krijgt 'el' omdat het met een beklemtoonde 'a' begint."},

  // ---------- A1 : present tense conjugation ----------
  {id:"g011", lv:"A1", q:"Yo ___ español. (hablar)", opts:["hablo","hablas","habla"], a:0, wEn:"Yo → -o ending: hablo.", wNl:"Yo → uitgang -o: hablo."},
  {id:"g012", lv:"A1", q:"Tú ___ mucho café. (beber)", opts:["bebo","bebes","bebe"], a:1, wEn:"Tú → -es for -er verbs: bebes.", wNl:"Tú → -es bij -er werkwoorden: bebes."},
  {id:"g013", lv:"A1", q:"Nosotros ___ en Ámsterdam. (vivir)", opts:["viven","vivimos","vive"], a:1, wEn:"Nosotros → -imos for -ir verbs: vivimos.", wNl:"Nosotros → -imos bij -ir werkwoorden: vivimos."},
  {id:"g014", lv:"A1", q:"Yo ___ dos hermanas. (tener)", opts:["teno","tengo","tiene"], a:1, wEn:"Tener is irregular: yo tengo.", wNl:"Tener is onregelmatig: yo tengo."},
  {id:"g015", lv:"A1", q:"Ella ___ al supermercado. (ir)", opts:["va","vas","voy"], a:0, wEn:"Ir is irregular: ella va.", wNl:"Ir is onregelmatig: ella va."},
  {id:"g016", lv:"A1", q:"¿___ tú inglés?", opts:["Hablo","Hablas","Habláis"], a:1, wEn:"Tú → hablas.", wNl:"Tú → hablas."},

  // ---------- A1 : spelling & accents ----------
  {id:"g017", lv:"A1", q:"Which spelling is correct? (I don't know)", opts:["No se","No sé"], a:1, wEn:"'Sé' (I know) needs an accent to distinguish it from 'se'.", wNl:"'Sé' (ik weet) krijgt een accent om het te onderscheiden van 'se'."},
  {id:"g018", lv:"A1", q:"Which is the question word?", opts:["que","qué"], a:1, wEn:"Question words always carry an accent: ¿qué?", wNl:"Vraagwoorden krijgen altijd een accent: ¿qué?"},
  {id:"g019", lv:"A1", q:"He/she is: ___", opts:["esta","está"], a:1, wEn:"'Está' (is) has an accent; 'esta' means 'this'.", wNl:"'Está' (is) heeft een accent; 'esta' betekent 'deze'."},
  {id:"g020", lv:"A1", q:"You (informal) = ___", opts:["tu","tú"], a:1, wEn:"'Tú' (you) has an accent; 'tu' means 'your'.", wNl:"'Tú' (jij) heeft een accent; 'tu' betekent 'jouw'."},
  {id:"g021", lv:"A1", q:"Spanish for 'the years': los ___", opts:["anos","años"], a:1, wEn:"The ñ matters: año = year, ano = something else entirely!", wNl:"De ñ is belangrijk: año = jaar, ano = iets héél anders!"},

  // ---------- A2 : past tenses ----------
  {id:"g022", lv:"A2", q:"Ayer ___ a la playa. (ir)", opts:["fui","iba","voy"], a:0, wEn:"A completed action yesterday → pretérito: fui.", wNl:"Een afgeronde actie gisteren → pretérito: fui."},
  {id:"g023", lv:"A2", q:"Cuando era niña, ___ mucho. (jugar)", opts:["jugué","jugaba","juego"], a:1, wEn:"A repeated habit in the past → imperfecto: jugaba.", wNl:"Een gewoonte in het verleden → imperfecto: jugaba."},
  {id:"g024", lv:"A2", q:"¿___ ya la película? (ver, tú)", opts:["Has visto","Viste ayer","Veías"], a:0, wEn:"'Already' with relevance now → perfecto: has visto.", wNl:"'Al' met relevantie voor nu → perfecto: has visto."},
  {id:"g025", lv:"A2", q:"Anoche ___ paella. (comer, yo)", opts:["comía","comí","he comido"], a:1, wEn:"A finished action last night → comí.", wNl:"Een afgeronde actie gisteravond → comí."},
  {id:"g026", lv:"A2", q:"El año pasado ___ a México. (viajar, nosotros)", opts:["viajamos","viajábamos","hemos viajado"], a:0, wEn:"A closed period (last year) → pretérito: viajamos.", wNl:"Een afgesloten periode (vorig jaar) → pretérito: viajamos."},

  // ---------- A2 : gustar & pronouns ----------
  {id:"g027", lv:"A2", q:"___ gusta el chocolate. (a mí)", opts:["Me","Te","Le"], a:0, wEn:"A mí → me gusta.", wNl:"A mí → me gusta."},
  {id:"g028", lv:"A2", q:"Me ___ las canciones españolas.", opts:["gusta","gustan"], a:1, wEn:"Plural thing (las canciones) → gustan.", wNl:"Meervoud (las canciones) → gustan."},
  {id:"g029", lv:"A2", q:"¿Dónde está el libro? No ___ veo.", opts:["lo","la","le"], a:0, wEn:"El libro is masculine → lo veo.", wNl:"El libro is mannelijk → lo veo."},
  {id:"g030", lv:"A2", q:"A Juan ___ encanta bailar.", opts:["me","te","le"], a:2, wEn:"A Juan (him) → le encanta.", wNl:"A Juan (hem) → le encanta."},

  // ---------- A2 : comparisons & misc ----------
  {id:"g031", lv:"A2", q:"Madrid es ___ grande ___ Toledo.", opts:["más / que","más / de","tan / que"], a:0, wEn:"Comparison: más ... que.", wNl:"Vergelijking: más ... que."},
  {id:"g032", lv:"A2", q:"Este café es ___ bueno como el otro.", opts:["más","tan","tanto"], a:1, wEn:"Equality: tan ... como.", wNl:"Gelijkheid: tan ... como."},
  {id:"g033", lv:"A2", q:"___ estudiar más para el examen. (obligation)", opts:["Tengo que","Tengo","Hay"], a:0, wEn:"Obligation → tener que + infinitive.", wNl:"Verplichting → tener que + heel werkwoord."},
  {id:"g034", lv:"A2", q:"¿___ un banco por aquí?", opts:["Está","Hay","Es"], a:1, wEn:"'Is there...?' → hay.", wNl:"'Is er...?' → hay."},
  {id:"g035", lv:"A2", q:"Mañana ___ a visitar a mi abuela.", opts:["voy","iré yo fui","va"], a:0, wEn:"Near future → ir a + infinitive: voy a visitar.", wNl:"Nabije toekomst → ir a + heel werkwoord: voy a visitar."},

  // ---------- B1 : subjunctive & advanced ----------
  {id:"g036", lv:"B1", q:"Espero que ___ un buen viaje. (tener, tú)", opts:["tienes","tengas","tendrás"], a:1, wEn:"Espero que + subjunctive: tengas.", wNl:"Espero que + subjuntivo: tengas."},
  {id:"g037", lv:"B1", q:"Quiero que me ___ la verdad. (decir, tú)", opts:["dices","digas","dirás"], a:1, wEn:"Quiero que + subjunctive: digas.", wNl:"Quiero que + subjuntivo: digas."},
  {id:"g038", lv:"B1", q:"Es importante que ___ cada día. (practicar)", opts:["practicas","practiques","practicarás"], a:1, wEn:"Es importante que + subjunctive: practiques.", wNl:"Es importante que + subjuntivo: practiques."},
  {id:"g039", lv:"B1", q:"Si tuviera dinero, ___ una casa en España.", opts:["compro","compraría","compré"], a:1, wEn:"Hypothesis: si + imperfect subjunctive → conditional: compraría.", wNl:"Hypothese: si + subjuntivo verleden → conditionalis: compraría."},
  {id:"g040", lv:"B1", q:"Cuando ___ a España, te llamaré. (llegar, yo)", opts:["llego","llegue","llegaré"], a:1, wEn:"Cuando + future idea → subjunctive: llegue.", wNl:"Cuando + toekomstidee → subjuntivo: llegue."},
  {id:"g041", lv:"B1", q:"No creo que ___ verdad. (ser)", opts:["es","sea","será"], a:1, wEn:"No creo que + subjunctive: sea.", wNl:"No creo que + subjuntivo: sea."},
  {id:"g042", lv:"B1", q:"___ dos años que vivo aquí.", opts:["Hace","Desde","Hay"], a:0, wEn:"Duration: hace + time + que.", wNl:"Tijdsduur: hace + tijd + que."},
  {id:"g043", lv:"B1", q:"El libro fue ___ por Cervantes.", opts:["escrito","escribido","escrivido"], a:0, wEn:"Irregular participle: escrito (and it's always with b → escribir).", wNl:"Onregelmatig voltooid deelwoord: escrito."},
  {id:"g044", lv:"B1", q:"Which spelling is correct?", opts:["haber si viene","a ver si viene"], a:1, wEn:"'A ver si...' (let's see if...) — often confused with 'haber'.", wNl:"'A ver si...' (eens kijken of...) — vaak verward met 'haber'."},
  {id:"g045", lv:"B1", q:"Me alegro de que te ___ la canción. (gustar)", opts:["gusta","guste","gustará"], a:1, wEn:"Emotion + que → subjunctive: guste.", wNl:"Emotie + que → subjuntivo: guste."}
];
