import Sudoku from "./sudoku.js";
import confetti from 'https://cdn.skypack.dev/canvas-confetti';
const canvas = document.getElementById("sudokuCanvas");
const ctx = canvas.getContext("2d");

let scale = window.devicePixelRatio;
const gridSize = 9; // Tamaño de la cuadrícula de Sudoku
const cellSize = 50; // Tamaño de cada celda (sin escalar)
let highlightedCell = null; // Almacena la celda resaltada
let highlightColor = "rgba(173, 216, 230, 0.5)"; 
let numberHighlightColor = "rgba(128, 128, 128, 0.5)"; 
let animationFrame;
let lives = 3;
let gameOver = false; 
let gameWon = false;

// Inicializa un sudoku jugable como matriz 9x9.
let currentSudoku = new Sudoku();
currentSudoku.createPlayable();

// Crea la solución antes de pasar el sudoku original a matriz.
let solution = new Sudoku();
solution.content = [...currentSudoku.content];
solution.createRecursive(false);

// convierte ambos sudokus a matriz.
solution.convertToMatrix();
currentSudoku.convertToMatrix();


// Función para redimensionar el canvas basado en el zoom
function resizeCanvas() {
    scale = window.devicePixelRatio; // Obtener el ratio de píxeles actual

    // Ajustar el tamaño físico del canvas multiplicando por la escala
    canvas.width = cellSize * gridSize * scale;
    canvas.height = cellSize * gridSize * scale;

    // Mantener el tamaño visual del canvas en el DOM
    canvas.style.width = `${cellSize * gridSize}px`;
    canvas.style.height = `${cellSize * gridSize}px`;

    // Escalar el contexto de dibujo
    ctx.setTransform(scale, 0, 0, scale, 0, 0); // Esta línea reemplaza `ctx.scale`, evitando problemas con escalados acumulativos.

    if (gameOver) {
        showDefeatScreen();
        return;
    }

    if (gameWon) {
        showVictoryScreen(false);
        return;
    }

    // Redibujar el tablero y los números con las nuevas dimensiones
    drawGrid();
    drawNumbers(highlightedCell ? highlightedCell.number : null);
    if (highlightedCell) {
        drawHighlight(); // Redibuja el resaltado si hay una celda seleccionada
    }
}

// Dibuja la cuadrícula de Sudoku
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Asegúrate de limpiar el canvas antes de dibujar

    for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, gridSize * cellSize); // El alto es gridSize * cellSize
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(gridSize * cellSize, i * cellSize); // El ancho es gridSize * cellSize
        
        // Grosor de las líneas para las subcuadrículas
        ctx.lineWidth = (i % 3 === 0) ? 3 : 1; // Líneas más gruesas para bordes de subcuadrículas
        ctx.strokeStyle = "#000";
        ctx.stroke();
    }
}

// Dibuja los números en la cuadrícula
function drawNumbers(highlightedValue = null) {
    ctx.font = "30px Arial"; // Define la fuente y el tamaño
    ctx.textAlign = "center"; // Alineación centrada
    ctx.textBaseline = "middle"; // Alineación vertical centrada

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const number = currentSudoku.content[row][col];
            const x = col * cellSize + cellSize / 2; // Calcula la posición X
            const y = row * cellSize + cellSize / 2; // Calcula la posición Y

            if (highlightedValue !== null && number === highlightedValue) {
                ctx.fillStyle = numberHighlightColor; // Cambia el color a gris semitransparente
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize); // Resalta la celda
            }

            if (number !== 0) { // Solo dibuja si el número es distinto de 0
                ctx.fillStyle = "#000"; // Color del texto
                ctx.fillText(number, x, y); // Dibuja el número
            }
        }
    }
}

// Dibuja el resaltado en la celda seleccionada con animación
function drawHighlight() {
    if (highlightedCell) {
        animateHighlight(highlightedCell.row, highlightedCell.col); // Llama a la función de animación
    }
}

// Animación de resaltado
function animateHighlight(row, col) {
    let alpha = 0; // Inicializa el valor alfa

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
        drawGrid();

        // Dibuja los números resaltando si es necesario
        drawNumbers(highlightedCell.number);

        // Cambia el color de fondo de la celda resaltada
        ctx.fillStyle = `rgba(173, 216, 230, ${alpha})`; // Color de resaltado
        ctx.fillRect(
            col * cellSize,
            row * cellSize,
            cellSize,
            cellSize
        );

        if (alpha < 0.25) {
            alpha += 0.05; // Incrementa el valor alfa
            animationFrame = requestAnimationFrame(animate); // Pide un nuevo frame de animación
        } else {
            ctx.fillStyle = highlightColor; // Establece el color final
            ctx.fillRect(
                col * cellSize,
                row * cellSize,
                cellSize,
                cellSize
            );
        }
    }

    // Detiene cualquier animación anterior
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }

    animate(); // Inicia la animación
}

// Maneja el clic en el canvas
canvas.addEventListener("click", (event) => {
    if  (gameOver || gameWon) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width; // Escala en X
    const scaleY = canvas.height / rect.height; // Escala en Y

    const x = (event.clientX - rect.left) * scaleX; // Coordenada X del clic ajustada
    const y = (event.clientY - rect.top) * scaleY;  // Coordenada Y del clic ajustada

    // Calcula la celda seleccionada
    const col = Math.floor(x / (cellSize * scale));
    const row = Math.floor(y / (cellSize * scale));

    // Verifica si row y col están dentro de los límites de la matriz
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        // Verifica si la celda está vacía
        if (currentSudoku.content[row][col] === 0) {
            highlightedCell = { row, col }; // Almacena la celda resaltada
            highlightedCell.number = null; // No hay número resaltado
        } else {
            highlightedCell = { row, col, number: currentSudoku.content[row][col] }; // Almacena la celda resaltada y su número
        }

        // Redibuja el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
        drawGrid();
        drawNumbers(highlightedCell.number); // Dibuja los números resaltados si corresponde
        if (highlightedCell.number == null) {
            drawHighlight(); // Dibuja el resaltado
        }
    }
});

// Maneja la entrada de números por teclado
window.addEventListener("keydown", (event) => {
    const number = parseInt(event.key, 10); // Convierte la tecla presionada a número
    if (!isNaN(number) && number >= 1 && number <= 9) {
        placeNumber(number); // Llama a placeNumber con el número si es válido
    }
});

function placeNumber(number) {
    if (highlightedCell) {
        const { row, col } = highlightedCell;
        if (currentSudoku.content[row][col] !== 0) {
            highlightedCell = null;
            return
        }
        if (solution.content[row][col] === number) {
            currentSudoku.content[row][col] = number;
            highlightedCell = null;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
            drawNumbers(number); // Resaltar los números iguales al que acabas de poner
            
            // Comprobar si el Sudoku está completo
            if (currentSudoku.isComplete_Matrix()) {
                showVictoryScreen(); // Muestra la pantalla de victoria
            }
        } 
        else {
            lives--;
            if (lives === 0) {
                showDefeatScreen()
            }
            if (lives >= 0) {
                drawLives()
            }
        }
    } 
}

function drawLives() {
    const livesElement = document.getElementById("lives");
    livesElement.textContent = `${lives}`;
    const livesCounter = document.getElementById("lives-counter")
    livesCounter.classList.add('shake');

    setTimeout(() => {
        livesCounter.classList.remove('shake');
      }, 500);
    
}


window.placeNumber = placeNumber


function showVictoryScreen(show_confetti = true) {
    gameWon = true; // Establece el estado de victoria
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#000";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Corrige la posición centrada del texto
    const centerX = (canvas.width / scale) / 2;
    const centerY = (canvas.height / scale) / 2;

    ctx.fillText("¡Victoria!", centerX, centerY);
    if (show_confetti) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

function showDefeatScreen() {
    gameOver = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Corrige la posición centrada del texto
    const centerX = (canvas.width / scale) / 2;
    const centerY = (canvas.height / scale) / 2;

    ctx.fillText("Has perdido...", centerX, centerY);
}



// Llama a las funciones para dibujar la cuadrícula y los números
resizeCanvas(); // Redimensiona y ajusta el canvas desde el principio

// Detectar el cambio de tamaño de la ventana (incluyendo cambios de zoom)
window.addEventListener("resize", resizeCanvas);