import { vec3 } from "../math/mth.js";
import { mat4 } from "../math/mth.js";
import { Camera } from "../math/mth.js";
import { Prim } from "./prim.js";
import * as res from "./shader load.js";
import * as tm from "./timer.js";
export { vec3, mat4 };

export class Render {
    constructor() {
        this.canvas = document.getElementById("canvas");

        /** @type {WebGLRenderingContext} */
        window.gl = this.canvas.getContext("webgl2");

        // todo set camera params
        this.camera = new Camera();
        this.prog = undefined;
        res.createProgram(this, gl, "./shaders/vert.glsl", "./shaders/frag.glsl");

        this.loaded = false;
        window.addEventListener("Shader program loaded", () => {
            console.log("Program created! Program:" + this.prog);

            this.posLoc = gl.getAttribLocation(this.prog, "in_pos");
            this.posBuf = gl.createBuffer();

            gl.enable(gl.DEPTH_TEST);
            window.prog = this.prog;

            const pos = [-1, 1, 0, 1, /**/ 1, 1, 1, 1, /**/ -1, -1, 0, 1, /* */ -1, -1, 0, 1, /**/ 1, 1, 1, 1, /**/ 1, -1, 0, 1];

            this.pr = new Prim(new Float32Array(pos), 6, 0, 0, gl.TRIANGLE_STRIP, [-1]);

            this.loaded = true;
        });

        this.timer = new tm.Timer();
    }

    start() {
        const draw = () => {
            if (!this.loaded) {
                window.requestAnimationFrame(draw);
                return;
            }
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.DEPTH_TEST);

            // gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuf);
            // const pos = [-1, 1, 0, 1, /**/ 1, 1, 1, 1, /**/ -1, -1, 0, 1, /* */ -1, -1, 0, 1, /**/ 1, 1, 1, 1, /**/ 1, -1, 0, 1];

            // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
            // gl.vertexAttribPointer(this.posLoc, 4, gl.FLOAT, false, 0, 0);
            // gl.enableVertexAttribArray(this.posLoc);

            // gl.useProgram(this.prog);
            // gl.drawArrays(gl.LINE_STRIP, 0, 6);

            // // gl.useProgram(this.prog);
            gl.useProgram(this.prog);

            this.pr.draw();

            this.timer.response("fps window");

            window.requestAnimationFrame(draw);
        };
        draw();
    }

    close() {}
}
