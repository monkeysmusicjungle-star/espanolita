// Vietnamese vocabulary: vi = Vietnamese, en = English, es = Spanish,
// ex = example phrase in Vietnamese, exEn/exEs = phrase translations.
// lv = level band (A1/A2/B1). ids must stay stable.
const VOCAB = [
  // ---------- A1 : greetings & basics ----------
  {id:"v001", lv:"A1", vi:"xin chào", en:"hello", es:"hola", ex:"Xin chào! Bạn khỏe không?", exEn:"Hello! How are you?", exEs:"¡Hola! ¿Cómo estás?"},
  {id:"v002", lv:"A1", vi:"tạm biệt", en:"goodbye", es:"adiós", ex:"Tạm biệt, hẹn gặp lại.", exEn:"Goodbye, see you again.", exEs:"Adiós, hasta la vista."},
  {id:"v003", lv:"A1", vi:"cảm ơn", en:"thank you", es:"gracias", ex:"Cảm ơn bạn rất nhiều.", exEn:"Thank you very much.", exEs:"Muchas gracias."},
  {id:"v004", lv:"A1", vi:"xin lỗi", en:"sorry / excuse me", es:"perdón", ex:"Xin lỗi, nhà vệ sinh ở đâu?", exEn:"Excuse me, where is the toilet?", exEs:"Perdón, ¿dónde está el baño?"},
  {id:"v005", lv:"A1", vi:"vâng / dạ", en:"yes (polite)", es:"sí", ex:"Vâng, tôi hiểu.", exEn:"Yes, I understand.", exEs:"Sí, entiendo."},
  {id:"v006", lv:"A1", vi:"không", en:"no / not", es:"no", ex:"Không, cảm ơn.", exEn:"No, thank you.", exEs:"No, gracias."},
  {id:"v007", lv:"A1", vi:"làm ơn", en:"please", es:"por favor", ex:"Làm ơn nói chậm hơn.", exEn:"Please speak more slowly.", exEs:"Por favor, habla más despacio."},
  {id:"v008", lv:"A1", vi:"chào buổi sáng", en:"good morning", es:"buenos días", ex:"Chào buổi sáng, cô Lan.", exEn:"Good morning, Ms. Lan.", exEs:"Buenos días, señora Lan."},
  {id:"v009", lv:"A1", vi:"chúc ngủ ngon", en:"good night", es:"buenas noches", ex:"Chúc ngủ ngon, hẹn mai gặp.", exEn:"Good night, see you tomorrow.", exEs:"Buenas noches, hasta mañana."},
  {id:"v010", lv:"A1", vi:"bạn khỏe không?", en:"how are you?", es:"¿cómo estás?", ex:"Chào Nam, bạn khỏe không?", exEn:"Hi Nam, how are you?", exEs:"Hola Nam, ¿cómo estás?"},
  {id:"v011", lv:"A1", vi:"khỏe", en:"well / healthy", es:"bien", ex:"Tôi khỏe, cảm ơn.", exEn:"I'm well, thank you.", exEs:"Estoy bien, gracias."},
  {id:"v012", lv:"A1", vi:"tôi tên là", en:"my name is", es:"me llamo", ex:"Tôi tên là Sonja.", exEn:"My name is Sonja.", exEs:"Me llamo Sonja."},
  {id:"v013", lv:"A1", vi:"rất vui được gặp bạn", en:"nice to meet you", es:"mucho gusto", ex:"Rất vui được gặp bạn.", exEn:"Nice to meet you.", exEs:"Mucho gusto."},

  // ---------- A1 : numbers ----------
  {id:"v014", lv:"A1", vi:"một", en:"one", es:"uno", ex:"Cho tôi một cà phê.", exEn:"Give me one coffee.", exEs:"Dame un café."},
  {id:"v015", lv:"A1", vi:"hai", en:"two", es:"dos", ex:"Tôi có hai anh trai.", exEn:"I have two older brothers.", exEs:"Tengo dos hermanos mayores."},
  {id:"v016", lv:"A1", vi:"ba", en:"three", es:"tres", ex:"Ba giờ chiều.", exEn:"Three in the afternoon.", exEs:"Las tres de la tarde."},
  {id:"v017", lv:"A1", vi:"bốn", en:"four", es:"cuatro", ex:"Bốn người.", exEn:"Four people.", exEs:"Cuatro personas."},
  {id:"v018", lv:"A1", vi:"năm", en:"five", es:"cinco", ex:"Năm phút.", exEn:"Five minutes.", exEs:"Cinco minutos."},

  // ---------- A1 : pronouns & people ----------
  {id:"v019", lv:"A1", vi:"tôi", en:"I / me", es:"yo", ex:"Tôi là người Hà Lan.", exEn:"I am Dutch.", exEs:"Soy holandesa."},
  {id:"v020", lv:"A1", vi:"bạn", en:"you (friend)", es:"tú", ex:"Bạn tên là gì?", exEn:"What is your name?", exEs:"¿Cómo te llamas?"},
  {id:"v021", lv:"A1", vi:"anh", en:"you (older man) / older brother", es:"tú (hombre mayor)", ex:"Anh muốn uống gì?", exEn:"What would you like to drink?", exEs:"¿Qué quieres beber?"},
  {id:"v022", lv:"A1", vi:"chị", en:"you (older woman) / older sister", es:"tú (mujer mayor)", ex:"Chị khỏe không?", exEn:"How are you?", exEs:"¿Cómo estás?"},
  {id:"v023", lv:"A1", vi:"em", en:"you (younger) / younger sibling", es:"tú (menor)", ex:"Em học lớp mấy?", exEn:"What grade are you in?", exEs:"¿En qué curso estás?"},
  {id:"v024", lv:"A1", vi:"gia đình", en:"family", es:"familia", ex:"Gia đình tôi có bốn người.", exEn:"My family has four people.", exEs:"Mi familia tiene cuatro personas."},
  {id:"v025", lv:"A1", vi:"mẹ", en:"mother", es:"madre", ex:"Mẹ tôi nấu ăn ngon.", exEn:"My mother cooks well.", exEs:"Mi madre cocina bien."},
  {id:"v026", lv:"A1", vi:"bố", en:"father", es:"padre", ex:"Bố tôi đi làm.", exEn:"My father goes to work.", exEs:"Mi padre va a trabajar."},
  {id:"v027", lv:"A1", vi:"con", en:"child", es:"hijo/a", ex:"Chị ấy có hai con.", exEn:"She has two children.", exEs:"Ella tiene dos hijos."},
  {id:"v028", lv:"A1", vi:"bạn bè", en:"friends", es:"amigos", ex:"Tôi gặp bạn bè.", exEn:"I meet friends.", exEs:"Me encuentro con amigos."},

  // ---------- A1 : food & drink ----------
  {id:"v029", lv:"A1", vi:"nước", en:"water", es:"agua", ex:"Cho tôi một cốc nước.", exEn:"Give me a glass of water.", exEs:"Dame un vaso de agua."},
  {id:"v030", lv:"A1", vi:"cà phê", en:"coffee", es:"café", ex:"Cà phê Việt Nam rất ngon.", exEn:"Vietnamese coffee is very good.", exEs:"El café vietnamita es muy bueno."},
  {id:"v031", lv:"A1", vi:"cơm", en:"rice (cooked)", es:"arroz", ex:"Tôi ăn cơm mỗi ngày.", exEn:"I eat rice every day.", exEs:"Como arroz todos los días."},
  {id:"v032", lv:"A1", vi:"phở", en:"pho (noodle soup)", es:"pho (sopa de fideos)", ex:"Tôi thích ăn phở.", exEn:"I like eating pho.", exEs:"Me gusta comer pho."},
  {id:"v033", lv:"A1", vi:"bánh mì", en:"bread / sandwich", es:"pan", ex:"Bánh mì rất rẻ.", exEn:"Bánh mì is very cheap.", exEs:"El bánh mì es muy barato."},
  {id:"v034", lv:"A1", vi:"ăn", en:"to eat", es:"comer", ex:"Bạn muốn ăn gì?", exEn:"What do you want to eat?", exEs:"¿Qué quieres comer?"},
  {id:"v035", lv:"A1", vi:"uống", en:"to drink", es:"beber", ex:"Tôi uống trà.", exEn:"I drink tea.", exEs:"Bebo té."},
  {id:"v036", lv:"A1", vi:"ngon", en:"delicious", es:"delicioso", ex:"Món này rất ngon!", exEn:"This dish is delicious!", exEs:"¡Este plato está delicioso!"},

  // ---------- A1 : common verbs ----------
  {id:"v037", lv:"A1", vi:"đi", en:"to go", es:"ir", ex:"Tôi đi chợ.", exEn:"I go to the market.", exEs:"Voy al mercado."},
  {id:"v038", lv:"A1", vi:"đến", en:"to come / arrive", es:"venir / llegar", ex:"Anh ấy đến muộn.", exEn:"He arrives late.", exEs:"Él llega tarde."},
  {id:"v039", lv:"A1", vi:"có", en:"to have", es:"tener", ex:"Tôi có một con mèo.", exEn:"I have a cat.", exEs:"Tengo un gato."},
  {id:"v040", lv:"A1", vi:"muốn", en:"to want", es:"querer", ex:"Tôi muốn học tiếng Việt.", exEn:"I want to learn Vietnamese.", exEs:"Quiero aprender vietnamita."},
  {id:"v041", lv:"A1", vi:"nói", en:"to speak / say", es:"hablar / decir", ex:"Bạn nói tiếng Anh không?", exEn:"Do you speak English?", exEs:"¿Hablas inglés?"},
  {id:"v042", lv:"A1", vi:"học", en:"to study / learn", es:"estudiar", ex:"Tôi học mỗi ngày.", exEn:"I study every day.", exEs:"Estudio todos los días."},
  {id:"v043", lv:"A1", vi:"làm", en:"to do / work", es:"hacer / trabajar", ex:"Bạn làm nghề gì?", exEn:"What work do you do?", exEs:"¿A qué te dedicas?"},
  {id:"v044", lv:"A1", vi:"ngủ", en:"to sleep", es:"dormir", ex:"Tôi ngủ tám tiếng.", exEn:"I sleep eight hours.", exEs:"Duermo ocho horas."},
  {id:"v045", lv:"A1", vi:"thích", en:"to like", es:"gustar", ex:"Tôi thích màu xanh.", exEn:"I like the color blue.", exEs:"Me gusta el color azul."},
  {id:"v046", lv:"A1", vi:"yêu", en:"to love", es:"amar", ex:"Tôi yêu gia đình tôi.", exEn:"I love my family.", exEs:"Amo a mi familia."},

  // ---------- A1 : places ----------
  {id:"v047", lv:"A1", vi:"nhà", en:"house / home", es:"casa", ex:"Tôi ở nhà.", exEn:"I am at home.", exEs:"Estoy en casa."},
  {id:"v048", lv:"A1", vi:"trường học", en:"school", es:"escuela", ex:"Trường học gần đây.", exEn:"The school is nearby.", exEs:"La escuela está cerca."},
  {id:"v049", lv:"A1", vi:"chợ", en:"market", es:"mercado", ex:"Chợ rất đông người.", exEn:"The market is crowded.", exEs:"El mercado está lleno de gente."},
  {id:"v050", lv:"A1", vi:"nhà hàng", en:"restaurant", es:"restaurante", ex:"Nhà hàng này ngon.", exEn:"This restaurant is good.", exEs:"Este restaurante es bueno."},

  // ---------- A1 : questions & directions ----------
  {id:"v051", lv:"A1", vi:"ở đâu", en:"where", es:"dónde", ex:"Nhà bạn ở đâu?", exEn:"Where is your house?", exEs:"¿Dónde está tu casa?"},
  {id:"v052", lv:"A1", vi:"cái gì", en:"what", es:"qué", ex:"Đây là cái gì?", exEn:"What is this?", exEs:"¿Qué es esto?"},
  {id:"v053", lv:"A1", vi:"bao nhiêu", en:"how much / how many", es:"cuánto", ex:"Cái này bao nhiêu tiền?", exEn:"How much is this?", exEs:"¿Cuánto cuesta esto?"},
  {id:"v054", lv:"A1", vi:"bên trái", en:"left", es:"izquierda", ex:"Rẽ bên trái.", exEn:"Turn left.", exEs:"Gira a la izquierda."},
  {id:"v055", lv:"A1", vi:"bên phải", en:"right", es:"derecha", ex:"Nhà tôi bên phải.", exEn:"My house is on the right.", exEs:"Mi casa está a la derecha."},

  // ---------- A1 : time & adjectives ----------
  {id:"v056", lv:"A1", vi:"hôm nay", en:"today", es:"hoy", ex:"Hôm nay trời đẹp.", exEn:"Today the weather is nice.", exEs:"Hoy hace buen tiempo."},
  {id:"v057", lv:"A1", vi:"ngày mai", en:"tomorrow", es:"mañana", ex:"Ngày mai tôi đi làm.", exEn:"Tomorrow I go to work.", exEs:"Mañana voy a trabajar."},
  {id:"v058", lv:"A1", vi:"bây giờ", en:"now", es:"ahora", ex:"Bây giờ là mấy giờ?", exEn:"What time is it now?", exEs:"¿Qué hora es ahora?"},
  {id:"v059", lv:"A1", vi:"tốt", en:"good", es:"bueno", ex:"Đây là ý tưởng tốt.", exEn:"This is a good idea.", exEs:"Esta es una buena idea."},
  {id:"v060", lv:"A1", vi:"lớn", en:"big", es:"grande", ex:"Ngôi nhà rất lớn.", exEn:"The house is very big.", exEs:"La casa es muy grande."},
  {id:"v061", lv:"A1", vi:"nhỏ", en:"small", es:"pequeño", ex:"Con mèo nhỏ.", exEn:"The cat is small.", exEs:"El gato es pequeño."},
  {id:"v062", lv:"A1", vi:"đẹp", en:"beautiful", es:"bonito", ex:"Cô ấy rất đẹp.", exEn:"She is very beautiful.", exEs:"Ella es muy bonita."},
  {id:"v063", lv:"A1", vi:"nóng", en:"hot", es:"caliente", ex:"Hôm nay trời nóng.", exEn:"Today it is hot.", exEs:"Hoy hace calor."},
  {id:"v064", lv:"A1", vi:"lạnh", en:"cold", es:"frío", ex:"Nước lạnh.", exEn:"The water is cold.", exEs:"El agua está fría."},

  // ---------- A2 : travel, feelings, verbs ----------
  {id:"v065", lv:"A2", vi:"vé", en:"ticket", es:"billete", ex:"Tôi mua vé máy bay.", exEn:"I buy a plane ticket.", exEs:"Compro un billete de avión."},
  {id:"v066", lv:"A2", vi:"sân bay", en:"airport", es:"aeropuerto", ex:"Sân bay xa không?", exEn:"Is the airport far?", exEs:"¿Está lejos el aeropuerto?"},
  {id:"v067", lv:"A2", vi:"biển", en:"sea", es:"mar", ex:"Tôi thích đi biển.", exEn:"I like going to the sea.", exEs:"Me gusta ir al mar."},
  {id:"v068", lv:"A2", vi:"đường", en:"road / street", es:"calle", ex:"Đường này rất dài.", exEn:"This road is very long.", exEs:"Esta calle es muy larga."},
  {id:"v069", lv:"A2", vi:"vui", en:"happy", es:"feliz", ex:"Tôi rất vui hôm nay.", exEn:"I am very happy today.", exEs:"Estoy muy feliz hoy."},
  {id:"v070", lv:"A2", vi:"buồn", en:"sad", es:"triste", ex:"Đừng buồn nhé.", exEn:"Don't be sad.", exEs:"No estés triste."},
  {id:"v071", lv:"A2", vi:"mệt", en:"tired", es:"cansado", ex:"Tôi hơi mệt.", exEn:"I am a little tired.", exEs:"Estoy un poco cansada."},
  {id:"v072", lv:"A2", vi:"thời tiết", en:"weather", es:"tiempo (clima)", ex:"Thời tiết hôm nay đẹp.", exEn:"The weather today is nice.", exEs:"Hoy hace buen tiempo."},
  {id:"v073", lv:"A2", vi:"công việc", en:"work / job", es:"trabajo", ex:"Công việc của tôi bận.", exEn:"My job is busy.", exEs:"Mi trabajo es ajetreado."},
  {id:"v074", lv:"A2", vi:"tiền", en:"money", es:"dinero", ex:"Tôi không có nhiều tiền.", exEn:"I don't have much money.", exEs:"No tengo mucho dinero."},
  {id:"v075", lv:"A2", vi:"mua", en:"to buy", es:"comprar", ex:"Tôi muốn mua cái này.", exEn:"I want to buy this.", exEs:"Quiero comprar esto."},
  {id:"v076", lv:"A2", vi:"giúp", en:"to help", es:"ayudar", ex:"Bạn giúp tôi được không?", exEn:"Can you help me?", exEs:"¿Me puedes ayudar?"},
  {id:"v077", lv:"A2", vi:"hiểu", en:"to understand", es:"entender", ex:"Tôi không hiểu.", exEn:"I don't understand.", exEs:"No entiendo."},
  {id:"v078", lv:"A2", vi:"biết", en:"to know", es:"saber", ex:"Tôi không biết.", exEn:"I don't know.", exEs:"No lo sé."},
  {id:"v079", lv:"A2", vi:"cần", en:"to need", es:"necesitar", ex:"Tôi cần nghỉ ngơi.", exEn:"I need to rest.", exEs:"Necesito descansar."},
  {id:"v080", lv:"A2", vi:"đắt", en:"expensive", es:"caro", ex:"Cái này đắt quá.", exEn:"This is too expensive.", exEs:"Esto es demasiado caro."},
  {id:"v081", lv:"A2", vi:"rẻ", en:"cheap", es:"barato", ex:"Chợ này rẻ.", exEn:"This market is cheap.", exEs:"Este mercado es barato."},
  {id:"v082", lv:"A2", vi:"nhanh", en:"fast", es:"rápido", ex:"Bạn đi nhanh quá.", exEn:"You walk too fast.", exEs:"Caminas demasiado rápido."},
  {id:"v083", lv:"A2", vi:"dễ", en:"easy", es:"fácil", ex:"Tiếng Việt không dễ.", exEn:"Vietnamese is not easy.", exEs:"El vietnamita no es fácil."},

  // ---------- B1 : connectors & frequency ----------
  {id:"v084", lv:"B1", vi:"khó", en:"difficult", es:"difícil", ex:"Phát âm rất khó.", exEn:"Pronunciation is very difficult.", exEs:"La pronunciación es muy difícil."},
  {id:"v085", lv:"B1", vi:"tại vì", en:"because", es:"porque", ex:"Tôi ở nhà tại vì trời mưa.", exEn:"I stay home because it's raining.", exEs:"Me quedo en casa porque llueve."},
  {id:"v086", lv:"B1", vi:"nhưng", en:"but", es:"pero", ex:"Tôi mệt nhưng vui.", exEn:"I'm tired but happy.", exEs:"Estoy cansada pero feliz."},
  {id:"v087", lv:"B1", vi:"và", en:"and", es:"y", ex:"Cà phê và bánh mì.", exEn:"Coffee and bread.", exEs:"Café y pan."},
  {id:"v088", lv:"B1", vi:"hoặc", en:"or", es:"o", ex:"Trà hoặc cà phê?", exEn:"Tea or coffee?", exEs:"¿Té o café?"},
  {id:"v089", lv:"B1", vi:"luôn luôn", en:"always", es:"siempre", ex:"Tôi luôn luôn dậy sớm.", exEn:"I always get up early.", exEs:"Siempre me levanto temprano."},
  {id:"v090", lv:"B1", vi:"không bao giờ", en:"never", es:"nunca", ex:"Tôi không bao giờ hút thuốc.", exEn:"I never smoke.", exEs:"Nunca fumo."},
  {id:"v091", lv:"B1", vi:"đôi khi", en:"sometimes", es:"a veces", ex:"Đôi khi tôi nấu ăn.", exEn:"Sometimes I cook.", exEs:"A veces cocino."},
  {id:"v092", lv:"B1", vi:"nghĩ", en:"to think", es:"pensar", ex:"Tôi nghĩ bạn đúng.", exEn:"I think you are right.", exEs:"Creo que tienes razón."},
  {id:"v093", lv:"B1", vi:"hy vọng", en:"to hope", es:"esperar", ex:"Tôi hy vọng gặp lại bạn.", exEn:"I hope to see you again.", exEs:"Espero verte de nuevo."},
  {id:"v094", lv:"B1", vi:"quan trọng", en:"important", es:"importante", ex:"Điều này rất quan trọng.", exEn:"This is very important.", exEs:"Esto es muy importante."},
  {id:"v095", lv:"B1", vi:"cùng nhau", en:"together", es:"juntos", ex:"Chúng ta đi cùng nhau.", exEn:"Let's go together.", exEs:"Vamos juntos."}
];
