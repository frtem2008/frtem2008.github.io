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
        window.camera = new Camera();

        this.prog = undefined;
        res.createProgram(
            this,
            gl,
            "./shaders/vert.glsl",
            "./shaders/frag.glsl"
        );

        this.loaded = false;
        window.addEventListener("Shader program loaded", () => {
            console.log("Program created! Program:" + this.prog);

            this.posLoc = gl.getAttribLocation(this.prog, "in_pos");
            this.posBuf = gl.createBuffer();

            gl.enable(gl.DEPTH_TEST);
            window.prog = this.prog;

            const pos = [
                -1, 1, 0, 1, /**/ 1, 1, 1, 1, /**/ -1, -1, 0, 1, /* */ -1, -1,
                0, 1, /**/ 1, 1, 1, 1, /**/ 1, -1, 0, 1,
            ];
            const cubeVertexPositions = new Float32Array([
                -1,
                -1,
                1, //0
                1,
                -1,
                1, //1
                -1,
                1,
                1, //2
                1,
                1,
                1, //3
                -1,
                -1,
                -1, //4
                1,
                -1,
                -1, //5
                -1,
                1,
                -1, //6
                1,
                1,
                -1, //7
            ]);
            const cubeVertexIndices = new Uint16Array([
                //Top
                2, 6, 7, 2, 3, 7,

                //Bottom
                0, 4, 5, 0, 1, 5,

                //Left
                0, 2, 6, 0, 4, 6,

                //Right
                1, 3, 7, 1, 5, 7,

                //Front
                0, 2, 3, 0, 1, 3,

                //Back
                4, 6, 7, 4, 5, 7,
            ]);

            this.pr = new Prim(
                cubeVertexPositions,
                8,
                cubeVertexIndices,
                36,
                gl.TRIANGLE_STRIP,
                [-1]
            );
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
