// Built-in songs: traditional/public-domain lyrics only (real songs, not AI-written).
// Users add their own popular songs (e.g. Flaca, Hoy, Piso 21) via the app; those are
// stored in localStorage, never here, because their lyrics are copyrighted.
// video: none built in — the user pastes a YouTube link per song and we embed it.
const SONGS = [
  {
    id:"s_pollitos", kind:"folk", lv:"A1",
    title:"Los Pollitos Dicen", artist:"Traditional (children's song)",
    aboutEn:"The most famous children's song in the Spanish-speaking world. Perfect first song: slow, repetitive, easy words.",
    aboutNl:"Het bekendste kinderliedje in de Spaanstalige wereld. Perfect eerste liedje: langzaam, veel herhaling, makkelijke woorden.",
    lines:[
      {es:"Los pollitos dicen pío, pío, pío", en:"The little chicks say cheep, cheep, cheep", nl:"De kuikentjes zeggen piep, piep, piep"},
      {es:"cuando tienen hambre", en:"when they are hungry", nl:"als ze honger hebben"},
      {es:"cuando tienen frío.", en:"when they are cold.", nl:"als ze het koud hebben."},
      {es:"La gallina busca el maíz y el trigo,", en:"The hen looks for corn and wheat,", nl:"De kip zoekt maïs en tarwe,"},
      {es:"les da la comida", en:"she gives them food", nl:"ze geeft ze eten"},
      {es:"y les presta abrigo.", en:"and gives them shelter.", nl:"en geeft ze beschutting."},
      {es:"Bajo sus dos alas, acurrucaditos,", en:"Under her two wings, snuggled up,", nl:"Onder haar twee vleugels, lekker weggekropen,"},
      {es:"duermen los pollitos", en:"the little chicks sleep", nl:"slapen de kuikentjes"},
      {es:"hasta el otro día.", en:"until the next day.", nl:"tot de volgende dag."}
    ]
  },
  {
    id:"s_cielito", kind:"folk", lv:"A2",
    title:"Cielito Lindo", artist:"Traditional (Mexico, 1882)",
    aboutEn:"Mexico's unofficial anthem — the famous '¡Ay, ay, ay, ay, canta y no llores!' Everyone in the stadium sings this one.",
    aboutNl:"Het onofficiële volkslied van Mexico — het beroemde '¡Ay, ay, ay, ay, canta y no llores!' Iedereen zingt dit mee in het stadion.",
    lines:[
      {es:"De la sierra morena,", en:"From the dark mountains,", nl:"Uit de donkere bergen,"},
      {es:"cielito lindo, vienen bajando", en:"pretty darling, come descending", nl:"lief schatje, komen naar beneden"},
      {es:"un par de ojitos negros,", en:"a pair of dark little eyes,", nl:"een paar donkere oogjes,"},
      {es:"cielito lindo, de contrabando.", en:"pretty darling, smuggled in.", nl:"lief schatje, als smokkelwaar."},
      {es:"¡Ay, ay, ay, ay, canta y no llores!", en:"Ay, ay, ay, ay, sing and don't cry!", nl:"Ay, ay, ay, ay, zing en huil niet!"},
      {es:"Porque cantando se alegran,", en:"Because by singing they cheer up,", nl:"Want door te zingen worden ze vrolijk,"},
      {es:"cielito lindo, los corazones.", en:"pretty darling, the hearts.", nl:"lief schatje, de harten."}
    ]
  },
  {
    id:"s_cucaracha", kind:"folk", lv:"A2",
    title:"La Cucaracha", artist:"Traditional (Spain/Mexico)",
    aboutEn:"The classic song about a cockroach that can't walk anymore. Great for rhythm and the word 'porque'.",
    aboutNl:"Het klassieke lied over een kakkerlak die niet meer kan lopen. Goed voor ritme en het woord 'porque'.",
    lines:[
      {es:"La cucaracha, la cucaracha,", en:"The cockroach, the cockroach,", nl:"De kakkerlak, de kakkerlak,"},
      {es:"ya no puede caminar,", en:"can't walk anymore,", nl:"kan niet meer lopen,"},
      {es:"porque no tiene, porque le falta", en:"because it doesn't have, because it lacks", nl:"want hij heeft niet, want hij mist"},
      {es:"las dos patitas de atrás.", en:"its two little back legs.", nl:"zijn twee achterpootjes."}
    ]
  },
  {
    id:"s_mananitas", kind:"folk", lv:"A2",
    title:"Las Mañanitas", artist:"Traditional (Mexican birthday song)",
    aboutEn:"What Spanish speakers sing instead of 'Happy Birthday'. Learn it and surprise someone on their birthday!",
    aboutNl:"Wat Spaanstaligen zingen in plaats van 'Lang zal ze leven'. Leer het en verras iemand op zijn verjaardag!",
    lines:[
      {es:"Estas son las mañanitas", en:"These are the morning songs", nl:"Dit zijn de ochtendliedjes"},
      {es:"que cantaba el rey David.", en:"that King David used to sing.", nl:"die koning David zong."},
      {es:"Hoy por ser día de tu santo,", en:"Today because it's your saint's day,", nl:"Vandaag omdat het jouw feestdag is,"},
      {es:"te las cantamos a ti.", en:"we sing them to you.", nl:"zingen wij ze voor jou."},
      {es:"Despierta, mi bien, despierta,", en:"Wake up, my dear, wake up,", nl:"Word wakker, mijn lief, word wakker,"},
      {es:"mira que ya amaneció.", en:"look, dawn has already come.", nl:"kijk, de dag is al begonnen."},
      {es:"Ya los pajaritos cantan,", en:"The little birds are already singing,", nl:"De vogeltjes zingen al,"},
      {es:"la luna ya se metió.", en:"the moon has already set.", nl:"de maan is al ondergegaan."}
    ]
  },
  {
    id:"s_decolores", kind:"folk", lv:"B1",
    title:"De Colores", artist:"Traditional (Spain)",
    aboutEn:"A joyful old song about the colors of spring. Beautiful vocabulary for nature and colors.",
    aboutNl:"Een vrolijk oud lied over de kleuren van de lente. Prachtige woordenschat voor natuur en kleuren.",
    lines:[
      {es:"De colores, de colores", en:"In colors, in colors", nl:"In kleuren, in kleuren"},
      {es:"se visten los campos en la primavera.", en:"the fields dress themselves in spring.", nl:"kleden de velden zich in de lente."},
      {es:"De colores, de colores", en:"In colors, in colors", nl:"In kleuren, in kleuren"},
      {es:"son los pajaritos que vienen de afuera.", en:"are the little birds that come from outside.", nl:"zijn de vogeltjes die van buiten komen."},
      {es:"De colores, de colores", en:"In colors, in colors", nl:"In kleuren, in kleuren"},
      {es:"es el arco iris que vemos lucir.", en:"is the rainbow we see shining.", nl:"is de regenboog die we zien stralen."},
      {es:"Y por eso los grandes amores", en:"And that's why the great loves", nl:"En daarom bevallen de grote liefdes"},
      {es:"de muchos colores me gustan a mí.", en:"of many colors are the ones I like.", nl:"in vele kleuren mij het best."}
    ]
  }
];
