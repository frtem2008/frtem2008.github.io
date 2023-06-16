import { vec3 } from "./vec3.js";
export { vec3 };

class _mat4 {
    addMethod(obj, name, func) {
        var old = obj[name];
        obj[name] = (...args) => {
            if (func.length == args.length) return func.apply(obj, args);
            else if (typeof old == "function") return old.apply(obj, args);
        };
    } // End of 'addMethod' function

    constructor(m = null) {
        if (m == null)
            this.m = [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1],
            ];
        else if (typeof m == "object" && m.length == 4) this.m = m;
        else this.m = m.m;

        // Translate
        this.addMethod(this, "setTranslate", (dx, dy, dz) => {
            this.m = [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [dx, dy, dz, 1],
            ];
            return this;
        });
        this.addMethod(this, "setTranslate", (v) => {
            return this.setTranslate(v.x, v.y, v.z);
        });
        this.addMethod(this, "translate", (dx, dy, dz) => {
            this.mul([
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [dx, dy, dz, 1],
            ]);
            return this;
        });
        this.addMethod(this, "translate", (v) => {
            return this.translate(v.x, v.y, v.z);
        });
        // Scale
        this.addMethod(this, "setScale", (sx, sy, sz) => {
            this.m = [
                [sx, 0, 0, 0],
                [0, sy, 0, 0],
                [0, 0, sz, 0],
                [0, 0, 0, 1],
            ];
            return this;
        });
        this.addMethod(this, "setScale", (v) => {
            if (typeof v == "object") return this.setScale(v.x, v.y, v.z);
            return this.setScale(v, v, v);
        });
        this.addMethod(this, "scale", (sx, sy, sz) => {
            this.mul([
                [sx, 0, 0, 0],
                [0, sy, 0, 0],
                [0, 0, sz, 0],
                [0, 0, 0, 1],
            ]);
            return this;
        });
        this.addMethod(this, "scale", (v) => {
            if (typeof v == "object") return this.scale(v.x, v.y, v.z);
            return this.scale(v, v, v);
        });
    } // End of 'constructor' function

    setRotate(AngleInDegree, R) {
        let a = AngleInDegree * Math.PI,
            sine = Math.sin(a),
            cosine = Math.cos(a);
        let x = 0,
            y = 0,
            z = 1;
        if (typeof R == "object")
            if (R.length == 3) (x = R[0]), (y = R[1]), (z = R[2]);
            else (x = R.x), (y = R.y), (z = R.z);
        // Vector normalize
        let len = x * x + y * y + z * z;
        if (len != 0 && len != 1)
            (len = Math.sqrt(len)), (x /= len), (y /= len), (z /= len);
        this.m[0][0] = cosine + x * x * (1 - cosine);
        this.m[0][1] = x * y * (1 - cosine) + z * sine;
        this.m[0][2] = x * z * (1 - cosine) - y * sine;
        this.m[0][3] = 0;
        this.m[1][0] = y * x * (1 - cosine) - z * sine;
        this.m[1][1] = cosine + y * y * (1 - cosine);
        this.m[1][2] = y * z * (1 - cosine) + x * sine;
        this.m[1][3] = 0;
        this.m[2][0] = z * x * (1 - cosine) + y * sine;
        this.m[2][1] = z * y * (1 - cosine) - x * sine;
        this.m[2][2] = cosine + z * z * (1 - cosine);
        this.m[2][3] = 0;
        this.m[3][0] = 0;
        this.m[3][1] = 0;
        this.m[3][2] = 0;
        this.m[3][3] = 1;
        return this;
    } // End of 'setRotate' function

    rotate(AngleInDegree, R) {
        return this.mul(mat4().setRotate(AngleInDegree, R));
    } // End of 'rotate' function

    transpose() {
        let r = [[], [], [], []];

        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++) r[i][j] = this.m[j][i];
        return mat4(r);
    } // End of 'transpose' function

    mul(m) {
        let matr;
        if (m.length == 4) matr = m;
        else matr = m.m;
        this.m = [
            [
                this.m[0][0] * matr[0][0] +
                    this.m[0][1] * matr[1][0] +
                    this.m[0][2] * matr[2][0] +
                    this.m[0][3] * matr[3][0],
                this.m[0][0] * matr[0][1] +
                    this.m[0][1] * matr[1][1] +
                    this.m[0][2] * matr[2][1] +
                    this.m[0][3] * matr[3][1],
                this.m[0][0] * matr[0][2] +
                    this.m[0][1] * matr[1][2] +
                    this.m[0][2] * matr[2][2] +
                    this.m[0][3] * matr[3][2],
                this.m[0][0] * matr[0][3] +
                    this.m[0][1] * matr[1][3] +
                    this.m[0][2] * matr[2][3] +
                    this.m[0][3] * matr[3][3],
            ],
            [
                this.m[1][0] * matr[0][0] +
                    this.m[1][1] * matr[1][0] +
                    this.m[1][2] * matr[2][0] +
                    this.m[1][3] * matr[3][0],
                this.m[1][0] * matr[0][1] +
                    this.m[1][1] * matr[1][1] +
                    this.m[1][2] * matr[2][1] +
                    this.m[1][3] * matr[3][1],
                this.m[1][0] * matr[0][2] +
                    this.m[1][1] * matr[1][2] +
                    this.m[1][2] * matr[2][2] +
                    this.m[1][3] * matr[3][2],
                this.m[1][0] * matr[0][3] +
                    this.m[1][1] * matr[1][3] +
                    this.m[1][2] * matr[2][3] +
                    this.m[1][3] * matr[3][3],
            ],
            [
                this.m[2][0] * matr[0][0] +
                    this.m[2][1] * matr[1][0] +
                    this.m[2][2] * matr[2][0] +
                    this.m[2][3] * matr[3][0],
                this.m[2][0] * matr[0][1] +
                    this.m[2][1] * matr[1][1] +
                    this.m[2][2] * matr[2][1] +
                    this.m[2][3] * matr[3][1],
                this.m[2][0] * matr[0][2] +
                    this.m[2][1] * matr[1][2] +
                    this.m[2][2] * matr[2][2] +
                    this.m[2][3] * matr[3][2],
                this.m[2][0] * matr[0][3] +
                    this.m[2][1] * matr[1][3] +
                    this.m[2][2] * matr[2][3] +
                    this.m[2][3] * matr[3][3],
            ],
            [
                this.m[3][0] * matr[0][0] +
                    this.m[3][1] * matr[1][0] +
                    this.m[3][2] * matr[2][0] +
                    this.m[3][3] * matr[3][0],
                this.m[3][0] * matr[0][1] +
                    this.m[3][1] * matr[1][1] +
                    this.m[3][2] * matr[2][1] +
                    this.m[3][3] * matr[3][1],
                this.m[3][0] * matr[0][2] +
                    this.m[3][1] * matr[1][2] +
                    this.m[3][2] * matr[2][2] +
                    this.m[3][3] * matr[3][2],
                this.m[3][0] * matr[0][3] +
                    this.m[3][1] * matr[1][3] +
                    this.m[3][2] * matr[2][3] +
                    this.m[3][3] * matr[3][3],
            ],
        ];
        return this;
    } // End of 'mul' function

    determ3x3(A11, A12, A13, A21, A22, A23, A31, A32, A33) {
        return (
            A11 * A22 * A33 -
            A11 * A23 * A32 -
            A12 * A21 * A33 +
            A12 * A23 * A31 +
            A13 * A21 * A32 -
            A13 * A22 * A31
        );
    } // End of 'determ3x3' function

    determ() {
        let det =
            this.m[0][0] *
                this.determ3x3(
                    this.m[1][1],
                    this.m[1][2],
                    this.m[1][3],
                    this.m[2][1],
                    this.m[2][2],
                    this.m[2][3],
                    this.m[3][1],
                    this.m[3][2],
                    this.m[3][3]
                ) -
            this.m[0][1] *
                this.determ3x3(
                    this.m[1][0],
                    this.m[1][2],
                    this.m[1][3],
                    this.m[2][0],
                    this.m[2][2],
                    this.m[2][3],
                    this.m[3][0],
                    this.m[3][2],
                    this.m[3][3]
                ) +
            this.m[0][2] *
                this.determ3x3(
                    this.m[1][0],
                    this.m[1][1],
                    this.m[1][3],
                    this.m[2][0],
                    this.m[2][1],
                    this.m[2][3],
                    this.m[3][0],
                    this.m[3][1],
                    this.m[3][3]
                ) -
            this.m[0][3] *
                this.determ3x3(
                    this.m[1][0],
                    this.m[1][1],
                    this.m[1][2],
                    this.m[2][0],
                    this.m[2][1],
                    this.m[2][2],
                    this.m[3][0],
                    this.m[3][1],
                    this.m[3][2]
                );

        return det;
    } // End of 'determ' function

    inverse() {
        let r = [[], [], [], []];
        let det = this.determ();

        if (det == 0) {
            let m = [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1],
            ];

            return mat4(m);
        }

        /* Build adjoint matrix */
        r[0][0] =
            this.determ3x3(
                this.m[1][1],
                this.m[1][2],
                this.m[1][3],
                this.m[2][1],
                this.m[2][2],
                this.m[2][3],
                this.m[3][1],
                this.m[3][2],
                this.m[3][3]
            ) / det;
        r[1][0] =
            -this.determ3x3(
                this.m[1][0],
                this.m[1][2],
                this.m[1][3],
                this.m[2][0],
                this.m[2][2],
                this.m[2][3],
                this.m[3][0],
                this.m[3][2],
                this.m[3][3]
            ) / det;
        r[2][0] =
            this.determ3x3(
                this.m[1][0],
                this.m[1][1],
                this.m[1][3],
                this.m[2][0],
                this.m[2][1],
                this.m[2][3],
                this.m[3][0],
                this.m[3][1],
                this.m[3][3]
            ) / det;
        r[3][0] =
            -this.determ3x3(
                this.m[1][0],
                this.m[1][1],
                this.m[1][2],
                this.m[2][0],
                this.m[2][1],
                this.m[2][2],
                this.m[3][0],
                this.m[3][1],
                this.m[3][2]
            ) / det;

        r[0][1] =
            -this.determ3x3(
                this.m[0][1],
                this.m[0][2],
                this.m[0][3],
                this.m[2][1],
                this.m[2][2],
                this.m[2][3],
                this.m[3][1],
                this.m[3][2],
                this.m[3][3]
            ) / det;
        r[1][1] =
            this.determ3x3(
                this.m[0][0],
                this.m[0][2],
                this.m[0][3],
                this.m[2][0],
                this.m[2][2],
                this.m[2][3],
                this.m[3][0],
                this.m[3][2],
                this.m[3][3]
            ) / det;
        r[2][1] =
            -this.determ3x3(
                this.m[0][0],
                this.m[0][1],
                this.m[0][3],
                this.m[2][0],
                this.m[2][1],
                this.m[2][3],
                this.m[3][0],
                this.m[3][1],
                this.m[3][3]
            ) / det;
        r[3][1] =
            this.determ3x3(
                this.m[0][0],
                this.m[0][1],
                this.m[0][2],
                this.m[2][0],
                this.m[2][1],
                this.m[2][2],
                this.m[3][0],
                this.m[3][1],
                this.m[3][2]
            ) / det;

        r[0][2] =
            this.determ3x3(
                this.m[0][1],
                this.m[0][2],
                this.m[0][3],
                this.m[1][1],
                this.m[1][2],
                this.m[1][3],
                this.m[3][1],
                this.m[3][2],
                this.m[3][3]
            ) / det;
        r[1][2] =
            -this.determ3x3(
                this.m[0][0],
                this.m[0][2],
                this.m[0][3],
                this.m[1][0],
                this.m[1][2],
                this.m[1][3],
                this.m[3][0],
                this.m[3][2],
                this.m[3][3]
            ) / det;
        r[2][2] =
            this.determ3x3(
                this.m[0][0],
                this.m[0][1],
                this.m[0][3],
                this.m[1][0],
                this.m[1][1],
                this.m[1][3],
                this.m[3][0],
                this.m[3][1],
                this.m[3][3]
            ) / det;
        r[3][2] =
            -this.determ3x3(
                this.m[0][0],
                this.m[0][1],
                this.m[0][2],
                this.m[1][0],
                this.m[1][1],
                this.m[1][2],
                this.m[3][0],
                this.m[3][1],
                this.m[3][2]
            ) / det;

        r[0][3] =
            -this.determ3x3(
                this.m[0][1],
                this.m[0][2],
                this.m[0][3],
                this.m[1][1],
                this.m[1][2],
                this.m[1][3],
                this.m[2][1],
                this.m[2][2],
                this.m[2][3]
            ) / det;

        r[1][3] =
            this.determ3x3(
                this.m[0][0],
                this.m[0][2],
                this.m[0][3],
                this.m[1][0],
                this.m[1][2],
                this.m[1][3],
                this.m[2][0],
                this.m[2][2],
                this.m[2][3]
            ) / det;
        r[2][3] =
            -this.determ3x3(
                this.m[0][0],
                this.m[0][1],
                this.m[0][3],
                this.m[1][0],
                this.m[1][1],
                this.m[1][3],
                this.m[2][0],
                this.m[2][1],
                this.m[2][3]
            ) / det;
        r[3][3] =
            this.determ3x3(
                this.m[0][0],
                this.m[0][1],
                this.m[0][2],
                this.m[1][0],
                this.m[1][1],
                this.m[1][2],
                this.m[2][0],
                this.m[2][1],
                this.m[2][2]
            ) / det;
        this.m = r;
        return this;
    } // End of 'inverse' function

    setIdentity() {
        this.m = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ];
        return this;
    } // End of 'inverse' function

    setView(Loc, At, Up1) {
        let Dir = At.sub(Loc).normalize(),
            Right = Dir.cross(Up1).normalize(),
            Up = Right.cross(Dir).normalize();
        this.m = [
            [Right.x, Up.x, -Dir.x, 0],
            [Right.y, Up.y, -Dir.y, 0],
            [Right.z, Up.z, -Dir.z, 0],
            [-Loc.dot(Right), -Loc.dot(Up), Loc.dot(Dir), 1],
        ];
        return this;
    } // End of 'setView' function

    setOrtho(Left, Right, Bottom, Top, Near, Far) {
        this.m = [
            [2 / (Right - Left), 0, 0, 0],
            [0, 2 / (Top - Bottom), 0, 0],
            [0, 0, -2 / (Far - Near), 0],
            [
                -(Right + Left) / (Right - Left),
                -(Top + Bottom) / (Top - Bottom),
                -(Far + Near) / (Far - Near),
                1,
            ],
        ];
        return this;
    } // End of 'setOrtho' function

    setFrustum(Left, Right, Bottom, Top, Near, Far) {
        this.m = [
            [(2 * Near) / (Right - Left), 0, 0, 0],
            [0, (2 * Near) / (Top - Bottom), 0, 0],
            [
                (Right + Left) / (Right - Left),
                (Top + Bottom) / (Top - Bottom),
                -(Far + Near) / (Far - Near),
                -1,
            ],
            [0, 0, (-2 * Near * Far) / (Far - Near), 0],
        ];
        return this;
    } // End of 'setFrustum' function

    view(Loc, At, Up1) {
        return this.mul(mat4().setView(Loc, At, Up1));
    } // End of 'view' function

    ortho(Left, Right, Bottom, Top, Near, Far) {
        return this.mul(mat4().setOrtho(Left, Right, Bottom, Top, Near, Far));
    } // End of 'ortho' function

    frustum(Left, Right, Bottom, Top, Near, Far) {
        return this.mul(mat4().setFrustum(Left, Right, Bottom, Top, Near, Far));
    } // End of 'frustum' function

    transform(V) {
        let w =
            V.x * this.m[0][3] +
            V.y * this.m[1][3] +
            V.z * this.m[2][3] +
            this.m[3][3];

        return vec3(
            (V.x * this.m[0][0] +
                V.y * this.m[1][0] +
                V.z * this.m[2][0] +
                this.m[3][0]) /
                w,
            (V.x * this.m[0][1] +
                V.y * this.m[1][1] +
                V.z * this.m[2][1] +
                this.m[3][1]) /
                w,
            (V.x * this.m[0][2] +
                V.y * this.m[1][2] +
                V.z * this.m[2][2] +
                this.m[3][2]) /
                w
        );
    } // End of 'transform' function

    transformVector(V) {
        return vec3(
            V.x * this.m[0][0] + V.y * this.m[1][0] + V.z * this.m[2][0],
            V.x * this.m[0][1] + V.y * this.m[1][1] + V.z * this.m[2][1],
            V.x * this.m[0][2] + V.y * this.m[1][2] + V.z * this.m[2][2]
        );
    } // End of 'transformVector' function

    transformPoint(V) {
        return vec3(
            V.x * this.m[0][0] +
                V.y * this.m[1][0] +
                V.z * this.m[2][0] +
                this.m[3][0],
            V.x * this.m[0][1] +
                V.y * this.m[1][1] +
                V.z * this.m[2][1] +
                this.m[3][1],
            V.x * this.m[0][2] +
                V.y * this.m[1][2] +
                V.z * this.m[2][2] +
                this.m[3][2]
        );
    } // End of 'transformPoint' function

    toArray() {
        return [].concat(...this.m);
    } // End of 'toArray' function
} // End of '_mat4' class

export function mat4(...args) {
    return new _mat4(...args);
} // End of 'mat4' function
