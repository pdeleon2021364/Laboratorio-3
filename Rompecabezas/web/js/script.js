let puzzleContainer = document.getElementById("puzzle");
let mensaje = document.getElementById("mensaje");
let timerDisplay = document.getElementById("timer");
let startTime; 
let timerInterval; 

let piezas = [];

for (let fila = 1; fila <= 4; fila++) {
    for (let columna = 1; columna <= 4; columna++) {
        if (fila === 4 && columna === 4) {
            piezas.push("");
        } else {
            piezas.push(`fila-${fila}-columna-${columna}.webp`);
        }
    }
}

let estado = [];
const rutaBaseImagenes = "img/";

function mezclar(array) {
    let copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function dibujar() {
    puzzleContainer.innerHTML = "";
    estado.forEach((valor, i) => {
        let celda = document.createElement("div");
        celda.classList.add("celda");

        if (valor === "") {
            celda.classList.add("vacio");
        } else {
            let imagen = document.createElement("img");
            imagen.src = `${rutaBaseImagenes}${valor}`;
            imagen.alt = `Pieza`; // El 'alt' ya no es tan específico
            celda.appendChild(imagen);
            celda.addEventListener("click", () => mover(i));
        }
        puzzleContainer.appendChild(celda);
    });
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const seconds = Math.floor(elapsedTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function mover(indice) {
    let vacio = estado.indexOf("");
    let filas = 4;
    let col = indice % filas;
    let fila = Math.floor(indice / filas);
    let colVacio = vacio % filas;
    let filaVacio = Math.floor(vacio / filas);

    if ((Math.abs(col - colVacio) === 1 && fila === filaVacio) ||
        (Math.abs(fila - filaVacio) === 1 && col === colVacio)) {
        [estado[indice], estado[vacio]] = [estado[vacio], estado[indice]];
        dibujar();
        verificar();
    }
}

function verificar() {
    const ordenCorrecto = [];
    for (let fila = 1; fila <= 4; fila++) {
        for (let columna = 1; columna <= 4; columna++) {
            if (fila === 4 && columna === 4) {
                ordenCorrecto.push("");
            } else {
                ordenCorrecto.push(`fila-${fila}-columna-${columna}.webp`);
            }
        }
    }
    
    if (JSON.stringify(estado) === JSON.stringify(ordenCorrecto)) {
        mensaje.innerText = "¡Felicidades! Completaste el rompecabezas 🎉";
        stopTimer();
    } 
}

// Reiniciar Juego
function reiniciar() {
    stopTimer();
    estado = mezclar(piezas);
    mensaje.innerText = "";
    timerDisplay.textContent = "00:00"; 
    dibujar();
    startTimer(); 
}

// Iniciar al cargar
reiniciar();