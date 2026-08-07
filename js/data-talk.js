// Hands-free speaking drills, graded A1 → B2.
// es = target sentence, en = English meaning/cue. lv = level band.
// A1/A2 show the Spanish (read & repeat); B1/B2 hide it (produce from English).
const DRILLS = [
  // ---------- A1 ----------
  {id:"d001", lv:"A1", es:"Hola, ¿cómo estás?", en:"Hello, how are you?"},
  {id:"d002", lv:"A1", es:"Me llamo Ana.", en:"My name is Ana."},
  {id:"d003", lv:"A1", es:"Soy de Holanda.", en:"I am from Holland."},
  {id:"d004", lv:"A1", es:"Muchas gracias.", en:"Thank you very much."},
  {id:"d005", lv:"A1", es:"¿Dónde está el baño?", en:"Where is the bathroom?"},
  {id:"d006", lv:"A1", es:"Quiero un café, por favor.", en:"I want a coffee, please."},
  {id:"d007", lv:"A1", es:"No entiendo.", en:"I don't understand."},
  {id:"d008", lv:"A1", es:"¿Hablas inglés?", en:"Do you speak English?"},
  {id:"d009", lv:"A1", es:"Hoy hace buen tiempo.", en:"Today the weather is nice."},
  {id:"d010", lv:"A1", es:"Tengo dos hermanos.", en:"I have two brothers."},
  {id:"d011", lv:"A1", es:"Me gusta la música.", en:"I like music."},
  {id:"d012", lv:"A1", es:"¿Qué hora es?", en:"What time is it?"},
  {id:"d013", lv:"A1", es:"La cuenta, por favor.", en:"The bill, please."},
  {id:"d014", lv:"A1", es:"Hasta mañana.", en:"See you tomorrow."},
  {id:"d015", lv:"A1", es:"Estoy cansado hoy.", en:"I am tired today."},

  // ---------- A2 ----------
  {id:"d016", lv:"A2", es:"Ayer fui al mercado.", en:"Yesterday I went to the market."},
  {id:"d017", lv:"A2", es:"Voy a viajar a España.", en:"I am going to travel to Spain."},
  {id:"d018", lv:"A2", es:"¿Puedes ayudarme, por favor?", en:"Can you help me, please?"},
  {id:"d019", lv:"A2", es:"Me gustaría reservar una mesa.", en:"I would like to book a table."},
  {id:"d020", lv:"A2", es:"¿Cuánto cuesta esto?", en:"How much does this cost?"},
  {id:"d021", lv:"A2", es:"No me gusta el pescado.", en:"I don't like fish."},
  {id:"d022", lv:"A2", es:"Necesito ir al médico.", en:"I need to go to the doctor."},
  {id:"d023", lv:"A2", es:"¿A qué hora sale el tren?", en:"What time does the train leave?"},
  {id:"d024", lv:"A2", es:"Mi casa está cerca de la playa.", en:"My house is near the beach."},
  {id:"d025", lv:"A2", es:"Normalmente me levanto a las siete.", en:"I usually get up at seven."},
  {id:"d026", lv:"A2", es:"El fin de semana visito a mi familia.", en:"On the weekend I visit my family."},
  {id:"d027", lv:"A2", es:"¿Puedo pagar con tarjeta?", en:"Can I pay by card?"},
  {id:"d028", lv:"A2", es:"Hace mucho calor en verano.", en:"It's very hot in summer."},
  {id:"d029", lv:"A2", es:"Estoy aprendiendo español.", en:"I am learning Spanish."},
  {id:"d030", lv:"A2", es:"¿Qué me recomiendas?", en:"What do you recommend?"},

  // ---------- B1 ----------
  {id:"d031", lv:"B1", es:"Creo que tienes razón.", en:"I think you are right."},
  {id:"d032", lv:"B1", es:"Cuando era niño, vivía en el campo.", en:"When I was a child, I lived in the countryside."},
  {id:"d033", lv:"B1", es:"Si tengo tiempo, iré al cine.", en:"If I have time, I will go to the cinema."},
  {id:"d034", lv:"B1", es:"Me alegro de que estés aquí.", en:"I'm glad you are here."},
  {id:"d035", lv:"B1", es:"Aunque llueve, quiero salir.", en:"Although it's raining, I want to go out."},
  {id:"d036", lv:"B1", es:"He estado muy ocupado esta semana.", en:"I have been very busy this week."},
  {id:"d037", lv:"B1", es:"Espero que todo salga bien.", en:"I hope everything goes well."},
  {id:"d038", lv:"B1", es:"No estoy seguro de lo que quiero.", en:"I'm not sure what I want."},
  {id:"d039", lv:"B1", es:"Antes de dormir, leo un libro.", en:"Before sleeping, I read a book."},
  {id:"d040", lv:"B1", es:"Me parece que va a llover.", en:"It seems to me it's going to rain."},
  {id:"d041", lv:"B1", es:"Es importante hacer ejercicio.", en:"It's important to exercise."},
  {id:"d042", lv:"B1", es:"Aprender un idioma requiere paciencia.", en:"Learning a language requires patience."},
  {id:"d043", lv:"B1", es:"Prefiero quedarme en casa esta noche.", en:"I prefer to stay home tonight."},
  {id:"d044", lv:"B1", es:"¿Podrías repetir eso más despacio?", en:"Could you repeat that more slowly?"},
  {id:"d045", lv:"B1", es:"Todavía no he terminado el trabajo.", en:"I still haven't finished the work."},

  // ---------- B2 ----------
  {id:"d046", lv:"B2", es:"Si hubiera sabido, habría venido antes.", en:"If I had known, I would have come earlier."},
  {id:"d047", lv:"B2", es:"Aunque esté cansada, terminaré el proyecto.", en:"Even if I'm tired, I'll finish the project."},
  {id:"d048", lv:"B2", es:"Me habría gustado que me lo dijeras.", en:"I would have liked you to tell me."},
  {id:"d049", lv:"B2", es:"No creo que sea una buena idea.", en:"I don't think it's a good idea."},
  {id:"d050", lv:"B2", es:"En cuanto llegue, te llamaré.", en:"As soon as I arrive, I'll call you."},
  {id:"d051", lv:"B2", es:"A pesar de las dificultades, seguimos adelante.", en:"Despite the difficulties, we carry on."},
  {id:"d052", lv:"B2", es:"Lo que más me preocupa es el tiempo.", en:"What worries me most is the time."},
  {id:"d053", lv:"B2", es:"Ojalá pudiera viajar más a menudo.", en:"I wish I could travel more often."},
  {id:"d054", lv:"B2", es:"Por mucho que lo intente, no lo consigo.", en:"No matter how much I try, I can't manage it."},
  {id:"d055", lv:"B2", es:"Deberíamos haber reservado con antelación.", en:"We should have booked in advance."},
  {id:"d056", lv:"B2", es:"Me da la impresión de que algo no va bien.", en:"I get the impression that something is wrong."},
  {id:"d057", lv:"B2", es:"Cuanto más practico, más confianza tengo.", en:"The more I practice, the more confidence I have."},
  {id:"d058", lv:"B2", es:"Si fuera tú, hablaría con ella.", en:"If I were you, I would talk to her."},
  {id:"d059", lv:"B2", es:"No vale la pena preocuparse por eso.", en:"It's not worth worrying about that."},
  {id:"d060", lv:"B2", es:"Espero que hayas disfrutado de tu viaje.", en:"I hope you enjoyed your trip."}
];
const DRILL_BY_ID = Object.fromEntries(DRILLS.map(d => [d.id, d]));
