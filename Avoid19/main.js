var gl;
var index = 0;

var maxNumTriangles = 200;
var maxNumVertices = 3 * maxNumTriangles;
var canvas;
var enemyPosition = []
var currVirusNum = 0;
var maxVirusNum = 50;
var score;
var interval = 3000;

var colors = [
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(1.0, 1.0, 1.0, 1.0), // white
    vec4(1.0, 1.0, 0.0, 1.0), // yellow
    vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(0.0, 0.0, 1.0, 1.0), // blue
    vec4(1.0, 0.0, 1.0, 1.0), // magenta
    vec4(0.0, 1.0, 1.0, 1.0) // cyan
];

function between(val, min, max) {
    return val >= min && val <= max;
}

function main() {
    canvas = document.getElementById("glCanvas");
    score = document.getElementById("score").innerHTML;
    score = 0;
    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl) {
        alert("WebGL isn't available");
    }

    // Create viewport based on canvas size
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Set defult background color for viewport
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Load vertex-shader
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    canvas.addEventListener("mousedown", function (event) {
        var mousePosX = 2 * (event.clientX - canvas.offsetLeft) / canvas.width - 1;
        var mousePosY = 2 * (canvas.height - event.clientY + canvas.offsetTop) / canvas.height - 1;
        var isHitVirus = false;

        for (let i = 0; i < enemyPosition.length; i++) {
            if (between(mousePosX, enemyPosition[i].x - 0.03, enemyPosition[i].x + 0.03) && between(mousePosY, enemyPosition[i].y - 0.03, enemyPosition[i].y + 0.03)) {
                isHitVirus = true;

                mousePosX = enemyPosition[i].x;
                mousePosY = enemyPosition[i].y;
                enemyPosition.splice(i, 1);
            }
        }

        if (isHitVirus) {

            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            var t = vec2(mousePosX, mousePosY);
            gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t));

            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            t = vec4(vec4(0.0, 0.0, 0.0, 1.0));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(t));


            score += 1;
            document.getElementById("score").innerHTML = score
            isHitVirus = false;
            currVirusNum -= 1;
            index++;
            if (inteval > 50) {
                interval -= 50;
            }
        }

    });

    // Configure Webgl Buffer
    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

    vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    // =========

    // Load Generate Opponents
    generateCovid();

    render();

}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, index);
    window.requestAnimFrame(render);
}

function generateCovid() {

    setInterval(function () {
        if (currVirusNum < maxVirusNum) {
            var randomX = Math.floor(Math.random() * 1000);
            var randomY = Math.floor(Math.random() * 1000);

            var positionX = 2 * Math.floor(randomX % canvas.width) / canvas.width - 1;
            var positionY = 2 * (canvas.height - Math.floor(randomY % canvas.height)) / canvas.height - 1;

            let enemy = {
                x: positionX,
                y: positionY
            }


            enemyPosition.push(enemy)

            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            var t = vec2(positionX, positionY);

            gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t));

            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            t = vec4(colors[(index) % 7]);
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(t));

            index++;
            currVirusNum += 1;
            render();
        }
    }, interval)
}

function hideLastCovid() {
    pass
}

window.onload = main;