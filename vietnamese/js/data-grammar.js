// Vietnamese usage & grammar pop-up questions.
// q = question (with ___ blank), opts = choices, a = index of correct answer,
// wEn/wEs = short explanation ("why") in English / Spanish.
const GRAMMAR = [
  // ---------- A1 : classifiers ----------
  {id:"g001", lv:"A1", q:"one cat = một ___ mèo", opts:["con","cái"], a:0, wEn:"'con' is the classifier for animals: một con mèo.", wEs:"'con' es el clasificador para animales: một con mèo."},
  {id:"g002", lv:"A1", q:"one table = một ___ bàn", opts:["con","cái"], a:1, wEn:"'cái' is the classifier for most objects: một cái bàn.", wEs:"'cái' es el clasificador para la mayoría de objetos: một cái bàn."},
  {id:"g003", lv:"A1", q:"one person = một ___", opts:["người","con"], a:0, wEn:"'người' is the classifier for people: một người.", wEs:"'người' es el clasificador para personas: một người."},
  {id:"g004", lv:"A1", q:"one dog = một ___ chó", opts:["cái","con"], a:1, wEn:"Animals take 'con': một con chó.", wEs:"Los animales llevan 'con': một con chó."},

  // ---------- A1 : word order (adjective after noun) ----------
  {id:"g005", lv:"A1", q:"a beautiful house =", opts:["nhà đẹp","đẹp nhà"], a:0, wEn:"Adjectives come AFTER the noun: nhà đẹp (house beautiful).", wEs:"El adjetivo va DESPUÉS del sustantivo: nhà đẹp (casa bonita)."},
  {id:"g006", lv:"A1", q:"good coffee =", opts:["ngon cà phê","cà phê ngon"], a:1, wEn:"Noun first, then adjective: cà phê ngon.", wEs:"Primero el sustantivo, luego el adjetivo: cà phê ngon."},
  {id:"g007", lv:"A1", q:"my mother =", opts:["mẹ tôi","tôi mẹ"], a:0, wEn:"Possessor comes after: mẹ tôi (mother my).", wEs:"El poseedor va después: mẹ tôi (madre mía)."},

  // ---------- A1 : negation ----------
  {id:"g008", lv:"A1", q:"I don't eat = Tôi ___ ăn", opts:["không","không phải"], a:0, wEn:"'không' before the verb makes it negative: không ăn.", wEs:"'không' antes del verbo lo hace negativo: không ăn."},
  {id:"g009", lv:"A1", q:"He is not tired = Anh ấy ___ mệt", opts:["không","đừng"], a:0, wEn:"'không' negates adjectives and verbs; 'đừng' means 'don't (command)'.", wEs:"'không' niega adjetivos y verbos; 'đừng' significa 'no (imperativo)'."},

  // ---------- A1 : yes/no questions ----------
  {id:"g010", lv:"A1", q:"Are you well? = Bạn khỏe ___ ?", opts:["không","gì"], a:0, wEn:"Yes/no questions use '...không?' at the end: khỏe không?", wEs:"Las preguntas de sí/no usan '...không?' al final: khỏe không?"},
  {id:"g011", lv:"A1", q:"Do you have coffee? = Bạn ___ cà phê không?", opts:["có","là"], a:0, wEn:"'có...không?' = 'do you have...?': có cà phê không?", wEs:"'có...không?' = '¿tienes...?': có cà phê không?"},
  {id:"g012", lv:"A1", q:"What is this? = Đây là cái ___ ?", opts:["gì","đâu"], a:0, wEn:"'gì' = what; 'đâu' = where.", wEs:"'gì' = qué; 'đâu' = dónde."},

  // ---------- A2 : 'là' (to be) ----------
  {id:"g013", lv:"A2", q:"I am a teacher = Tôi ___ giáo viên", opts:["là","ở"], a:0, wEn:"'là' links two nouns (I = teacher). Don't use 'là' before adjectives.", wEs:"'là' une dos sustantivos (yo = profesor). No se usa 'là' ante adjetivos."},
  {id:"g014", lv:"A2", q:"I am tired = Tôi ___ mệt", opts:["là","(nothing)"], a:1, wEn:"No 'là' before an adjective: just 'Tôi mệt'.", wEs:"Sin 'là' ante un adjetivo: solo 'Tôi mệt'."},
  {id:"g015", lv:"A2", q:"I am at home = Tôi ___ nhà", opts:["là","ở"], a:1, wEn:"'ở' = to be located at: Tôi ở nhà.", wEs:"'ở' = estar (ubicación): Tôi ở nhà."},

  // ---------- A2 : tense markers ----------
  {id:"g016", lv:"A2", q:"I will go = Tôi ___ đi", opts:["sẽ","đã"], a:0, wEn:"'sẽ' before the verb = future. 'đã' = past.", wEs:"'sẽ' antes del verbo = futuro. 'đã' = pasado."},
  {id:"g017", lv:"A2", q:"I ate already = Tôi ___ ăn rồi", opts:["sẽ","đã"], a:1, wEn:"'đã...rồi' marks completed past action.", wEs:"'đã...rồi' marca una acción pasada terminada."},
  {id:"g018", lv:"A2", q:"I am eating = Tôi ___ ăn", opts:["đang","sẽ"], a:0, wEn:"'đang' before the verb = happening now (-ing).", wEs:"'đang' antes del verbo = acción en curso (-ando)."},

  // ---------- A2 : 'rất' vs 'quá' ----------
  {id:"g019", lv:"A2", q:"very delicious = ___ ngon", opts:["rất","lắm"], a:0, wEn:"'rất' goes BEFORE the adjective: rất ngon. 'lắm' goes after.", wEs:"'rất' va ANTES del adjetivo: rất ngon. 'lắm' va después."},
  {id:"g020", lv:"A2", q:"too expensive = đắt ___", opts:["rất","quá"], a:1, wEn:"'quá' after the adjective = 'too...': đắt quá.", wEs:"'quá' tras el adjetivo = 'demasiado...': đắt quá."},

  // ---------- B1 : pronoun choice ----------
  {id:"g021", lv:"B1", q:"Talking to an older man, call him:", opts:["anh","em"], a:0, wEn:"Address an older man as 'anh', a younger person as 'em'.", wEs:"A un hombre mayor se le trata de 'anh'; a alguien menor, 'em'."},
  {id:"g022", lv:"B1", q:"Talking to an older woman, call her:", opts:["chị","anh"], a:0, wEn:"'chị' = older woman/sister; 'anh' = older man/brother.", wEs:"'chị' = mujer mayor/hermana; 'anh' = hombre mayor/hermano."},

  // ---------- B1 : ability 'được' ----------
  {id:"g023", lv:"B1", q:"Can you help? = Bạn giúp ___ không?", opts:["được","rồi"], a:0, wEn:"'...được không?' asks about ability/possibility: giúp được không?", wEs:"'...được không?' pregunta por capacidad/posibilidad: giúp được không?"},
  {id:"g024", lv:"B1", q:"plural 'the friends' = ___ bạn bè", opts:["các","một"], a:0, wEn:"'các' marks a known plural group; 'một' = one.", wEs:"'các' marca un grupo plural conocido; 'một' = uno."}
];
