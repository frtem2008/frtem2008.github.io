function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Failed shader load!\n" + gl.getShaderInfoLog(shader));
        console.error(gl.getShaderInfoLog(shader));
    }

    return shader;
}

let loaded = 0;

let posLoc;
let posBuf;
let prog;
/** @type {WebGLRenderingContext} */
let gl;

async function fetchShader(shdURL) {
    try {
        const responce = await fetch(shdURL);
        const text = await responce.text();
        return text;
    } catch (error) {
        alert('Error fetching "' + shdURL + '"shader: ' + error);
    }
}

export function initGL() {
    addInputListeners();

    const canvas = document.getElementById("an2Canvas");
    /** @type {WebGLRenderingContext} */
    gl = canvas.getContext("webgl2");

    let vs, fs;

    let vsPrm = fetchShader("./shaders/vert.glsl");
    let fsPrm = fetchShader("./shaders/frag.glsl");

    Promise.all([vsPrm, fsPrm])
        .then((res) => {
            vs = res[0];
            fs = res[1];

            console.log("Vertex: " + vs);
            console.log("Fragment: " + fs);

            gl.clearColor(0.3, 0.47, 0.8, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
            const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);

            prog = gl.createProgram();

            gl.attachShader(prog, vertexSh);
            gl.attachShader(prog, fragmentSh);
            gl.linkProgram(prog);

            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
                alert(
                    "Failed shader prog link!\n" + gl.getProgramInfoLog(prog)
                );
            }

            posLoc = gl.getAttribLocation(prog, "in_pos");
            posBuf = gl.createBuffer();
            window.requestAnimationFrame(renderScene);
        })
        .catch((err) => {
            alert("Failed fetching shaders!" + err);
        });
}

function centerRect(rect, delta) {
    let width = rect.x1 - rect.x0;
    let height = rect.y1 - rect.y0;

    console.log("Mouse: " + mouse.x + "; " + mouse.y);
    console.log("Delta: " + delta.x + "; " + delta.y);

    let x = mouse.x + delta.x;
    let y = mouse.y + delta.y;

    console.log("New mouse: " + x + "; " + y);
    let res = {
        x0: x - width / 2,
        y0: -y + 1000 - height / 2,
        x1: x + width / 2,
        y1: -y + 1000 + height / 2,
    };

    return res;
}

function scaleRect(rect, factor) {
    let width = rect.x1 - rect.x0;
    let height = rect.y1 - rect.y0;
    let res = {
        x0: rect.x0 + (width / 2) * (factor / 2),
        y0: rect.y0 + (width / 2) * (factor / 2),
        x1: rect.x1 + (height / 2) * (factor / 2),
        y1: rect.y1 + (height / 2) * (factor / 2),
    };

    return res;
}
function addInputListeners() {
    const canvas = document.getElementById("an2Canvas");

    canvas.addEventListener(
        "wheel",
        (e) => {
            e.preventDefault();

            let deltaScale = e.deltaY / 200;
            if (e.ctrlKey) deltaScale *= 50;
            if (e.shiftKey) deltaScale *= 50;

            if (scale > deltaScale) scale -= deltaScale;

            console.log(scale);
            console.log(
                "Rect: " +
                    rect.x0 +
                    ";" +
                    rect.y0 +
                    ";" +
                    rect.x1 +
                    ";" +
                    rect.y1
            );
            console.log(
                "IniRect: " +
                    iniRect.x0 +
                    ";" +
                    iniRect.y0 +
                    ";" +
                    iniRect.x1 +
                    ";" +
                    iniRect.y1
            );
        },
        { passive: false }
    );

    canvas.addEventListener(
        "mousemove",
        (e) => {
            // console.log("(" + e.offsetX + "; " + e.offsetY + ")");
            let delta = {
                x: e.offsetX - mouse.x,
                y: e.offsetY - mouse.y,
            };

            delta.x /= scale;
            delta.y /= scale;

            console.log("Delta on event: " + delta.x + "; " + delta.y);
            rect = centerRect(rect, delta);
            mouse.x += delta.x;
            mouse.y += delta.y;
        },
        { passive: false }
    );

    window.addEventListener(
        "keydown",
        (e) => {
            let deltaScale = 0;
            console.log(e.key);
            if (e.key == "PageUp") {
                deltaScale = 0.2;
            }
            if (e.key == "PageDown") {
                deltaScale = -0.2;
            }
            if (e.ctrlKey) {
                deltaScale *= 50;
            }
            if (e.shiftKey) {
                deltaScale *= 50;
            }
            scale += deltaScale;
        },
        { passive: false }
    );
}

let rect = {
    x0: 0,
    y0: 0,
    x1: 1000,
    y1: 1000,
};

let iniRect = {
    x0: 0,
    y0: 0,
    x1: 1000,
    y1: 1000,
};

let scale = 1;
let mouse = {
    x: 0,
    y: 0,
};

function renderScene() {
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    const pos = [-1, 1, 0, 1, -1, -1, 0, 1, 1, 1, 0, 1, 1, -1, 0, 1];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
    gl.vertexAttribPointer(posLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLoc);

    gl.useProgram(prog);

    const locScale = gl.getUniformLocation(prog, "scale");
    const scaleElement = document.getElementById("scaleSlider");
    gl.uniform1f(locScale, scale);

    const locRect = gl.getUniformLocation(prog, "rect");

    gl.uniform4f(
        locRect,
        rect.x0 / 250,
        rect.y0 / 250,
        rect.x1 / 250,
        rect.y1 / 250
    );

    const locColMod = gl.getUniformLocation(prog, "colorMod");
    const date = new Date();

    gl.uniform3f(locColMod, 0.5, 1, 3);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    window.requestAnimationFrame(renderScene);
}
