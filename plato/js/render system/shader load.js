export async function fetchResource(resURL) {
    try {
        const responce = await fetch(resURL);
        const text = await responce.text();
        return text;
    } catch (error) {
        alert('Error fetching "' + resURL + '"resource, Error: ' + error);
    }
}

function loadShader(gl, type, source) {
    console.log("Loading shader: " + type + " source: " + source);
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Failed shader load!\n" + gl.getShaderInfoLog(shader));
        console.error(gl.getShaderInfoLog(shader));
    }

    return shader;
}
export async function createProgram(render, gl, canvasId, vsUrl, fsUrl) {
    let vsPrm = fetchResource(vsUrl);
    let fsPrm = fetchResource(fsUrl);

    Promise.all([vsPrm, fsPrm])
        .then((res) => {
            let vs = res[0];
            let fs = res[1];

            const vsShd = loadShader(gl, gl.VERTEX_SHADER, vs);
            const fsShd = loadShader(gl, gl.FRAGMENT_SHADER, fs);
            const prog = gl.createProgram();

            console.log(vs);
            console.log(fs);

            gl.attachShader(prog, vsShd);
            gl.attachShader(prog, fsShd);
            gl.linkProgram(prog);

            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
                alert(
                    "Failed shader prog link!\n" + gl.getProgramInfoLog(prog)
                );
            }

            render.prog = prog;
            const event = new Event("Shader program loaded" + canvasId);
            window.dispatchEvent(event);
            console.log("Event dispatched");
        })
        .catch((err) => {
            alert("Failed creating program!" + err);
        });
}
