import { vec3 } from "../math/vec3.js";
import { mat4 } from "../math/mat4.js";
import { camera } from "../math/camera.js";
import { Prim } from "./prim.js";
import * as res from "./shader load.js";
import * as tm from "./timer.js";
export { vec3, mat4 };

export class Render {
    constructor(canvasId, type) {
        this.canvas = document.getElementById(canvasId);
        this.canvasId = canvasId;
        /** @type {WebGLRenderingContext} */
        this.gl = this.canvas.getContext("webgl2");

        // todo set camera params
        this.camera = camera();

        this.prog = undefined;
        res.createProgram(
            this,
            this.gl,
            canvasId,
            "./shaders/vert.glsl",
            "./shaders/frag.glsl"
        );

        this.loaded = false;
        window.addEventListener("Shader program loaded" + canvasId, () => {
            console.log("Program created! Program:" + this.prog);

            if (type === "cube") {
                this.loadCube();
            }
            if (type === "obj") {
                this.loadObj("resources/cow.obj");
            }
        });

        window.addEventListener("Model loaded" + canvasId, () => {
            console.log("Model created!");
            this.loaded = true;
        });

        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.FRONT);
        this.gl.enable(this.gl.DEPTH_TEST);

        this.timer = new tm.Timer();
    }

    loadCube() {
        this.posLoc = this.gl.getAttribLocation(this.prog, "in_pos");
        this.posBuf = this.gl.createBuffer();

        // Cube positions.
        let sqrt22 = Math.sqrt(2) / 2;
        const cubeVertexPositions = new Float32Array([
            -sqrt22,
            -sqrt22,
            sqrt22, //0
            sqrt22,
            -sqrt22,
            sqrt22, //1
            -sqrt22,
            sqrt22,
            sqrt22, //2
            sqrt22,
            sqrt22,
            sqrt22, //3
            -sqrt22,
            -sqrt22,
            -sqrt22, //4
            sqrt22,
            -sqrt22,
            -sqrt22, //5
            -sqrt22,
            sqrt22,
            -sqrt22, //6
            sqrt22,
            sqrt22,
            -sqrt22, //7
        ]);
        const cubeVertexIndices = new Uint16Array([
            //Top
            7, 6, 2, 2, 3, 7,
            //Bottom
            0, 4, 5, 5, 1, 0,
            //Left
            0, 2, 6, 6, 4, 0,
            //Right
            7, 3, 1, 1, 5, 7,
            //Front
            3, 2, 0, 0, 1, 3,
            //Back
            4, 6, 7, 7, 5, 4,
        ]);

        this.pr = new Prim(
            this.gl,
            this.prog,
            0.3,
            cubeVertexPositions,
            8,
            cubeVertexIndices,
            36,
            this.gl.TRIANGLE_STRIP,
            [-1]
        );

        const event = new Event("Model loaded" + this.canvasId);
        window.dispatchEvent(event);
    }

    loadObj(modelURL) {
        this.loadPr = new Prim();
        res.fetchResource(modelURL).then((res) => {
            this.pr = this.loadPr.loadFromText(this.gl, this.prog, res);
            const event = new Event("Model loaded" + this.canvasId);
            window.dispatchEvent(event);
        });
    }

    start() {
        const draw = () => {
            if (!this.loaded) {
                window.requestAnimationFrame(draw);
                return;
            }
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.gl.useProgram(this.prog);

            this.pr.draw(this.gl, this.prog, this.camera);

            this.timer.response("fps window");

            window.requestAnimationFrame(draw);
        };
        draw();
    }

    close() {}
}
