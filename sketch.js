// --- VARIABLES GLOBALES ---
let colorPicker;
let brushSize;
let savedDoodles = []; // Array donde se almacena temporalmente imágenes base64
let isErasing = false; // Bandera (booleana) para saber el estado de la herramienta borrador

/* 
  FUNCIÓN SETUP de p5.js
  Se ejecuta automáticamente una sola vez al cargar la página.
  Aquí se configura el lienzo y todos los eventos (clicks) de los botones.
*/
function setup(){
    // 1. Inicializa el Canvas de p5.js
    let canvas = createCanvas(600, 400);
    canvas.parent('lienzo-container'); // Indica a p5.js dónde inyectar el <canvas> en el HTML
    background(250); // Color de fondo inicial (gris muy clarito)

    // 2. Conecta variables JS con elementos HTML
    colorPicker = document.getElementById('colorPicker');
    brushSize = document.getElementById('brushSize');

    // 3. Lógica del Borrador
    let eraserBtn = document.getElementById('eraserBtn');
    eraserBtn.addEventListener('click', () => {
        isErasing = !isErasing; // Alterna entre true y false en cada clic
        if (isErasing){
            eraserBtn.classList.add('active-tool'); // Da feedback visual de que está "hundido"
        } else {
            eraserBtn.classList.remove('active-tool');
        }
    });

    // 4. Lógica de Limpiar
    let clearBtn = document.getElementById('clearBtn');
    clearBtn.addEventListener('click', () => {
        background(250); // En p5.js, limpiar es simplemente volver a pintar todo el fondo encima del dibujo
    });

    // 5. CARGA DE DATOS (Local Storage)
    // Lee el disco del navegador a ver si hay dibujos viejos
    let storedDoodles = localStorage.getItem('misDoodles');
    if (storedDoodles) {
        // localStorage solo guarda texto (strings). 
        // JSON.parse() convierte ese texto de vuelta a un Array de Javascript real.
        savedDoodles = JSON.parse(storedDoodles);
        renderGallery(); // Si había dibujos, llama a la función para mostrarlos
    }

    // 6. NAVEGACIÓN (SPA: Single Page Application)
    let galleryView = document.getElementById('gallery-view');
    let studioView = document.getElementById('studio-view');

    // Al hacer clic en "Crear Nuevo": oculta la galería, muestra el estudio y limpia el lienzo
    document.getElementById('newDoodleBtn').addEventListener('click', () => {
        galleryView.classList.add('hidden');
        studioView.classList.remove('hidden');
        background(250); 
    });

    // Al hacer clic en "Volver": oculta el estudio, muestra la galería
    document.getElementById('backBtn').addEventListener('click', () => {
        studioView.classList.add('hidden');
        galleryView.classList.remove('hidden');
    });

    // 7. LÓGICA DE GUARDAR UN DIBUJO
    let saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', () => {
        // Obtiene el elemento HTML <canvas> nativo
        let canvasHTML = document.querySelector('canvas');
        // toDataURL() lee los píxeles actuales y los convierte a un string en formato Base64 (texto que representa una imagen)
        let dataURL = canvasHTML.toDataURL(); 
        
        // Añade esta imagen al array
        savedDoodles.push(dataURL);
        
        // Guarda el array actualizado en localStorage. 
        // localStorage no acepta Arrays, por eso se usa JSON.stringify() para convertirlo en texto.
        localStorage.setItem('misDoodles', JSON.stringify(savedDoodles));
        
        // Actualiza la vista de la galería con el nuevo dibujo
        renderGallery();

        // Tras guardar, simula que "cierra" el estudio y vuelve a la galería
        studioView.classList.add('hidden');
        galleryView.classList.remove('hidden');
    });

    // 8. LÓGICA PARA CERRAR EL MODAL DE IMAGEN
    let modal = document.getElementById('imageModal');
    // Cerrar al hacer clic en la "X"
    document.getElementById('closeModal').addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Cerrar al hacer clic en el fondo oscuro fuera de la foto
    modal.addEventListener('click', (e) => {
        // Si lo que clickea fue exactamente el fondo (id=imageModal) y no la foto
        if (e.target.id === 'imageModal'){
            modal.classList.add('hidden');
        }
    });
}

/* 
  FUNCIÓN DRAW de p5.js
  Se ejecuta en un bucle continuo (normalmente 60 veces por segundo).
  Aquí ocurre la magia del trazo.
*/
function draw(){
    // Solo dibuja si estamos haciendo clic (mouseIsPressed) 
    // Y además verificamos que no este en la galería (el estudio no debe estar hidden)
    if (mouseIsPressed && !document.getElementById('studio-view').classList.contains('hidden')) {
        
        // Lógica de color: Si el borrador está activo, pinta del mismo color del fondo (250)
        // Si no, pinta del color que tenga seleccionado el colorPicker
        if (isErasing) {
            stroke(250);
        } else {
            stroke(colorPicker.value);
        }
        
        strokeWeight(brushSize.value); // Aplica el grosor
        
        // line() dibuja una línea desde donde estaba el mouse el frame anterior (pmouseX/Y)
        // hasta donde está el mouse actualmente (mouseX/Y). Esto crea trazos suaves.
        line(pmouseX, pmouseY, mouseX, mouseY);
    }
}

/*
  FUNCIÓN PARA DIBUJAR LA GALERÍA
  Toma el array 'savedDoodles' y crea elementos HTML por cada imagen.
*/
function renderGallery() {
    let gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Limpia el contenedor por completo para evitar imágenes duplicadas
    
    // Recorre el array. 'imgBase64' es la imagen en texto, 'index' es su posición en el array (0, 1, 2...)
    savedDoodles.forEach((imgBase64, index) => {
        
        // 1. Crea un contenedor div para la foto y su botón de borrar
        let itemDiv = document.createElement('div');
        itemDiv.className = 'gallery-item';

        // 2. Crea la etiqueta <img> y le asigna la imagen
        let imgElement = document.createElement('img');
        imgElement.src = imgBase64;
        
        // 3. Evento para abrir el modal (Agrandar foto)
        imgElement.addEventListener('click', () => {
            let modal = document.getElementById('imageModal');
            let modalImg = document.getElementById('modalImage');
            modalImg.src = imgBase64; // Se le asigna la imagen original al modal
            modal.classList.remove('hidden'); // Muestra el modal
        });

        // 4. Crea el botón de ELIMINAR (la 'X' en la esquina)
        let deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '❌';
        deleteBtn.title = "Borrar doodle";
        
        deleteBtn.addEventListener('click', (e) => {
            //!IMPORTANTE: stopPropagation()
            // Como el botón está "encima" de la imagen, al hacer clic en el botón,
            // el navegador también registra un clic en la imagen, abriendo el modal.
            // Esto detiene el evento para que solo se ejecute el código de borrar.
            e.stopPropagation(); 
            
            // confirm() muestra una alerta nativa del navegador con Ok/Cancelar
            if(confirm('¿Seguro que quieres eliminar este doodle para siempre?')) {
                // splice() elimina elementos de un array: (posición a borrar, cantidad a borrar)
                savedDoodles.splice(index, 1); 
                
                // Sobrescribe el localStorage con el array modificado
                localStorage.setItem('misDoodles', JSON.stringify(savedDoodles)); 
                
                // Vuelve a pintar la galería para reflejar el borrado al instante
                renderGallery(); 
            }
        });

        // 5. Ensambla todo: añade la foto y el botón en el div, y el div a la galería web
        itemDiv.appendChild(imgElement);
        itemDiv.appendChild(deleteBtn);
        gallery.appendChild(itemDiv);
    });
}