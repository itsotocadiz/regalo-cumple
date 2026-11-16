(() => {
  'use strict';

  const CONFIG = Object.freeze({
    // Huella criptográfica SHA-256 + FNV-1a de la clave secreta (sin texto plano en el código)
    passcodeSha256: 'b88b5eb909d1bd5215ce6dd44e64244afad213dc77b77691cc124a4621b30ebc',
    passcodeDigest: '11b0e301',
    fechaInicio: new Date(2022, 2, 5), // 5 de marzo de 2022
    audioSrc: './musica/Perros y Gatos - Macha y el Bloque Depresivo.mp3',
    songTitle: 'Perros y Gatos',
    songArtist: 'Macha y el Bloque Depresivo',
    fallbackTitle: 'Melodía Romántica',
    fallbackArtist: 'Sintetizador Lofi',
    romeoStarMessage: 'Romeo cuidándote desde las estrellas',
    flowVideoSrc: './assets/caricatura-playa.mp4',
    flowPosterSrc: './assets/caricatura-playa.jpg'
  });

  const RECUERDOS = Object.freeze([
    Object.freeze({
      id: 1,
      src: './fotos/foto1.jpg',
      titulo: 'Tu arcoíris',
      nota: 'Un angelito blanco que a tu vida llegó,\nde nuevas energías tu mundo llenó.\nCompañera fiel de juegos y dulzura,\nlista para compartir cada nueva aventura.',
      firma: 'NALITA (*)',
      etiqueta: 'Recuerdo 01'
    }),
    Object.freeze({
      id: 2,
      src: './fotos/foto2.jpg',
      titulo: 'Sonrisa que contagia',
      nota: 'Esa sonrisa hermosa que en tu rostro brilla,\nes la magia viva que todo lo maravilla.\nComo las flores frescas que despiertan en el jardín,\ny el canto matutino de las aves sin fin.',
      firma: 'Babu',
      etiqueta: 'Recuerdo 02'
    }),
    Object.freeze({
      id: 3,
      src: './fotos/foto3.jpg',
      titulo: 'Tu eterno chetito',
      nota: 'Fui tu fiel compañero en cada camino y andar,\ncon un amor tan puro que nunca dejará de brillar.\nRecuerda mis patitas con olor a chetitos de queso,\nque siempre te cuidarán desde el cielo con un beso.',
      firma: 'ROMEO',
      etiqueta: 'Recuerdo 03'
    }),
    Object.freeze({
      id: 4,
      src: './fotos/foto4.jpg',
      titulo: 'Nuestros momentos',
      nota: 'Entre viajes, mochilas y rutas por descubrir,\nlibros, desvelos y metas por cumplir.\nCon pelitos en la ropa y risas sin fin,\nconstruir esta vida a tu lado es mi mejor festín.',
      firma: 'Talito <3',
      etiqueta: 'Recuerdo 04'
    }),
    Object.freeze({
      id: 5,
      src: './fotos/foto5.jpg',
      titulo: 'Un amor diferente',
      nota: 'Llegué a este hogar con mi forma especial de querer,\nun amor tan único que pocos logran entender.\nCon mis pequeñas fijaciones y mi mundo singular,\naquí estoy presente para cuidarte y acompañar.',
      firma: 'JULIETA',
      etiqueta: 'Recuerdo 05'
    }),
    Object.freeze({
      id: 6,
      src: './fotos/foto6.jpg',
      titulo: 'Nobleza de tu alma',
      nota: 'Miras donde pocos ven y sabes escuchar,\nsanando silencios con solo acariciar.\nTu nobleza no pide nada a cambio al entregar,\neres pura empatía y amor sin condición al cuidar.',
      firma: 'Babu (*)',
      etiqueta: 'Recuerdo 06'
    })
  ]);

  const PARRAFOS_CARTA = Object.freeze([
    'Si tuviera que programar en código mi destino,\nelegiría mil veces coincidir en tu camino.\nPorque eres la luz que reinicia cualquier mal día,\nel algoritmo perfecto de mi paz y mi alegría.',
    'Recuerdo el viento en la playa en nuestro último viaje,\ntu risa ganándole al mar y a todo el paisaje.\nEntre mochilas, caminos, desvelos y estudio sin fin,\nhacer equipo contigo es mi mayor festín.\nNo importa la ruta ni cuán lejos vayamos a andar,\nen cualquier coordenada tú siempre serás mi hogar.',
    'A tu lado camina esta hermosa y loca manada:\nNALA, nube blanca de energía renovada,\nun angelito travieso listo para la aventura,\nllenando la casa de juegos, saltos y dulzura.',
    'Y JULIETA, negrita de nobleza y corazón singular,\ncon sus manías y su mundo que solo tú sabes descifrar.\nUn amor diferente, tan presente y leal,\nque encuentra en tus caricias su calma especial.',
    'Y desde una estrella que nunca deja de brillar,\nROMEO, tu eterno chetito, te vuelve a abrazar.\nCon su aroma a quesito y su amor protector,\ncuidando tus pasos con infinito calor.',
    'Hoy celebro tu vida, tu bondad y tu existir,\nel orgullo inmenso de verte crecer y sonreír.\nQue este nuevo año te traiga sueños cumplidos a montones,\nmás playas, más rutas y millones de emociones.',
    '¡Feliz cumpleaños, mi amor!'
  ]);

  const MENSAJES_ABRAZO = Object.freeze([
    'Un abrazo apretado de toda tu manada: Talo, Nala, Julieta y Romeo desde las estrellas.',
    'Siempre contigo en cada ruta, cada desvelo y cada nueva aventura.',
    'Tu nobleza y tu sonrisa iluminan cada rincón de nuestra casa.',
    'Patitas con olor a chetitos cuidando cada uno de tus pasos hoy y siempre.'
  ]);

  window.RegaloApp = Object.assign(window.RegaloApp || {}, {
    CONFIG,
    RECUERDOS,
    PARRAFOS_CARTA,
    MENSAJES_ABRAZO
  });
})();
