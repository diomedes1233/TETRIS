const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
context.strokeStyle = "#d30f0e";
context.strokeRect(0, 0, 390, 630);

var velocidad = 50000; //velocidad del juego // The  game speed
var fpi;
var cpi;
var rot; //fila, columna y rotación de la ficha // Row , Column , Rotation
var tablero; //matriz con el tablero // The board  matrix
var tetromino = 0; //tetromino// Tetromino
var record = 0; //almacena la mejor puntuación // It stores the best score
var lineas = 0; //almacena la  puntuación actual // It stores the current score
const botones = document.querySelectorAll("button");
console.log(botones);
var pos = [
    //Valores referencia de coordenadas relativas y forma de cada figura // coordinate reference values and shape of each figure
    [0, 0], //forma las figuras // shape of figure
    [0, 1], //tablero // Board
    [-1, 0],
    [1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [0, -2],
];

var piezas = [
    //Diseño de las piezas, el primer valor de cada fila corresponde con el número de rotaciones posibles hace cada figura // it design the tetrominoes . First number give the possible rotation of the tetromino
    [
        4, 0, 1, 2, 3,
    ] /* t blue 1# possible rotation ,2# only a shape ,3,4,5 # the position   */,
    [4, 0, 1, 5, 6] /* red l*/,
    [4, 0, 1, 5, 4] /*  green l */,
    [2, 0, 1, 5, 7] /*  yellow line*/,
    [2, 0, 2, 5, 6] /* sky blue color z*/,
    [2, 0, 3, 5, 4] /* pink z*/,
    [1, 0, 5, 6, 3] /* gray square*/,
];
// Button function
botones.forEach((boton) => {
    boton.addEventListener("click", () => {
        if (botones[0] === boton) {
            velocidad = 70000;
        } else if (botones[1] === boton) {
            velocidad = 50000;
        } else if (botones[2] === boton) {
            velocidad = 10000;
        } else if (botones[3] === boton) {
            nuevaPartida();
            nuevaPieza(); // muestra la tetromino solo  cuando se da el boton inicio // It shows the tetromino only when the (Inicio) button given
            setTimeout("tick()", 1);
            console.log(boton);
        }
    });
});

//Genera una nueva partida inicializando las variables crea un array de 10 * 16
// It gives new game , initializing the variables creates an array of 10 * 16
function nuevaPartida() {
    tablero = new Array(10);
    for (var n = 0; n < 16; n++) {
        tablero[n] = new Array(10);
        for (var m = 0; m < 10; m++) {
            tablero[n][m] = 0;
        }
    }
    lineas = 0; // actualiza con una nueva partida // Update with a new game
    //nuevaPieza();
    pintar();
    console.log(tablero);
}

//Detecta si una fila columna del tablero está libre para ser ocupada
//Detects if a row or column on the board is free to occupy it
function cuadroNoDisponible(f, c) {
    if (f < 0) return false;
    return c < 0 || c >= 10 || f >= 16 || tablero[f][c] > 0;
}
//Detecta si el tetromino activo choca con el  tablero o con otro tetromino, no permite que dos fichas ocupen el mismo lugar // Detects if the active tetromino collides with the board or with another tetromino, it does not allow two tetromines to occupy the same place.

function colisionaPieza() {
    for (var v = 1; v < 5; v++) {
        var des = piezas[tetromino][v];
        var pos2 = rotarCasilla(pos[des]);
        if (cuadroNoDisponible(pos2[0] + fpi, pos2[1] + cpi)) {
            return true;
        }
    }
    return false;
}
//Detecta si hay lineas completas y si las hay las suma a la variable lineas y borra la linea  actualizando con el valor de la linea de arriba // Detects if there are complete lines and if there are, adds them to the variable lineas and deletes the line updating with the value of the line above
function detectarLineas() {
    // cuenta cuantos cuadros se van rellenando // count how many squares are being filled
    for (var f = 0; f < 16; f++) {
        var contarCuadros = 0;
        for (var c = 0; c < 10; c++) {
            if (tablero[f][c] > 0) {
                contarCuadros++;
            }
        }
        if (contarCuadros == 10) {
            //cuando se completa la linea me actualiza con lo que esta pintado en la linea anterior // It deletes the line updating with the value of the line above
            for (var f2 = f; f2 > 0; f2--) {
                for (var c2 = 0; c2 < 10; c2++) {
                    tablero[f2][c2] = tablero[f2 - 1][c2];
                }
            }
            lineas++;
        }
    }
}
//Baja el tetromino, si toca otro tetromino o el suelo, saca un nuevo tetromino
//Turn down the tetromino, if it touches another tetromino or the ground, take out a new tetromino
function bajarPieza() {
    fpi = fpi + 1;
    if (colisionaPieza()) {
        fpi = fpi - 1;
        for (v = 1; v < 5; v++) {
            des = piezas[tetromino][v];
            var pos2 = rotarCasilla(pos[des]);
            if (
                pos2[0] + fpi >= 0 &&
                pos2[0] + fpi < 16 &&
                pos2[1] + cpi >= 0 &&
                pos2[1] + cpi < 10
            ) {
                tablero[pos2[0] + fpi][pos2[1] + cpi] = tetromino + 1;
            }
        }
        detectarLineas();
        //Si hay algun cuadro en la fila 0 reinicia el juego
        //If there is any box in row 0 restart the game
        var reiniciar = 0;
        for (var c = 0; c < 10; c++) {
            if (tablero[0][c] != 0) {
                reiniciar = 1;
            }
        }
        if (reiniciar == 1) {
            if (lineas > record) {
                record = lineas;
            }
            nuevaPartida();
        } else {
            nuevaPieza();
        }
    }
}
//Mueve la tetromino lateralmente
//Move the tetromino horizontally
function moverPieza(des) {
    cpi = cpi + des;
    if (colisionaPieza()) {
        cpi = cpi - des;
    }
}
//Rota la tetromino según el número de rotaciones posibles tenga el tetromino . (posición 0 del  tetromino)
//Rotate the tetromino according to the number of possible rotations the tetromino has
//posicion = 0
function rotarPieza() {
    rot = rot + 1;
    if (rot == piezas[tetromino][0]) {
        rot = 0;
    }
    if (colisionaPieza()) {
        rot = rot - 1;
        if (rot == -1) {
            rot = piezas[tetromino][0] - 1;
        }
    }
}
//Obtiene unas coordenadas f,c y las rota 90 grados
//Get some row and column coordinates and rotate them 90 degrees
function rotarCasilla(celda) {
    var pos2 = [celda[0], celda[1]];
    for (var n = 0; n < rot; n++) {
        var f = pos2[1];
        var c = -pos2[0];
        pos2[0] = f;
        pos2[1] = c;
    }
    return pos2;
}
//Genera un nueva tetromino aleatoriamente
//Generate a new tetromino randomly
function nuevaPieza() {
    cpi = 5; // inicia en el punto 3 X // Starts at point 3 X
    fpi = 0;
    rot = 0; //Determina rotacion // Give rotation
    tetromino = Math.floor(Math.random() * 7); // genera un numero aleatorio // Give Random number
    console.log(tetromino);
}
//Ejecución principal del juego, realiza la animación y repinta ; perform animation and re-paint
//principal function
function tick() {
    bajarPieza();
    pintar();
    setTimeout("tick()", velocidad / 100);
}
//Pinta el tablero (lo genera con html) y lo plasma en un div toma los array de nueva partida y actualiza el tablero cada vez que se llama tick.
//Paint the board (html) and translate it into a div, take the Nueva partida arrays and update the board each time the tick is called.
function pintar() {
    var lt = " <";
    var des;
    var html = "<table class='tetris'>";
    for (var f = 0; f < 16; f++) {
        html += "<tr>";
        for (var c = 0; c < 10; c++) {
            var color = tablero[f][c];
            if (color == 0) {
                for (v = 1; v < 5; v++) {
                    des = piezas[tetromino][v];
                    var pos2 = rotarCasilla(pos[des]);
                    if (f == fpi + pos2[0] && c == cpi + pos2[1]) {
                        color = tetromino + 1;
                    }
                }
            }
            html += "<td class='celda" + color + "'/>";
        }
        html += lt + "/tr>";
    }
    html += lt + "/table>";
    html += "<br />Lineas : " + lineas;
    html += "<br />Record : " + record;
    document.getElementById("tetris").innerHTML = html;
    velocidad = Math.max(velocidad - 1, 500);
}
//Al iniciar la pagina inicia el juego crea al tablero
// When you start the page, the game starts. Create the board (html)
function eventoCargar() {
    nuevaPartida();
}

//Al pulsar una tecla
//By pressing a key
function tecla(e) {
    var characterCode = e && e.which ? e.which : e.keyCode;
    switch (characterCode) {
        case 37:
            moverPieza(-1);
            break;
        case 38:
            rotarPieza();
            break;
        case 39:
            moverPieza(1);
            break;
        case 40:
            bajarPieza();
            break;
    }
    pintar();
}
