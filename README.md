# 💖 Un Espacio Solo Para Ti — Regalo de Cumpleaños para Babu

> Un rincón interactivo, íntimo y lleno de amor, diseñado como homenaje y regalo de cumpleaños para la mujer más especial de mi vida.

🌐 **Sitio Web en Vivo (GitHub Pages):** [https://itsotocadiz.github.io/regalo-cumple/](https://itsotocadiz.github.io/regalo-cumple/)

---

## 🌟 Características de la Experiencia

### 1. 🔒 Pantalla de Bloqueo Interactiva y Apertura de Sobre 3D
- **Seguridad personalizada:** Para desbloquear la experiencia, se requiere ingresar la clave secreta `romeo` en honor al ángel protector de cuatro patitas.
- **Indicador reactivo de huellitas:** 5 huellitas luminosas (`🐾`) que se encienden una a una con resplandor (`scale(1.2)` y `drop-shadow`) al ritmo de la escritura.
- **Feedback háptico y visual:** Animación `@keyframes shake` y resplandor de advertencia si la clave es incorrecta.
- **Apertura de sobre 3D:** Al acertar la clave, la pantalla de bloqueo se pliega hacia arriba en perspectiva 3D (`transform: translateY(-100%) rotateX(15deg)`) y dispara una doble ráfaga de confeti con corazones y estrellas doradas.

### 2. 🐾 Estela de Cursor Interactiva y Cielo Estrellado
- **Estela mágica:** Al mover el mouse o deslizar en pantallas táctiles, se genera una suave estela flotante de huellitas (`🐾`), corazones (`💕`) y destellos (`✨`) throttled a 60ms con desvanecimiento natural.
- **Cielo estrellado de fondo:** Capa fija con decenas de estrellas y luciérnagas parpadeantes (`@keyframes twinkle`).
- **Tributo a Romeo:** En la esquina superior descansa una estrella dorada brillante con un aura pulsante; al pasar el cursor o tocarla, revela el mensaje con amor: *"✨ Romeo cuidándote desde las estrellas"*, acompañado de un tintineo sutil y estrellas doradas.

### 3. ⏳ Contadores de Amor y Segundero en Tiempo Real
- **Conteo progresivo con `easeOutQuart`:** Días de amor, sonrisas compartidas y nuevos deseos se animan desde `0` hasta su cifra calculada mediante `IntersectionObserver` y `requestAnimationFrame`.
- **Reloj en tiempo real:** Subcontador que calcula y actualiza segundo a segundo (`setInterval` cada `1000ms`) los días, horas, minutos y segundos exactos transcurridos desde el **5 de marzo de 2022**.
- **Latido a 60 BPM:** Íconos de corazón animados con `@keyframes heartbeat` en perfecta cadencia de 60 pulsaciones por minuto.
- **Badge de cumpleaños:** Si se abre el **27 de noviembre**, se activa un mensaje conmemorativo animado de felicitación.

### 4. 📸 Galería Polaroid 3D con Inclinación Holográfica (Tilt & Glare)
- **Giro 3D auténtico:** Al tocar cualquier fotografía, la tarjeta gira 180° (`rotateY(180deg) scale(1.03)`) para revelar una dedicatoria secreta en rima y su firma original (Nalita, Babu, Romeo, Talito, Julieta).
- **Holographic Tilt & Specular Glare:** Al pasar el cursor por encima, la tarjeta responde a la posición del mouse inclinándose entre `-10°` y `+10°` con un reflejo radial que simula brillo holográfico.
- **Entrada escalonada:** Las 6 fotos aterrizan en la página de forma progresiva con un intervalo de `120ms` y un micro-balanceo realista en la cinta washi-tape.
- **Levitación en móviles:** En pantallas táctiles (`@media (hover: none)`), las Polaroids flotan suavemente invitando al usuario a tocarlas.

### 5. 💌 Carta de Amor con Máquina de Escribir en Vivo
- **Efecto máquina de escribir:** Al desplazarse hacia la carta, el texto se escribe en tiempo real carácter por carácter con un cursor titilante `|`.
- **Sonido mecánico en Web Audio API:** Síntesis sonora procedural en cada pulsación sin necesidad de cargar archivos externos pesados.
- **Botón de revelado instantáneo:** Opción discreta *"Mostrar carta completa ✨"* para desplegar todo el contenido al instante.
- **Rúbrica decorativa animada:** Una vez completada la carta, se dibuja un trazo SVG suave bajo la firma de Talo usando `stroke-dasharray` y `stroke-dashoffset`.

### 6. 🎵 Reproductor Flotante de Disco de Vinilo y Abrazo Virtual
- **Minidisco de vinilo:** Diseño con surcos concéntricos que gira de manera continua mientras la música está activa y se detiene suavemente al pausar.
- **Ecualizador visual:** 4 barras animadas al compás de la reproducción.
- **Audio dual:** 
  1. Canción principal: *"Perros y Gatos"* de Macha y el Bloque Depresivo (`./musica/Perros y Gatos - Macha y el Bloque Depresivo.mp3`).
  2. Respaldo: Sintetizador Lofi en Web Audio API en caso de restricciones de autoplay o falta de conexión.
- **Botón de Abrazo Virtual:** Emite una onda expansiva física (ripple effect), confeti y una explosión tridimensional de 12 a 18 corazones y huellitas con trayectorias parabólicas.

---

## 🛠️ Tecnologías Empleadas

- **HTML5 Semántico & CSS 3D Transforms** (`preserve-3d`, `perspective`, `backface-visibility`).
- **Tailwind CSS CDN** con paleta de colores personalizada (`rosewood`, `blush`, `champagne`, `velvet`).
- **Google Fonts** (`Special Elite`, `Caveat`, `Playfair Display`, `Plus Jakarta Sans`, `Courier Prime`).
- **Web Audio API** para sonidos mecánicos procedimentales, campanas armónicas y sintetizador Lofi de respaldo.
- **Canvas Confetti** para celebraciones y destellos visuales.
- **Vanilla JavaScript puro** sin dependencias pesadas para máximo rendimiento a 60 FPS.

---

## 📂 Estructura del Repositorio

```
regalo-cumple/
├── .nojekyll              # Configuración para GitHub Pages
├── README.md              # Documentación del proyecto
├── index.html             # Aplicación interactiva principal
├── assets/
│   └── perrito-cursor.png # Cursor personalizado de perrito
├── fotos/
│   ├── foto1.jpg          # Tu arcoíris (Nalita)
│   ├── foto2.jpg          # Sonrisa que contagia (Babu)
│   ├── foto3.jpg          # Tu eterno chetito (Romeo)
│   ├── foto4.jpg          # Nuestros momentos (Talito)
│   ├── foto5.jpg          # Un amor diferente (Julieta)
│   └── foto6.jpg          # Nobleza de tu alma (Babu)
└── musica/
    └── Perros y Gatos - Macha y el Bloque Depresivo.mp3
```

---

Hecho con infinito amor por **Talo** para **Babu**, con la compañía eterna de **Romeo 🐾**, **Nala 🐾** y **Julieta 🐾**.
