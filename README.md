# 💖 Un Espacio Solo Para Ti — Regalo de Cumpleaños para Babu

> Un rincón interactivo, íntimo y lleno de amor, diseñado como homenaje y regalo de cumpleaños para la mujer más especial de mi vida.

🌐 **Sitio Web en Vivo (GitHub Pages):** [https://itsotocadiz.github.io/regalo-cumple/](https://itsotocadiz.github.io/regalo-cumple/)

---

## 🌟 Características de la Experiencia

### 1. 🔒 Pantalla de Bloqueo Privada con Validación Criptográfica (`SHA-256`)
- **Seguridad sin texto plano:** La clave secreta en honor al ángel protector de cuatro patitas se valida mediante huella criptográfica `SHA-256` (`Web Crypto API`) con respaldo determinista `FNV-1a`.
- **Indicador reactivo de huellitas:** 5 huellitas vectoriales que se iluminan progresivamente al escribir.
- **Feedback háptico y visual:** Vibración háptica, animación `@keyframes shakeError` y triple ráfaga de confeti al desbloquear.

### 2. ⭐ Estrella Viva de Romeo y Cielo Estrellado Inteligente
- **Órbita celeste continua:** La Estrella de Romeo levita describiendo una trayectoria suave en tiempo real (`requestAnimationFrame`) con halo dorado giratorio y lluvia de polvo estelar.
- **Acorde celestial interactivo:** Al tocar la estrella, sintetiza un acorde armónico en `Web Audio API` y despliega su dedicatoria.
- **Ahorro inteligente de batería (`Page Visibility API`):** El motor gráfico del cielo estrellado y las partículas entran en hibernación automática cuando la pestaña pasa a segundo plano.

### 3. ⏳ Bento Grid de Contadores y Segundero en Tiempo Real
- **Conteo progresivo con `easeOutQuart`:** Días de amor, sonrisas compartidas y nuevos deseos animados al entrar en el viewport mediante `IntersectionObserver`.
- **Reloj en vivo:** Calcula y actualiza segundo a segundo los días, horas, minutos y segundos exactos transcurridos desde el **5 de marzo de 2022**.

### 4. 📸 Galería Polaroid 3D con Inclinación Holográfica y Lightbox con Swipe
- **Giro 3D y Glare:** Tarjetas Polaroid con rotación de 180°, reflejo especular reactivo al puntero y poemas personalizados al reverso (Nalita, Babu, Romeo, Talito y Julieta).
- **Modal Lightbox:** Vista ampliada con navegación por teclado, botones y gestos táctiles (*swipe*).
- **Imágenes HD optimizadas:** Fotografías comprimidas en JPEG progresivo de alta fidelidad (~88% de reducción de peso) con decodificación asíncrona (`decoding="async"`).

### 5. 💌 Carta Mecanografiada y Sorpresa de Video Casero Handycam (3D Pixar Multipose + Sonido del Mar)
- **Máquina de escribir en vivo:** Redacción carácter por carácter con barra de progreso, sonido mecánico procedural y opción de completar lectura al instante.
- **Video Casero Handycam (`16s • 30 FPS`):** Al terminar de leer la carta, se desbloquea el botón sorpresa que abre una escena animada multipose estilo Pixar de **Bárbara, Julieta, Romeo y Nalita en la playa**:
  - Pestañeo 3D natural, cabello mecido por la brisa marina, cambios de postura por personalidad (saludo de patita y postura de juego de Nalita, risa cómplice de Bárbara y Romeo, colita alegre de Julieta) y olas con espuma en la orilla.
  - **Diseño sonoro con olas del mar en estéreo (`🌊 Mar: ON/OFF`):** Síntesis binaural de oleaje costero sincronizado con la escena.
  - **Enfoque interactivo (`AF Lock`):** Al tocar cualquier personaje en el video, la cámara Handycam enfoca dinámicamente esa zona con ondas, partículas y su sonido característico.

### 6. 🎵 Reproductor Flotante de Vinilo y Abrazo Virtual
- **Audio dual:** Reproduce *"Perros y Gatos"* de Macha y el Bloque Depresivo con analizador de frecuencias FFT en tiempo real y sintetizador Lofi automático de respaldo.
- **Abrazo Virtual:** Envía ráfagas de corazones flotantes, confeti y mensajes rotativos de toda la manada.

---

## 📂 Arquitectura Modular del Proyecto

```text
regalo-cumple/
├── .nojekyll                # Configuración para GitHub Pages
├── README.md                # Documentación técnica del proyecto
├── index.html               # Estructura semántica principal
├── tarjeta-imprimir.html    # Tarjeta postal física imprimible con código QR
├── css/
│   └── styles.css           # Sistema de diseño Glassmorphism, animaciones 3D y visor Handycam
├── js/
│   ├── data.js              # Módulo encapsulado de configuración, recuerdos y textos
│   ├── audio.js             # Motor AudioEngine (MP3, Lofi synth, olas del mar en estéreo, efectos)
│   └── app.js               # Controladores de UI, SHA-256 gatekeeper, galería, carta y video
├── assets/
│   ├── caricatura-playa.jpg # Ilustración 3D Pixar de Bárbara y su manada en la playa
│   ├── caricatura-playa.mp4 # Video casero Handycam multipose de 16s con sonido del mar
│   ├── perrito-cursor.png   # Cursor personalizado
│   ├── qr-regalo.png        # Código QR en PNG
│   └── qr-regalo.svg        # Código QR vectorial en SVG
├── fotos/
│   └── foto1.jpg .. foto6.jpg # Fotografías optimizadas en HD progresivo (~1 MB total)
└── musica/
    └── Perros y Gatos - Macha y el Bloque Depresivo.mp3
```

---

Hecho con infinito amor por **Talo** para **Babu**, con la compañía eterna de **Romeo 🐾**, **Nala 🐾** y **Julieta 🐾**.
