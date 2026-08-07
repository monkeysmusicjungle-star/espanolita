// Vietnamese hands-free speaking drills, graded A1 → A2 (spoken everyday phrases).
// vi = target, en/es = meaning in the interface language.
const DRILLS = [
  // ---------- A1 ----------
  {id:"d001", lv:"A1", vi:"Xin chào.", en:"Hello.", es:"Hola."},
  {id:"d002", lv:"A1", vi:"Cảm ơn bạn.", en:"Thank you.", es:"Gracias."},
  {id:"d003", lv:"A1", vi:"Tôi tên là Sonja.", en:"My name is Sonja.", es:"Me llamo Sonja."},
  {id:"d004", lv:"A1", vi:"Bạn khỏe không?", en:"How are you?", es:"¿Cómo estás?"},
  {id:"d005", lv:"A1", vi:"Tôi khỏe, cảm ơn.", en:"I'm well, thank you.", es:"Estoy bien, gracias."},
  {id:"d006", lv:"A1", vi:"Rất vui được gặp bạn.", en:"Nice to meet you.", es:"Mucho gusto."},
  {id:"d007", lv:"A1", vi:"Xin lỗi.", en:"Sorry / excuse me.", es:"Perdón."},
  {id:"d008", lv:"A1", vi:"Tôi không hiểu.", en:"I don't understand.", es:"No entiendo."},
  {id:"d009", lv:"A1", vi:"Cho tôi một cà phê.", en:"Give me a coffee.", es:"Dame un café."},
  {id:"d010", lv:"A1", vi:"Cái này bao nhiêu tiền?", en:"How much is this?", es:"¿Cuánto cuesta esto?"},
  {id:"d011", lv:"A1", vi:"Nhà vệ sinh ở đâu?", en:"Where is the toilet?", es:"¿Dónde está el baño?"},
  {id:"d012", lv:"A1", vi:"Tôi là người Hà Lan.", en:"I am Dutch.", es:"Soy holandesa."},
  {id:"d013", lv:"A1", vi:"Hôm nay trời đẹp.", en:"Today the weather is nice.", es:"Hoy hace buen tiempo."},
  {id:"d014", lv:"A1", vi:"Tạm biệt, hẹn gặp lại.", en:"Goodbye, see you again.", es:"Adiós, hasta la vista."},
  {id:"d015", lv:"A1", vi:"Món này rất ngon.", en:"This dish is delicious.", es:"Este plato está delicioso."},

  // ---------- A2 ----------
  {id:"d016", lv:"A2", vi:"Bạn giúp tôi được không?", en:"Can you help me?", es:"¿Me puedes ayudar?"},
  {id:"d017", lv:"A2", vi:"Tôi muốn học tiếng Việt.", en:"I want to learn Vietnamese.", es:"Quiero aprender vietnamita."},
  {id:"d018", lv:"A2", vi:"Làm ơn nói chậm hơn.", en:"Please speak more slowly.", es:"Por favor, habla más despacio."},
  {id:"d019", lv:"A2", vi:"Tôi cần đi ra sân bay.", en:"I need to go to the airport.", es:"Necesito ir al aeropuerto."},
  {id:"d020", lv:"A2", vi:"Nhà hàng này ở đâu?", en:"Where is this restaurant?", es:"¿Dónde está este restaurante?"},
  {id:"d021", lv:"A2", vi:"Tôi thích đi biển.", en:"I like going to the sea.", es:"Me gusta ir al mar."},
  {id:"d022", lv:"A2", vi:"Bây giờ là mấy giờ?", en:"What time is it now?", es:"¿Qué hora es ahora?"},
  {id:"d023", lv:"A2", vi:"Tôi có thể trả bằng thẻ không?", en:"Can I pay by card?", es:"¿Puedo pagar con tarjeta?"},
  {id:"d024", lv:"A2", vi:"Ngày mai tôi đi làm.", en:"Tomorrow I go to work.", es:"Mañana voy a trabajar."},
  {id:"d025", lv:"A2", vi:"Gia đình tôi có bốn người.", en:"My family has four people.", es:"Mi familia tiene cuatro personas."},
  {id:"d026", lv:"A2", vi:"Cái này đắt quá.", en:"This is too expensive.", es:"Esto es demasiado caro."},
  {id:"d027", lv:"A2", vi:"Bạn có nói tiếng Anh không?", en:"Do you speak English?", es:"¿Hablas inglés?"},
  {id:"d028", lv:"A2", vi:"Tôi hơi mệt hôm nay.", en:"I'm a little tired today.", es:"Estoy un poco cansada hoy."},
  {id:"d029", lv:"A2", vi:"Bạn gợi ý món gì?", en:"What dish do you suggest?", es:"¿Qué plato me sugieres?"},
  {id:"d030", lv:"A2", vi:"Rất vui được nói chuyện với bạn.", en:"Nice talking with you.", es:"Encantada de hablar contigo."}
];
const DRILL_BY_ID = Object.fromEntries(DRILLS.map(d => [d.id, d]));
