import { vec3 } from "../math/vec3.js";
import { mat4 } from "../math/mat4.js";

export class Prim {
    constructor(gl, prog, scale, V, numOfV, I, numOfI, type, texArray) {
        this.V = V;
        this.vA = 0; // OpenGL vertex array Id
        this.vBufId = 0; // OpenGL vertex buffer Id
        this.iBufId = 0; // OpenGL index buffer Id
        this.numOfElements = 0; // Number of elements
        this.tex = texArray;
        this.type = type;
        this.trans = new mat4(); // Additional transformation matrix
        this.scale = scale;

        if (V != undefined && numOfV != 0) {
            this.vBufId = gl.createBuffer();
            this.vA = gl.createVertexArray();
            const vSize = V.BYTES_PER_ELEMENT;

            gl.bindVertexArray(this.vA);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufId);
            gl.bufferData(
                gl.ARRAY_BUFFER,
                V.length * vSize * 4,
                gl.STATIC_DRAW
            );
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, V);

            const posLoc = gl.getAttribLocation(prog, "in_pos");
            const texLoc = gl.getAttribLocation(prog, "in_tex");
            const normLoc = gl.getAttribLocation(prog, "in_n");
            const colLoc = gl.getAttribLocation(prog, "in_col");

            gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(posLoc);
            console.log(posLoc);
            gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 12);
            gl.enableVertexAttribArray(texLoc);
            console.log(texLoc);
            gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 0, 20);
            gl.enableVertexAttribArray(normLoc);
            console.log(normLoc);
            gl.vertexAttribPointer(colLoc, 4, gl.FLOAT, false, 0, 32);
            gl.enableVertexAttribArray(colLoc);
            console.log(colLoc);
            gl.bindVertexArray(null);
        }

        if (I != undefined && numOfI != 0) {
            this.iBufId = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBufId);
            gl.bufferData(
                gl.ELEMENT_ARRAY_BUFFER,
                I.length * 4,
                gl.STATIC_DRAW
            );
            gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, I);
            this.numOfElements = numOfI;
        } else {
            this.numOfElements = numOfV;
        }
        this.angle = 0;
    }

    loadFromText(gl, prog, objText) {
        console.log("Obj text: " + objText);
        let fileStr = objText.split("\n");
        let V = [],
            Ind = [];

        /* Load primitive data */
        fileStr.forEach((item, index, array) => {
            let arr = item.split(" ");

            if (item[0] == "v" && item[1] == " ") {
                V.push(+arr[1]);
                V.push(+arr[2]);
                V.push(+arr[3]);
            } else if (item[0] == "f" && item[1] == " ") {
                let c0 = 0,
                    c1 = 0,
                    c;

                for (let cnt = 1; cnt <= 3; cnt++) {
                    c = parseInt(arr[cnt]) - 1;
                    if (cnt == 1) {
                        c0 = c;
                    } else if (cnt == 2) {
                        c1 = c;
                    } else {
                        /* Triangle completed */
                        Ind.push(c0);
                        Ind.push(c1);
                        Ind.push(c);
                        c1 = c;
                    }
                }
            }
        });

        return new Prim(
            gl,
            prog,
            0.1,
            new Float32Array(V),
            V.length,
            new Uint16Array(Ind),
            Ind.length,
            gl.TRIANGLE_STRIP,
            [-1]
        );
    }

    draw(gl, prog, camera) {
        let modelViewLoc = gl.getUniformLocation(prog, "ModelViewP");
        camera.setSize(400, 400);
        camera.set(vec3(1, 2, 8), vec3(0, 0, 0), vec3(0, 1, 0));

        let modelView = camera.matrVP
            .rotate((this.angle -= 0.01), vec3(0, 1, 0))
            .scale(this.scale, this.scale, this.scale);

        gl.uniformMatrix4fv(
            modelViewLoc,
            false,
            new Float32Array(modelView.toArray())
        );

        if (this.vBufId != 0) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufId);
        }
        gl.bindVertexArray(this.vA);

        if (this.iBufId != 0) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBufId);
            gl.drawElements(
                gl.TRIANGLES,
                this.numOfElements,
                gl.UNSIGNED_SHORT,
                0
            );
        } else {
            gl.drawArrays(this.type, 0, this.numOfElements);
        }

        for (let i = 0; i < this.tex.length; i++) {
            if (this.tex[i] != -1) {
                gl.activeTexture(gl.TEXTURE0 + i);
                gl.bindTexture(gl.TEXTURE_2D, tex[i]);
            }
        }
    }
}
