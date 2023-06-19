(function () {
    'use strict';

    class _vec3 {
        constructor(x, y, z) {
            if (x == undefined) (this.x = 0), (this.y = 0), (this.z = 0);
            else if (typeof x == "object")
                if (x.length == 3)
                    (this.x = x[0]), (this.y = x[1]), (this.z = x[2]);
                else (this.x = x.x), (this.y = x.y), (this.z = x.z);
            else if (y == undefined && z == undefined)
                (this.x = x), (this.y = x), (this.z = x);
            else (this.x = x), (this.y = y), (this.z = z);
        } // End of 'constructor' function

        set(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        } // End of 'set' function

        dot(v) {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        } // End of 'dot' function

        cross(v) {
            return vec3(
                this.y * v.z - this.z * v.y,
                this.z * v.x - this.x * v.z,
                this.x * v.y - this.y * v.x
            );
        } // End of 'cross' function

        add(v) {
            if (typeof v == "number")
                return vec3(this.x + v, this.y + v, this.z + v);
            return vec3(this.x + v.x, this.y + v.y, this.x - v.x);
        } // End of 'add' function

        sub(v) {
            if (typeof v == "number")
                return vec3(this.x - v, this.y - v, this.z - v);
            return vec3(this.x - v.x, this.y - v.y, this.z - v.z);
        } // End of 'sub' function

        mul(v) {
            if (typeof v == "number")
                return vec3(this.x * v, this.y * v, this.z * v);
            return vec3(this.x * v.x, this.y * v.y, this.z * v.z);
        } // End of 'mul' function

        div(v) {
            if (typeof v == "number")
                return vec3(this.x / v, this.y / v, this.z / v);
            return vec3(this.x / v.x, this.y / v.y, this.z / v.z);
        } // End of 'div' function

        len2() {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        } // End of 'len2' function

        len() {
            let len = this.x * this.x + this.y * this.y + this.z * this.z;

            if (len != 0 && len != 1) return Math.sqrt(len);
            return len;
        } // End of 'len' function

        normalize() {
            let len = this.x * this.x + this.y * this.y + this.z * this.z;

            if (len != 0 && len != 1) {
                len = Math.sqrt(len);
                return vec3(this.x / len, this.y / len, this.z / len);
            }
            return vec3(this);
        } // End of 'normalize' function

        toArray() {
            return [this.x, this.y, this.z];
        } // End of 'toArray' function
    } // End of '_vec3' class

    function vec3(...args) {
        return new _vec3(...args);
    } // End of 'vec3' function

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

    function mat4(...args) {
        return new _mat4(...args);
    } // End of 'mat4' function

    class _camera {
        constructor() {
            // Projection properties
            this.projSize = 0.1; // Project plane fit square
            this.projDist = 0.1; // Distance to project plane from viewer (near)
            this.projFarClip = 1800; // Distance to project far clip plane (far)

            // Local size data
            this.frameW = 30; // Frame width
            this.frameH = 30; // Frame height

            // Matrices
            this.matrView = mat4(); // View coordinate system matrix
            this.matrProj = mat4(); // Projection coordinate system matrix
            this.matrVP = mat4(); // View and projection matrix precalculate value

            // Set camera default settings
            this.loc = vec3(); // Camera location
            this.at = vec3(); // Camera destination
            this.dir = vec3(); // Camera Direction
            this.up = vec3(); // Camera UP direction
            this.right = vec3(); // Camera RIGHT direction
            this.setDef();
        } // End of 'constructor' function

        // Camera parmeters setting function
        set(loc, at, up) {
            this.matrView.setView(loc, at, up);
            this.loc = vec3(loc);
            this.at = vec3(at);
            this.dir.set(
                -this.matrView.m[0][2],
                -this.matrView.m[1][2],
                -this.matrView.m[2][2]
            );
            this.up.set(
                this.matrView.m[0][1],
                this.matrView.m[1][1],
                this.matrView.m[2][1]
            );
            this.right.set(
                this.matrView.m[0][0],
                this.matrView.m[1][0],
                this.matrView.m[2][0]
            );
            this.matrVP = mat4(this.matrView).mul(this.matrProj);
        } // End of 'set' function

        // Projection parameters setting function.
        setProj(projSize, projDist, projFarClip) {
            let rx = projSize,
                ry = projSize;

            this.projDist = projDist;
            this.projSize = projSize;
            this.projFarClip = projFarClip;

            // Correct aspect ratio
            if (this.frameW > this.frameH) rx *= this.frameW / this.frameH;
            else ry *= this.frameH / this.frameW;
            this.matrProj.setFrustum(
                -rx / 2.0,
                rx / 2.0,
                -ry / 2.0,
                ry / 2.0,
                projDist,
                projFarClip
            );

            // pre-calculate view * proj matrix
            this.matrVP = mat4(this.matrView).mul(this.matrProj);
        } // End of 'setProj' function

        // Resize camera and projection function.
        setSize(frameW, frameH) {
            if (frameW < 1) frameW = 1;
            if (frameH < 1) frameH = 1;
            this.frameW = frameW;
            this.frameH = frameH;
            // Reset projection with new render window size
            this.setProj(this.projSize, this.projDist, this.projFarClip);
        } // End of 'setSize' function

        // Camera set default values function.
        setDef() {
            this.loc.set(0, 0, 8);
            this.at.set(0, 0, 0);
            this.dir.set(0, 0, -1);
            this.up.set(0, 1, 0);
            this.right.set(1, 0, 0);

            this.projDist = 0.1;
            this.projSize = 0.1;
            this.projFarClip = 1800;

            this.frameW = 30;
            this.frameH = 30;

            this.set(this.loc, this.at, this.up);
            this.setProj(this.projSize, this.projDist, this.projFarClip);
            this.setSize(this.frameW, this.frameH);
        } // End of 'setDef' function
    } // End of 'camera' class

    function camera(...args) {
        return new _camera(args);
    } // End of 'mat4' function

    class Prim {
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

    async function fetchResource(resURL) {
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
    async function createProgram(render, gl, canvasId, vsUrl, fsUrl) {
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

    class Timer {
        constructor() {
            this.globalTime = this.localTime = this.getTime();
            this.globalDeltaTime = this.localDeltaTime = 0;

            this.startTime = this.oldTime = this.oldTimeFPS = this.globalTime;
            this.frameCounter = 0;
            this.isPause = false;
            this.FPS = 30.0;
            this.pauseTime = 0;
        }

        getTime() {
            const date = new Date();
            let t =
                date.getMilliseconds() / 1000.0 +
                date.getSeconds() +
                date.getMinutes() * 60;
            return t;
        }

        response = (tag_id = null) => {
            let t = this.getTime();
            this.globalTime = t;
            this.globalDeltaTime = t - this.oldTime;

            if (this.isPause) {
                this.localDeltaTime = 0;
                this.pauseTime += t - this.oldTime;
            } else {
                this.localDeltaTime = this.globalDeltaTime;
                this.localTime = t - this.pauseTime - this.startTime;
            }
            this.frameCounter++;
            if (t - this.oldTimeFPS > 1) {
                this.FPS = this.frameCounter / (t - this.oldTimeFPS);
                this.oldTimeFPS = t;
                this.frameCounter = 0;
                if (tag_id != null) {
                    document.getElementById(tag_id).innerHTML = this.getFPS();
                }
            }

            this.oldTime = t;
        };
        getFPS() {
            return this.FPS.toFixed(3);
        }
    }

    class Render {
        constructor(canvasId, type) {
            this.canvas = document.getElementById(canvasId);
            this.canvasId = canvasId;
            /** @type {WebGLRenderingContext} */
            this.gl = this.canvas.getContext("webgl2");

            // todo set camera params
            this.camera = camera();

            this.prog = undefined;
            createProgram(
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

            this.timer = new Timer();
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
            fetchResource(modelURL).then((res) => {
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

    window.addEventListener("load", () => {
        new Render("cube canvas", "cube").start();
        new Render("obj canvas", "obj").start();
    });

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9qcy9tYXRoL3ZlYzMuanMiLCIuLi9qcy9tYXRoL21hdDQuanMiLCIuLi9qcy9tYXRoL2NhbWVyYS5qcyIsIi4uL2pzL3JlbmRlciBzeXN0ZW0vcHJpbS5qcyIsIi4uL2pzL3JlbmRlciBzeXN0ZW0vc2hhZGVyIGxvYWQuanMiLCIuLi9qcy9yZW5kZXIgc3lzdGVtL3RpbWVyLmpzIiwiLi4vanMvcmVuZGVyIHN5c3RlbS9yZW5kZXIuanMiLCIuLi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBfdmVjMyB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCB6KSB7XHJcbiAgICAgICAgaWYgKHggPT0gdW5kZWZpbmVkKSAodGhpcy54ID0gMCksICh0aGlzLnkgPSAwKSwgKHRoaXMueiA9IDApO1xyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiB4ID09IFwib2JqZWN0XCIpXHJcbiAgICAgICAgICAgIGlmICh4Lmxlbmd0aCA9PSAzKVxyXG4gICAgICAgICAgICAgICAgKHRoaXMueCA9IHhbMF0pLCAodGhpcy55ID0geFsxXSksICh0aGlzLnogPSB4WzJdKTtcclxuICAgICAgICAgICAgZWxzZSAodGhpcy54ID0geC54KSwgKHRoaXMueSA9IHgueSksICh0aGlzLnogPSB4LnopO1xyXG4gICAgICAgIGVsc2UgaWYgKHkgPT0gdW5kZWZpbmVkICYmIHogPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAodGhpcy54ID0geCksICh0aGlzLnkgPSB4KSwgKHRoaXMueiA9IHgpO1xyXG4gICAgICAgIGVsc2UgKHRoaXMueCA9IHgpLCAodGhpcy55ID0geSksICh0aGlzLnogPSB6KTtcclxuICAgIH0gLy8gRW5kIG9mICdjb25zdHJ1Y3RvcicgZnVuY3Rpb25cclxuXHJcbiAgICBzZXQoeCwgeSwgeikge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLnogPSB6O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSAvLyBFbmQgb2YgJ3NldCcgZnVuY3Rpb25cclxuXHJcbiAgICBkb3Qodikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB2LnggKyB0aGlzLnkgKiB2LnkgKyB0aGlzLnogKiB2Lno7XHJcbiAgICB9IC8vIEVuZCBvZiAnZG90JyBmdW5jdGlvblxyXG5cclxuICAgIGNyb3NzKHYpIHtcclxuICAgICAgICByZXR1cm4gdmVjMyhcclxuICAgICAgICAgICAgdGhpcy55ICogdi56IC0gdGhpcy56ICogdi55LFxyXG4gICAgICAgICAgICB0aGlzLnogKiB2LnggLSB0aGlzLnggKiB2LnosXHJcbiAgICAgICAgICAgIHRoaXMueCAqIHYueSAtIHRoaXMueSAqIHYueFxyXG4gICAgICAgICk7XHJcbiAgICB9IC8vIEVuZCBvZiAnY3Jvc3MnIGZ1bmN0aW9uXHJcblxyXG4gICAgYWRkKHYpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHYgPT0gXCJudW1iZXJcIilcclxuICAgICAgICAgICAgcmV0dXJuIHZlYzModGhpcy54ICsgdiwgdGhpcy55ICsgdiwgdGhpcy56ICsgdik7XHJcbiAgICAgICAgcmV0dXJuIHZlYzModGhpcy54ICsgdi54LCB0aGlzLnkgKyB2LnksIHRoaXMueCAtIHYueCk7XHJcbiAgICB9IC8vIEVuZCBvZiAnYWRkJyBmdW5jdGlvblxyXG5cclxuICAgIHN1Yih2KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2ID09IFwibnVtYmVyXCIpXHJcbiAgICAgICAgICAgIHJldHVybiB2ZWMzKHRoaXMueCAtIHYsIHRoaXMueSAtIHYsIHRoaXMueiAtIHYpO1xyXG4gICAgICAgIHJldHVybiB2ZWMzKHRoaXMueCAtIHYueCwgdGhpcy55IC0gdi55LCB0aGlzLnogLSB2LnopO1xyXG4gICAgfSAvLyBFbmQgb2YgJ3N1YicgZnVuY3Rpb25cclxuXHJcbiAgICBtdWwodikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdiA9PSBcIm51bWJlclwiKVxyXG4gICAgICAgICAgICByZXR1cm4gdmVjMyh0aGlzLnggKiB2LCB0aGlzLnkgKiB2LCB0aGlzLnogKiB2KTtcclxuICAgICAgICByZXR1cm4gdmVjMyh0aGlzLnggKiB2LngsIHRoaXMueSAqIHYueSwgdGhpcy56ICogdi56KTtcclxuICAgIH0gLy8gRW5kIG9mICdtdWwnIGZ1bmN0aW9uXHJcblxyXG4gICAgZGl2KHYpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHYgPT0gXCJudW1iZXJcIilcclxuICAgICAgICAgICAgcmV0dXJuIHZlYzModGhpcy54IC8gdiwgdGhpcy55IC8gdiwgdGhpcy56IC8gdik7XHJcbiAgICAgICAgcmV0dXJuIHZlYzModGhpcy54IC8gdi54LCB0aGlzLnkgLyB2LnksIHRoaXMueiAvIHYueik7XHJcbiAgICB9IC8vIEVuZCBvZiAnZGl2JyBmdW5jdGlvblxyXG5cclxuICAgIGxlbjIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSArIHRoaXMueiAqIHRoaXMuejtcclxuICAgIH0gLy8gRW5kIG9mICdsZW4yJyBmdW5jdGlvblxyXG5cclxuICAgIGxlbigpIHtcclxuICAgICAgICBsZXQgbGVuID0gdGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55ICsgdGhpcy56ICogdGhpcy56O1xyXG5cclxuICAgICAgICBpZiAobGVuICE9IDAgJiYgbGVuICE9IDEpIHJldHVybiBNYXRoLnNxcnQobGVuKTtcclxuICAgICAgICByZXR1cm4gbGVuO1xyXG4gICAgfSAvLyBFbmQgb2YgJ2xlbicgZnVuY3Rpb25cclxuXHJcbiAgICBub3JtYWxpemUoKSB7XHJcbiAgICAgICAgbGV0IGxlbiA9IHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSArIHRoaXMueiAqIHRoaXMuejtcclxuXHJcbiAgICAgICAgaWYgKGxlbiAhPSAwICYmIGxlbiAhPSAxKSB7XHJcbiAgICAgICAgICAgIGxlbiA9IE1hdGguc3FydChsZW4pO1xyXG4gICAgICAgICAgICByZXR1cm4gdmVjMyh0aGlzLnggLyBsZW4sIHRoaXMueSAvIGxlbiwgdGhpcy56IC8gbGVuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZlYzModGhpcyk7XHJcbiAgICB9IC8vIEVuZCBvZiAnbm9ybWFsaXplJyBmdW5jdGlvblxyXG5cclxuICAgIHRvQXJyYXkoKSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLngsIHRoaXMueSwgdGhpcy56XTtcclxuICAgIH0gLy8gRW5kIG9mICd0b0FycmF5JyBmdW5jdGlvblxyXG59IC8vIEVuZCBvZiAnX3ZlYzMnIGNsYXNzXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVjMyguLi5hcmdzKSB7XHJcbiAgICByZXR1cm4gbmV3IF92ZWMzKC4uLmFyZ3MpO1xyXG59IC8vIEVuZCBvZiAndmVjMycgZnVuY3Rpb25cclxuIiwiaW1wb3J0IHsgdmVjMyB9IGZyb20gXCIuL3ZlYzMuanNcIjtcclxuZXhwb3J0IHsgdmVjMyB9O1xyXG5cclxuY2xhc3MgX21hdDQge1xyXG4gICAgYWRkTWV0aG9kKG9iaiwgbmFtZSwgZnVuYykge1xyXG4gICAgICAgIHZhciBvbGQgPSBvYmpbbmFtZV07XHJcbiAgICAgICAgb2JqW25hbWVdID0gKC4uLmFyZ3MpID0+IHtcclxuICAgICAgICAgICAgaWYgKGZ1bmMubGVuZ3RoID09IGFyZ3MubGVuZ3RoKSByZXR1cm4gZnVuYy5hcHBseShvYmosIGFyZ3MpO1xyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb2xkID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIG9sZC5hcHBseShvYmosIGFyZ3MpO1xyXG4gICAgICAgIH07XHJcbiAgICB9IC8vIEVuZCBvZiAnYWRkTWV0aG9kJyBmdW5jdGlvblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKG0gPSBudWxsKSB7XHJcbiAgICAgICAgaWYgKG0gPT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5tID0gW1xyXG4gICAgICAgICAgICAgICAgWzEsIDAsIDAsIDBdLFxyXG4gICAgICAgICAgICAgICAgWzAsIDEsIDAsIDBdLFxyXG4gICAgICAgICAgICAgICAgWzAsIDAsIDEsIDBdLFxyXG4gICAgICAgICAgICAgICAgWzAsIDAsIDAsIDFdLFxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBtID09IFwib2JqZWN0XCIgJiYgbS5sZW5ndGggPT0gNCkgdGhpcy5tID0gbTtcclxuICAgICAgICBlbHNlIHRoaXMubSA9IG0ubTtcclxuXHJcbiAgICAgICAgLy8gVHJhbnNsYXRlXHJcbiAgICAgICAgdGhpcy5hZGRNZXRob2QodGhpcywgXCJzZXRUcmFuc2xhdGVcIiwgKGR4LCBkeSwgZHopID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tID0gW1xyXG4gICAgICAgICAgICAgICAgWzEsIDAsIDAsIDBdLFxyXG4gICAgICAgICAgICAgICAgWzAsIDEsIDAsIDBdLFxyXG4gICAgICAgICAgICAgICAgWzAsIDAsIDEsIDBdLFxyXG4gICAgICAgICAgICAgICAgW2R4LCBkeSwgZHosIDFdLFxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmFkZE1ldGhvZCh0aGlzLCBcInNldFRyYW5zbGF0ZVwiLCAodikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRUcmFuc2xhdGUodi54LCB2LnksIHYueik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5hZGRNZXRob2QodGhpcywgXCJ0cmFuc2xhdGVcIiwgKGR4LCBkeSwgZHopID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tdWwoW1xyXG4gICAgICAgICAgICAgICAgWzEsIDAsIDAsIDBdLFxyXG4gICAgICAgICAgICAgICAgWzAsIDEsIDAsIDBdLFxyXG4gICAgICAgICAgICAgICAgWzAsIDAsIDEsIDBdLFxyXG4gICAgICAgICAgICAgICAgW2R4LCBkeSwgZHosIDFdLFxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5hZGRNZXRob2QodGhpcywgXCJ0cmFuc2xhdGVcIiwgKHYpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlKHYueCwgdi55LCB2LnopO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIFNjYWxlXHJcbiAgICAgICAgdGhpcy5hZGRNZXRob2QodGhpcywgXCJzZXRTY2FsZVwiLCAoc3gsIHN5LCBzeikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm0gPSBbXHJcbiAgICAgICAgICAgICAgICBbc3gsIDAsIDAsIDBdLFxyXG4gICAgICAgICAgICAgICAgWzAsIHN5LCAwLCAwXSxcclxuICAgICAgICAgICAgICAgIFswLCAwLCBzeiwgMF0sXHJcbiAgICAgICAgICAgICAgICBbMCwgMCwgMCwgMV0sXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYWRkTWV0aG9kKHRoaXMsIFwic2V0U2NhbGVcIiwgKHYpID0+IHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2ID09IFwib2JqZWN0XCIpIHJldHVybiB0aGlzLnNldFNjYWxlKHYueCwgdi55LCB2LnopO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTY2FsZSh2LCB2LCB2KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmFkZE1ldGhvZCh0aGlzLCBcInNjYWxlXCIsIChzeCwgc3ksIHN6KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubXVsKFtcclxuICAgICAgICAgICAgICAgIFtzeCwgMCwgMCwgMF0sXHJcbiAgICAgICAgICAgICAgICBbMCwgc3ksIDAsIDBdLFxyXG4gICAgICAgICAgICAgICAgWzAsIDAsIHN6LCAwXSxcclxuICAgICAgICAgICAgICAgIFswLCAwLCAwLCAxXSxcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYWRkTWV0aG9kKHRoaXMsIFwic2NhbGVcIiwgKHYpID0+IHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2ID09IFwib2JqZWN0XCIpIHJldHVybiB0aGlzLnNjYWxlKHYueCwgdi55LCB2LnopO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY2FsZSh2LCB2LCB2KTtcclxuICAgICAgICB9KTtcclxuICAgIH0gLy8gRW5kIG9mICdjb25zdHJ1Y3RvcicgZnVuY3Rpb25cclxuXHJcbiAgICBzZXRSb3RhdGUoQW5nbGVJbkRlZ3JlZSwgUikge1xyXG4gICAgICAgIGxldCBhID0gQW5nbGVJbkRlZ3JlZSAqIE1hdGguUEksXHJcbiAgICAgICAgICAgIHNpbmUgPSBNYXRoLnNpbihhKSxcclxuICAgICAgICAgICAgY29zaW5lID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgbGV0IHggPSAwLFxyXG4gICAgICAgICAgICB5ID0gMCxcclxuICAgICAgICAgICAgeiA9IDE7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBSID09IFwib2JqZWN0XCIpXHJcbiAgICAgICAgICAgIGlmIChSLmxlbmd0aCA9PSAzKSAoeCA9IFJbMF0pLCAoeSA9IFJbMV0pLCAoeiA9IFJbMl0pO1xyXG4gICAgICAgICAgICBlbHNlICh4ID0gUi54KSwgKHkgPSBSLnkpLCAoeiA9IFIueik7XHJcbiAgICAgICAgLy8gVmVjdG9yIG5vcm1hbGl6ZVxyXG4gICAgICAgIGxldCBsZW4gPSB4ICogeCArIHkgKiB5ICsgeiAqIHo7XHJcbiAgICAgICAgaWYgKGxlbiAhPSAwICYmIGxlbiAhPSAxKVxyXG4gICAgICAgICAgICAobGVuID0gTWF0aC5zcXJ0KGxlbikpLCAoeCAvPSBsZW4pLCAoeSAvPSBsZW4pLCAoeiAvPSBsZW4pO1xyXG4gICAgICAgIHRoaXMubVswXVswXSA9IGNvc2luZSArIHggKiB4ICogKDEgLSBjb3NpbmUpO1xyXG4gICAgICAgIHRoaXMubVswXVsxXSA9IHggKiB5ICogKDEgLSBjb3NpbmUpICsgeiAqIHNpbmU7XHJcbiAgICAgICAgdGhpcy5tWzBdWzJdID0geCAqIHogKiAoMSAtIGNvc2luZSkgLSB5ICogc2luZTtcclxuICAgICAgICB0aGlzLm1bMF1bM10gPSAwO1xyXG4gICAgICAgIHRoaXMubVsxXVswXSA9IHkgKiB4ICogKDEgLSBjb3NpbmUpIC0geiAqIHNpbmU7XHJcbiAgICAgICAgdGhpcy5tWzFdWzFdID0gY29zaW5lICsgeSAqIHkgKiAoMSAtIGNvc2luZSk7XHJcbiAgICAgICAgdGhpcy5tWzFdWzJdID0geSAqIHogKiAoMSAtIGNvc2luZSkgKyB4ICogc2luZTtcclxuICAgICAgICB0aGlzLm1bMV1bM10gPSAwO1xyXG4gICAgICAgIHRoaXMubVsyXVswXSA9IHogKiB4ICogKDEgLSBjb3NpbmUpICsgeSAqIHNpbmU7XHJcbiAgICAgICAgdGhpcy5tWzJdWzFdID0geiAqIHkgKiAoMSAtIGNvc2luZSkgLSB4ICogc2luZTtcclxuICAgICAgICB0aGlzLm1bMl1bMl0gPSBjb3NpbmUgKyB6ICogeiAqICgxIC0gY29zaW5lKTtcclxuICAgICAgICB0aGlzLm1bMl1bM10gPSAwO1xyXG4gICAgICAgIHRoaXMubVszXVswXSA9IDA7XHJcbiAgICAgICAgdGhpcy5tWzNdWzFdID0gMDtcclxuICAgICAgICB0aGlzLm1bM11bMl0gPSAwO1xyXG4gICAgICAgIHRoaXMubVszXVszXSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9IC8vIEVuZCBvZiAnc2V0Um90YXRlJyBmdW5jdGlvblxyXG5cclxuICAgIHJvdGF0ZShBbmdsZUluRGVncmVlLCBSKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsKG1hdDQoKS5zZXRSb3RhdGUoQW5nbGVJbkRlZ3JlZSwgUikpO1xyXG4gICAgfSAvLyBFbmQgb2YgJ3JvdGF0ZScgZnVuY3Rpb25cclxuXHJcbiAgICB0cmFuc3Bvc2UoKSB7XHJcbiAgICAgICAgbGV0IHIgPSBbW10sIFtdLCBbXSwgW11dO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKylcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA0OyBqKyspIHJbaV1bal0gPSB0aGlzLm1bal1baV07XHJcbiAgICAgICAgcmV0dXJuIG1hdDQocik7XHJcbiAgICB9IC8vIEVuZCBvZiAndHJhbnNwb3NlJyBmdW5jdGlvblxyXG5cclxuICAgIG11bChtKSB7XHJcbiAgICAgICAgbGV0IG1hdHI7XHJcbiAgICAgICAgaWYgKG0ubGVuZ3RoID09IDQpIG1hdHIgPSBtO1xyXG4gICAgICAgIGVsc2UgbWF0ciA9IG0ubTtcclxuICAgICAgICB0aGlzLm0gPSBbXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIHRoaXMubVswXVswXSAqIG1hdHJbMF1bMF0gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVswXVsxXSAqIG1hdHJbMV1bMF0gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVswXVsyXSAqIG1hdHJbMl1bMF0gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVswXVszXSAqIG1hdHJbM11bMF0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMF1bMF0gKiBtYXRyWzBdWzFdICtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bMF1bMV0gKiBtYXRyWzFdWzFdICtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bMF1bMl0gKiBtYXRyWzJdWzFdICtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bMF1bM10gKiBtYXRyWzNdWzFdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzBdWzBdICogbWF0clswXVsyXSArXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzBdWzFdICogbWF0clsxXVsyXSArXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzBdWzJdICogbWF0clsyXVsyXSArXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzBdWzNdICogbWF0clszXVsyXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVswXVswXSAqIG1hdHJbMF1bM10gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVswXVsxXSAqIG1hdHJbMV1bM10gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVswXVsyXSAqIG1hdHJbMl1bM10gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVswXVszXSAqIG1hdHJbM11bM10sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIHRoaXMubVsxXVswXSAqIG1hdHJbMF1bMF0gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsxXVsxXSAqIG1hdHJbMV1bMF0gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsxXVsyXSAqIG1hdHJbMl1bMF0gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsxXVszXSAqIG1hdHJbM11bMF0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMV1bMF0gKiBtYXRyWzBdWzFdICtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bMV1bMV0gKiBtYXRyWzFdWzFdICtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bMV1bMl0gKiBtYXRyWzJdWzFdICtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bMV1bM10gKiBtYXRyWzNdWzFdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzFdWzBdICogbWF0clswXVsyXSArXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzFdWzFdICogbWF0clsxXVsyXSArXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzFdWzJdICogbWF0clsyXVsyXSArXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzFdWzNdICogbWF0clszXVsyXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsxXVswXSAqIG1hdHJbMF1bM10gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsxXVsxXSAqIG1hdHJbMV1bM10gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsxXVsyXSAqIG1hdHJbMl1bM10gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsxXVszXSAqIG1hdHJbM11bM10sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIHRoaXMubVsyXVswXSAqIG1hdHJbMF1bMF0gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsyXVsxXSAqIG1hdHJbMV1bMF0gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsyXVsyXSAqIG1hdHJbMl1bMF0gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsyXVszXSAqIG1hdHJbM11bMF0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMl1bMF0gKiBtYXRyWzBdWzFdICtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bMl1bMV0gKiBtYXRyWzFdWzFdICtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bMl1bMl0gKiBtYXRyWzJdWzFdICtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bMl1bM10gKiBtYXRyWzNdWzFdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzJdWzBdICogbWF0clswXVsyXSArXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzJdWzFdICogbWF0clsxXVsyXSArXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzJdWzJdICogbWF0clsyXVsyXSArXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzJdWzNdICogbWF0clszXVsyXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsyXVswXSAqIG1hdHJbMF1bM10gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsyXVsxXSAqIG1hdHJbMV1bM10gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsyXVsyXSAqIG1hdHJbMl1bM10gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsyXVszXSAqIG1hdHJbM11bM10sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIHRoaXMubVszXVswXSAqIG1hdHJbMF1bMF0gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVszXVsxXSAqIG1hdHJbMV1bMF0gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVszXVsyXSAqIG1hdHJbMl1bMF0gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVszXVszXSAqIG1hdHJbM11bMF0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bM11bMF0gKiBtYXRyWzBdWzFdICtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bM11bMV0gKiBtYXRyWzFdWzFdICtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bM11bMl0gKiBtYXRyWzJdWzFdICtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bM11bM10gKiBtYXRyWzNdWzFdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzBdICogbWF0clswXVsyXSArXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzNdWzFdICogbWF0clsxXVsyXSArXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzNdWzJdICogbWF0clsyXVsyXSArXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzNdWzNdICogbWF0clszXVsyXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVszXVswXSAqIG1hdHJbMF1bM10gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVszXVsxXSAqIG1hdHJbMV1bM10gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVszXVsyXSAqIG1hdHJbMl1bM10gK1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVszXVszXSAqIG1hdHJbM11bM10sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgXTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0gLy8gRW5kIG9mICdtdWwnIGZ1bmN0aW9uXHJcblxyXG4gICAgZGV0ZXJtM3gzKEExMSwgQTEyLCBBMTMsIEEyMSwgQTIyLCBBMjMsIEEzMSwgQTMyLCBBMzMpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBBMTEgKiBBMjIgKiBBMzMgLVxyXG4gICAgICAgICAgICBBMTEgKiBBMjMgKiBBMzIgLVxyXG4gICAgICAgICAgICBBMTIgKiBBMjEgKiBBMzMgK1xyXG4gICAgICAgICAgICBBMTIgKiBBMjMgKiBBMzEgK1xyXG4gICAgICAgICAgICBBMTMgKiBBMjEgKiBBMzIgLVxyXG4gICAgICAgICAgICBBMTMgKiBBMjIgKiBBMzFcclxuICAgICAgICApO1xyXG4gICAgfSAvLyBFbmQgb2YgJ2RldGVybTN4MycgZnVuY3Rpb25cclxuXHJcbiAgICBkZXRlcm0oKSB7XHJcbiAgICAgICAgbGV0IGRldCA9XHJcbiAgICAgICAgICAgIHRoaXMubVswXVswXSAqXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRldGVybTN4MyhcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bMV1bMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzFdWzJdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsxXVszXSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bMl1bMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzJdWzJdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsyXVszXSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bM11bMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzNdWzJdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVszXVszXVxyXG4gICAgICAgICAgICAgICAgKSAtXHJcbiAgICAgICAgICAgIHRoaXMubVswXVsxXSAqXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRldGVybTN4MyhcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bMV1bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzFdWzJdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsxXVszXSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bMl1bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzJdWzJdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsyXVszXSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bM11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzNdWzJdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVszXVszXVxyXG4gICAgICAgICAgICAgICAgKSArXHJcbiAgICAgICAgICAgIHRoaXMubVswXVsyXSAqXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRldGVybTN4MyhcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bMV1bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzFdWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsxXVszXSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bMl1bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzJdWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsyXVszXSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bM11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzNdWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVszXVszXVxyXG4gICAgICAgICAgICAgICAgKSAtXHJcbiAgICAgICAgICAgIHRoaXMubVswXVszXSAqXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRldGVybTN4MyhcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bMV1bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzFdWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsxXVsyXSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bMl1bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzJdWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVsyXVsyXSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1bM11bMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tWzNdWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubVszXVsyXVxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRldDtcclxuICAgIH0gLy8gRW5kIG9mICdkZXRlcm0nIGZ1bmN0aW9uXHJcblxyXG4gICAgaW52ZXJzZSgpIHtcclxuICAgICAgICBsZXQgciA9IFtbXSwgW10sIFtdLCBbXV07XHJcbiAgICAgICAgbGV0IGRldCA9IHRoaXMuZGV0ZXJtKCk7XHJcblxyXG4gICAgICAgIGlmIChkZXQgPT0gMCkge1xyXG4gICAgICAgICAgICBsZXQgbSA9IFtcclxuICAgICAgICAgICAgICAgIFsxLCAwLCAwLCAwXSxcclxuICAgICAgICAgICAgICAgIFswLCAxLCAwLCAwXSxcclxuICAgICAgICAgICAgICAgIFswLCAwLCAxLCAwXSxcclxuICAgICAgICAgICAgICAgIFswLCAwLCAwLCAxXSxcclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtYXQ0KG0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogQnVpbGQgYWRqb2ludCBtYXRyaXggKi9cclxuICAgICAgICByWzBdWzBdID1cclxuICAgICAgICAgICAgdGhpcy5kZXRlcm0zeDMoXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMV1bMV0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMV1bMl0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMV1bM10sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMl1bMV0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMl1bMl0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMl1bM10sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bM11bMV0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bM11bMl0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bM11bM11cclxuICAgICAgICAgICAgKSAvIGRldDtcclxuICAgICAgICByWzFdWzBdID1cclxuICAgICAgICAgICAgLXRoaXMuZGV0ZXJtM3gzKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzFdWzBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzFdWzJdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzFdWzNdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzJdWzBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzJdWzJdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzJdWzNdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzJdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzNdXHJcbiAgICAgICAgICAgICkgLyBkZXQ7XHJcbiAgICAgICAgclsyXVswXSA9XHJcbiAgICAgICAgICAgIHRoaXMuZGV0ZXJtM3gzKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzFdWzBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzFdWzFdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzFdWzNdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzJdWzBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzJdWzFdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzJdWzNdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzFdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzNdXHJcbiAgICAgICAgICAgICkgLyBkZXQ7XHJcbiAgICAgICAgclszXVswXSA9XHJcbiAgICAgICAgICAgIC10aGlzLmRldGVybTN4MyhcclxuICAgICAgICAgICAgICAgIHRoaXMubVsxXVswXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsxXVsxXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsxXVsyXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsyXVswXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsyXVsxXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsyXVsyXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVszXVswXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVszXVsxXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVszXVsyXVxyXG4gICAgICAgICAgICApIC8gZGV0O1xyXG5cclxuICAgICAgICByWzBdWzFdID1cclxuICAgICAgICAgICAgLXRoaXMuZGV0ZXJtM3gzKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzBdWzFdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzBdWzJdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzBdWzNdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzJdWzFdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzJdWzJdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzJdWzNdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzFdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzJdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzNdXHJcbiAgICAgICAgICAgICkgLyBkZXQ7XHJcbiAgICAgICAgclsxXVsxXSA9XHJcbiAgICAgICAgICAgIHRoaXMuZGV0ZXJtM3gzKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzBdWzBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzBdWzJdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzBdWzNdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzJdWzBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzJdWzJdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzJdWzNdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzJdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzNdXHJcbiAgICAgICAgICAgICkgLyBkZXQ7XHJcbiAgICAgICAgclsyXVsxXSA9XHJcbiAgICAgICAgICAgIC10aGlzLmRldGVybTN4MyhcclxuICAgICAgICAgICAgICAgIHRoaXMubVswXVswXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVswXVsxXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVswXVszXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsyXVswXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsyXVsxXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsyXVszXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVszXVswXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVszXVsxXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVszXVszXVxyXG4gICAgICAgICAgICApIC8gZGV0O1xyXG4gICAgICAgIHJbM11bMV0gPVxyXG4gICAgICAgICAgICB0aGlzLmRldGVybTN4MyhcclxuICAgICAgICAgICAgICAgIHRoaXMubVswXVswXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVswXVsxXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVswXVsyXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsyXVswXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsyXVsxXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsyXVsyXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVszXVswXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVszXVsxXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVszXVsyXVxyXG4gICAgICAgICAgICApIC8gZGV0O1xyXG5cclxuICAgICAgICByWzBdWzJdID1cclxuICAgICAgICAgICAgdGhpcy5kZXRlcm0zeDMoXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMF1bMV0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMF1bMl0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMF1bM10sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMV1bMV0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMV1bMl0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMV1bM10sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bM11bMV0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bM11bMl0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bM11bM11cclxuICAgICAgICAgICAgKSAvIGRldDtcclxuICAgICAgICByWzFdWzJdID1cclxuICAgICAgICAgICAgLXRoaXMuZGV0ZXJtM3gzKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzBdWzBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzBdWzJdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzBdWzNdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzFdWzBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzFdWzJdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzFdWzNdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzJdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzNdXHJcbiAgICAgICAgICAgICkgLyBkZXQ7XHJcbiAgICAgICAgclsyXVsyXSA9XHJcbiAgICAgICAgICAgIHRoaXMuZGV0ZXJtM3gzKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzBdWzBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzBdWzFdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzBdWzNdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzFdWzBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzFdWzFdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzFdWzNdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzBdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzFdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzNdXHJcbiAgICAgICAgICAgICkgLyBkZXQ7XHJcbiAgICAgICAgclszXVsyXSA9XHJcbiAgICAgICAgICAgIC10aGlzLmRldGVybTN4MyhcclxuICAgICAgICAgICAgICAgIHRoaXMubVswXVswXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVswXVsxXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVswXVsyXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsxXVswXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsxXVsxXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsxXVsyXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVszXVswXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVszXVsxXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVszXVsyXVxyXG4gICAgICAgICAgICApIC8gZGV0O1xyXG5cclxuICAgICAgICByWzBdWzNdID1cclxuICAgICAgICAgICAgLXRoaXMuZGV0ZXJtM3gzKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzBdWzFdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzBdWzJdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzBdWzNdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzFdWzFdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzFdWzJdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzFdWzNdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzJdWzFdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzJdWzJdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzJdWzNdXHJcbiAgICAgICAgICAgICkgLyBkZXQ7XHJcblxyXG4gICAgICAgIHJbMV1bM10gPVxyXG4gICAgICAgICAgICB0aGlzLmRldGVybTN4MyhcclxuICAgICAgICAgICAgICAgIHRoaXMubVswXVswXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVswXVsyXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVswXVszXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsxXVswXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsxXVsyXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsxXVszXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsyXVswXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsyXVsyXSxcclxuICAgICAgICAgICAgICAgIHRoaXMubVsyXVszXVxyXG4gICAgICAgICAgICApIC8gZGV0O1xyXG4gICAgICAgIHJbMl1bM10gPVxyXG4gICAgICAgICAgICAtdGhpcy5kZXRlcm0zeDMoXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMF1bMF0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMF1bMV0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMF1bM10sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMV1bMF0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMV1bMV0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMV1bM10sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMl1bMF0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMl1bMV0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMl1bM11cclxuICAgICAgICAgICAgKSAvIGRldDtcclxuICAgICAgICByWzNdWzNdID1cclxuICAgICAgICAgICAgdGhpcy5kZXRlcm0zeDMoXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMF1bMF0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMF1bMV0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMF1bMl0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMV1bMF0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMV1bMV0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMV1bMl0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMl1bMF0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMl1bMV0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bMl1bMl1cclxuICAgICAgICAgICAgKSAvIGRldDtcclxuICAgICAgICB0aGlzLm0gPSByO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSAvLyBFbmQgb2YgJ2ludmVyc2UnIGZ1bmN0aW9uXHJcblxyXG4gICAgc2V0SWRlbnRpdHkoKSB7XHJcbiAgICAgICAgdGhpcy5tID0gW1xyXG4gICAgICAgICAgICBbMSwgMCwgMCwgMF0sXHJcbiAgICAgICAgICAgIFswLCAxLCAwLCAwXSxcclxuICAgICAgICAgICAgWzAsIDAsIDEsIDBdLFxyXG4gICAgICAgICAgICBbMCwgMCwgMCwgMV0sXHJcbiAgICAgICAgXTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0gLy8gRW5kIG9mICdpbnZlcnNlJyBmdW5jdGlvblxyXG5cclxuICAgIHNldFZpZXcoTG9jLCBBdCwgVXAxKSB7XHJcbiAgICAgICAgbGV0IERpciA9IEF0LnN1YihMb2MpLm5vcm1hbGl6ZSgpLFxyXG4gICAgICAgICAgICBSaWdodCA9IERpci5jcm9zcyhVcDEpLm5vcm1hbGl6ZSgpLFxyXG4gICAgICAgICAgICBVcCA9IFJpZ2h0LmNyb3NzKERpcikubm9ybWFsaXplKCk7XHJcbiAgICAgICAgdGhpcy5tID0gW1xyXG4gICAgICAgICAgICBbUmlnaHQueCwgVXAueCwgLURpci54LCAwXSxcclxuICAgICAgICAgICAgW1JpZ2h0LnksIFVwLnksIC1EaXIueSwgMF0sXHJcbiAgICAgICAgICAgIFtSaWdodC56LCBVcC56LCAtRGlyLnosIDBdLFxyXG4gICAgICAgICAgICBbLUxvYy5kb3QoUmlnaHQpLCAtTG9jLmRvdChVcCksIExvYy5kb3QoRGlyKSwgMV0sXHJcbiAgICAgICAgXTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0gLy8gRW5kIG9mICdzZXRWaWV3JyBmdW5jdGlvblxyXG5cclxuICAgIHNldE9ydGhvKExlZnQsIFJpZ2h0LCBCb3R0b20sIFRvcCwgTmVhciwgRmFyKSB7XHJcbiAgICAgICAgdGhpcy5tID0gW1xyXG4gICAgICAgICAgICBbMiAvIChSaWdodCAtIExlZnQpLCAwLCAwLCAwXSxcclxuICAgICAgICAgICAgWzAsIDIgLyAoVG9wIC0gQm90dG9tKSwgMCwgMF0sXHJcbiAgICAgICAgICAgIFswLCAwLCAtMiAvIChGYXIgLSBOZWFyKSwgMF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC0oUmlnaHQgKyBMZWZ0KSAvIChSaWdodCAtIExlZnQpLFxyXG4gICAgICAgICAgICAgICAgLShUb3AgKyBCb3R0b20pIC8gKFRvcCAtIEJvdHRvbSksXHJcbiAgICAgICAgICAgICAgICAtKEZhciArIE5lYXIpIC8gKEZhciAtIE5lYXIpLFxyXG4gICAgICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICBdO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSAvLyBFbmQgb2YgJ3NldE9ydGhvJyBmdW5jdGlvblxyXG5cclxuICAgIHNldEZydXN0dW0oTGVmdCwgUmlnaHQsIEJvdHRvbSwgVG9wLCBOZWFyLCBGYXIpIHtcclxuICAgICAgICB0aGlzLm0gPSBbXHJcbiAgICAgICAgICAgIFsoMiAqIE5lYXIpIC8gKFJpZ2h0IC0gTGVmdCksIDAsIDAsIDBdLFxyXG4gICAgICAgICAgICBbMCwgKDIgKiBOZWFyKSAvIChUb3AgLSBCb3R0b20pLCAwLCAwXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgKFJpZ2h0ICsgTGVmdCkgLyAoUmlnaHQgLSBMZWZ0KSxcclxuICAgICAgICAgICAgICAgIChUb3AgKyBCb3R0b20pIC8gKFRvcCAtIEJvdHRvbSksXHJcbiAgICAgICAgICAgICAgICAtKEZhciArIE5lYXIpIC8gKEZhciAtIE5lYXIpLFxyXG4gICAgICAgICAgICAgICAgLTEsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFswLCAwLCAoLTIgKiBOZWFyICogRmFyKSAvIChGYXIgLSBOZWFyKSwgMF0sXHJcbiAgICAgICAgXTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0gLy8gRW5kIG9mICdzZXRGcnVzdHVtJyBmdW5jdGlvblxyXG5cclxuICAgIHZpZXcoTG9jLCBBdCwgVXAxKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsKG1hdDQoKS5zZXRWaWV3KExvYywgQXQsIFVwMSkpO1xyXG4gICAgfSAvLyBFbmQgb2YgJ3ZpZXcnIGZ1bmN0aW9uXHJcblxyXG4gICAgb3J0aG8oTGVmdCwgUmlnaHQsIEJvdHRvbSwgVG9wLCBOZWFyLCBGYXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tdWwobWF0NCgpLnNldE9ydGhvKExlZnQsIFJpZ2h0LCBCb3R0b20sIFRvcCwgTmVhciwgRmFyKSk7XHJcbiAgICB9IC8vIEVuZCBvZiAnb3J0aG8nIGZ1bmN0aW9uXHJcblxyXG4gICAgZnJ1c3R1bShMZWZ0LCBSaWdodCwgQm90dG9tLCBUb3AsIE5lYXIsIEZhcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm11bChtYXQ0KCkuc2V0RnJ1c3R1bShMZWZ0LCBSaWdodCwgQm90dG9tLCBUb3AsIE5lYXIsIEZhcikpO1xyXG4gICAgfSAvLyBFbmQgb2YgJ2ZydXN0dW0nIGZ1bmN0aW9uXHJcblxyXG4gICAgdHJhbnNmb3JtKFYpIHtcclxuICAgICAgICBsZXQgdyA9XHJcbiAgICAgICAgICAgIFYueCAqIHRoaXMubVswXVszXSArXHJcbiAgICAgICAgICAgIFYueSAqIHRoaXMubVsxXVszXSArXHJcbiAgICAgICAgICAgIFYueiAqIHRoaXMubVsyXVszXSArXHJcbiAgICAgICAgICAgIHRoaXMubVszXVszXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZlYzMoXHJcbiAgICAgICAgICAgIChWLnggKiB0aGlzLm1bMF1bMF0gK1xyXG4gICAgICAgICAgICAgICAgVi55ICogdGhpcy5tWzFdWzBdICtcclxuICAgICAgICAgICAgICAgIFYueiAqIHRoaXMubVsyXVswXSArXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bM11bMF0pIC9cclxuICAgICAgICAgICAgICAgIHcsXHJcbiAgICAgICAgICAgIChWLnggKiB0aGlzLm1bMF1bMV0gK1xyXG4gICAgICAgICAgICAgICAgVi55ICogdGhpcy5tWzFdWzFdICtcclxuICAgICAgICAgICAgICAgIFYueiAqIHRoaXMubVsyXVsxXSArXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bM11bMV0pIC9cclxuICAgICAgICAgICAgICAgIHcsXHJcbiAgICAgICAgICAgIChWLnggKiB0aGlzLm1bMF1bMl0gK1xyXG4gICAgICAgICAgICAgICAgVi55ICogdGhpcy5tWzFdWzJdICtcclxuICAgICAgICAgICAgICAgIFYueiAqIHRoaXMubVsyXVsyXSArXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bM11bMl0pIC9cclxuICAgICAgICAgICAgICAgIHdcclxuICAgICAgICApO1xyXG4gICAgfSAvLyBFbmQgb2YgJ3RyYW5zZm9ybScgZnVuY3Rpb25cclxuXHJcbiAgICB0cmFuc2Zvcm1WZWN0b3IoVikge1xyXG4gICAgICAgIHJldHVybiB2ZWMzKFxyXG4gICAgICAgICAgICBWLnggKiB0aGlzLm1bMF1bMF0gKyBWLnkgKiB0aGlzLm1bMV1bMF0gKyBWLnogKiB0aGlzLm1bMl1bMF0sXHJcbiAgICAgICAgICAgIFYueCAqIHRoaXMubVswXVsxXSArIFYueSAqIHRoaXMubVsxXVsxXSArIFYueiAqIHRoaXMubVsyXVsxXSxcclxuICAgICAgICAgICAgVi54ICogdGhpcy5tWzBdWzJdICsgVi55ICogdGhpcy5tWzFdWzJdICsgVi56ICogdGhpcy5tWzJdWzJdXHJcbiAgICAgICAgKTtcclxuICAgIH0gLy8gRW5kIG9mICd0cmFuc2Zvcm1WZWN0b3InIGZ1bmN0aW9uXHJcblxyXG4gICAgdHJhbnNmb3JtUG9pbnQoVikge1xyXG4gICAgICAgIHJldHVybiB2ZWMzKFxyXG4gICAgICAgICAgICBWLnggKiB0aGlzLm1bMF1bMF0gK1xyXG4gICAgICAgICAgICAgICAgVi55ICogdGhpcy5tWzFdWzBdICtcclxuICAgICAgICAgICAgICAgIFYueiAqIHRoaXMubVsyXVswXSArXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1bM11bMF0sXHJcbiAgICAgICAgICAgIFYueCAqIHRoaXMubVswXVsxXSArXHJcbiAgICAgICAgICAgICAgICBWLnkgKiB0aGlzLm1bMV1bMV0gK1xyXG4gICAgICAgICAgICAgICAgVi56ICogdGhpcy5tWzJdWzFdICtcclxuICAgICAgICAgICAgICAgIHRoaXMubVszXVsxXSxcclxuICAgICAgICAgICAgVi54ICogdGhpcy5tWzBdWzJdICtcclxuICAgICAgICAgICAgICAgIFYueSAqIHRoaXMubVsxXVsyXSArXHJcbiAgICAgICAgICAgICAgICBWLnogKiB0aGlzLm1bMl1bMl0gK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tWzNdWzJdXHJcbiAgICAgICAgKTtcclxuICAgIH0gLy8gRW5kIG9mICd0cmFuc2Zvcm1Qb2ludCcgZnVuY3Rpb25cclxuXHJcbiAgICB0b0FycmF5KCkge1xyXG4gICAgICAgIHJldHVybiBbXS5jb25jYXQoLi4udGhpcy5tKTtcclxuICAgIH0gLy8gRW5kIG9mICd0b0FycmF5JyBmdW5jdGlvblxyXG59IC8vIEVuZCBvZiAnX21hdDQnIGNsYXNzXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWF0NCguLi5hcmdzKSB7XHJcbiAgICByZXR1cm4gbmV3IF9tYXQ0KC4uLmFyZ3MpO1xyXG59IC8vIEVuZCBvZiAnbWF0NCcgZnVuY3Rpb25cclxuIiwiaW1wb3J0IHsgbWF0NCwgdmVjMyB9IGZyb20gXCIuL21hdDQuanNcIjtcclxuZXhwb3J0IHsgbWF0NCwgdmVjMyB9O1xyXG5cclxuY2xhc3MgX2NhbWVyYSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAvLyBQcm9qZWN0aW9uIHByb3BlcnRpZXNcclxuICAgICAgICB0aGlzLnByb2pTaXplID0gMC4xOyAvLyBQcm9qZWN0IHBsYW5lIGZpdCBzcXVhcmVcclxuICAgICAgICB0aGlzLnByb2pEaXN0ID0gMC4xOyAvLyBEaXN0YW5jZSB0byBwcm9qZWN0IHBsYW5lIGZyb20gdmlld2VyIChuZWFyKVxyXG4gICAgICAgIHRoaXMucHJvakZhckNsaXAgPSAxODAwOyAvLyBEaXN0YW5jZSB0byBwcm9qZWN0IGZhciBjbGlwIHBsYW5lIChmYXIpXHJcblxyXG4gICAgICAgIC8vIExvY2FsIHNpemUgZGF0YVxyXG4gICAgICAgIHRoaXMuZnJhbWVXID0gMzA7IC8vIEZyYW1lIHdpZHRoXHJcbiAgICAgICAgdGhpcy5mcmFtZUggPSAzMDsgLy8gRnJhbWUgaGVpZ2h0XHJcblxyXG4gICAgICAgIC8vIE1hdHJpY2VzXHJcbiAgICAgICAgdGhpcy5tYXRyVmlldyA9IG1hdDQoKTsgLy8gVmlldyBjb29yZGluYXRlIHN5c3RlbSBtYXRyaXhcclxuICAgICAgICB0aGlzLm1hdHJQcm9qID0gbWF0NCgpOyAvLyBQcm9qZWN0aW9uIGNvb3JkaW5hdGUgc3lzdGVtIG1hdHJpeFxyXG4gICAgICAgIHRoaXMubWF0clZQID0gbWF0NCgpOyAvLyBWaWV3IGFuZCBwcm9qZWN0aW9uIG1hdHJpeCBwcmVjYWxjdWxhdGUgdmFsdWVcclxuXHJcbiAgICAgICAgLy8gU2V0IGNhbWVyYSBkZWZhdWx0IHNldHRpbmdzXHJcbiAgICAgICAgdGhpcy5sb2MgPSB2ZWMzKCk7IC8vIENhbWVyYSBsb2NhdGlvblxyXG4gICAgICAgIHRoaXMuYXQgPSB2ZWMzKCk7IC8vIENhbWVyYSBkZXN0aW5hdGlvblxyXG4gICAgICAgIHRoaXMuZGlyID0gdmVjMygpOyAvLyBDYW1lcmEgRGlyZWN0aW9uXHJcbiAgICAgICAgdGhpcy51cCA9IHZlYzMoKTsgLy8gQ2FtZXJhIFVQIGRpcmVjdGlvblxyXG4gICAgICAgIHRoaXMucmlnaHQgPSB2ZWMzKCk7IC8vIENhbWVyYSBSSUdIVCBkaXJlY3Rpb25cclxuICAgICAgICB0aGlzLnNldERlZigpO1xyXG4gICAgfSAvLyBFbmQgb2YgJ2NvbnN0cnVjdG9yJyBmdW5jdGlvblxyXG5cclxuICAgIC8vIENhbWVyYSBwYXJtZXRlcnMgc2V0dGluZyBmdW5jdGlvblxyXG4gICAgc2V0KGxvYywgYXQsIHVwKSB7XHJcbiAgICAgICAgdGhpcy5tYXRyVmlldy5zZXRWaWV3KGxvYywgYXQsIHVwKTtcclxuICAgICAgICB0aGlzLmxvYyA9IHZlYzMobG9jKTtcclxuICAgICAgICB0aGlzLmF0ID0gdmVjMyhhdCk7XHJcbiAgICAgICAgdGhpcy5kaXIuc2V0KFxyXG4gICAgICAgICAgICAtdGhpcy5tYXRyVmlldy5tWzBdWzJdLFxyXG4gICAgICAgICAgICAtdGhpcy5tYXRyVmlldy5tWzFdWzJdLFxyXG4gICAgICAgICAgICAtdGhpcy5tYXRyVmlldy5tWzJdWzJdXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnVwLnNldChcclxuICAgICAgICAgICAgdGhpcy5tYXRyVmlldy5tWzBdWzFdLFxyXG4gICAgICAgICAgICB0aGlzLm1hdHJWaWV3Lm1bMV1bMV0sXHJcbiAgICAgICAgICAgIHRoaXMubWF0clZpZXcubVsyXVsxXVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5yaWdodC5zZXQoXHJcbiAgICAgICAgICAgIHRoaXMubWF0clZpZXcubVswXVswXSxcclxuICAgICAgICAgICAgdGhpcy5tYXRyVmlldy5tWzFdWzBdLFxyXG4gICAgICAgICAgICB0aGlzLm1hdHJWaWV3Lm1bMl1bMF1cclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMubWF0clZQID0gbWF0NCh0aGlzLm1hdHJWaWV3KS5tdWwodGhpcy5tYXRyUHJvaik7XHJcbiAgICB9IC8vIEVuZCBvZiAnc2V0JyBmdW5jdGlvblxyXG5cclxuICAgIC8vIFByb2plY3Rpb24gcGFyYW1ldGVycyBzZXR0aW5nIGZ1bmN0aW9uLlxyXG4gICAgc2V0UHJvaihwcm9qU2l6ZSwgcHJvakRpc3QsIHByb2pGYXJDbGlwKSB7XHJcbiAgICAgICAgbGV0IHJ4ID0gcHJvalNpemUsXHJcbiAgICAgICAgICAgIHJ5ID0gcHJvalNpemU7XHJcblxyXG4gICAgICAgIHRoaXMucHJvakRpc3QgPSBwcm9qRGlzdDtcclxuICAgICAgICB0aGlzLnByb2pTaXplID0gcHJvalNpemU7XHJcbiAgICAgICAgdGhpcy5wcm9qRmFyQ2xpcCA9IHByb2pGYXJDbGlwO1xyXG5cclxuICAgICAgICAvLyBDb3JyZWN0IGFzcGVjdCByYXRpb1xyXG4gICAgICAgIGlmICh0aGlzLmZyYW1lVyA+IHRoaXMuZnJhbWVIKSByeCAqPSB0aGlzLmZyYW1lVyAvIHRoaXMuZnJhbWVIO1xyXG4gICAgICAgIGVsc2UgcnkgKj0gdGhpcy5mcmFtZUggLyB0aGlzLmZyYW1lVztcclxuICAgICAgICB0aGlzLm1hdHJQcm9qLnNldEZydXN0dW0oXHJcbiAgICAgICAgICAgIC1yeCAvIDIuMCxcclxuICAgICAgICAgICAgcnggLyAyLjAsXHJcbiAgICAgICAgICAgIC1yeSAvIDIuMCxcclxuICAgICAgICAgICAgcnkgLyAyLjAsXHJcbiAgICAgICAgICAgIHByb2pEaXN0LFxyXG4gICAgICAgICAgICBwcm9qRmFyQ2xpcFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIHByZS1jYWxjdWxhdGUgdmlldyAqIHByb2ogbWF0cml4XHJcbiAgICAgICAgdGhpcy5tYXRyVlAgPSBtYXQ0KHRoaXMubWF0clZpZXcpLm11bCh0aGlzLm1hdHJQcm9qKTtcclxuICAgIH0gLy8gRW5kIG9mICdzZXRQcm9qJyBmdW5jdGlvblxyXG5cclxuICAgIC8vIFJlc2l6ZSBjYW1lcmEgYW5kIHByb2plY3Rpb24gZnVuY3Rpb24uXHJcbiAgICBzZXRTaXplKGZyYW1lVywgZnJhbWVIKSB7XHJcbiAgICAgICAgaWYgKGZyYW1lVyA8IDEpIGZyYW1lVyA9IDE7XHJcbiAgICAgICAgaWYgKGZyYW1lSCA8IDEpIGZyYW1lSCA9IDE7XHJcbiAgICAgICAgdGhpcy5mcmFtZVcgPSBmcmFtZVc7XHJcbiAgICAgICAgdGhpcy5mcmFtZUggPSBmcmFtZUg7XHJcbiAgICAgICAgLy8gUmVzZXQgcHJvamVjdGlvbiB3aXRoIG5ldyByZW5kZXIgd2luZG93IHNpemVcclxuICAgICAgICB0aGlzLnNldFByb2oodGhpcy5wcm9qU2l6ZSwgdGhpcy5wcm9qRGlzdCwgdGhpcy5wcm9qRmFyQ2xpcCk7XHJcbiAgICB9IC8vIEVuZCBvZiAnc2V0U2l6ZScgZnVuY3Rpb25cclxuXHJcbiAgICAvLyBDYW1lcmEgc2V0IGRlZmF1bHQgdmFsdWVzIGZ1bmN0aW9uLlxyXG4gICAgc2V0RGVmKCkge1xyXG4gICAgICAgIHRoaXMubG9jLnNldCgwLCAwLCA4KTtcclxuICAgICAgICB0aGlzLmF0LnNldCgwLCAwLCAwKTtcclxuICAgICAgICB0aGlzLmRpci5zZXQoMCwgMCwgLTEpO1xyXG4gICAgICAgIHRoaXMudXAuc2V0KDAsIDEsIDApO1xyXG4gICAgICAgIHRoaXMucmlnaHQuc2V0KDEsIDAsIDApO1xyXG5cclxuICAgICAgICB0aGlzLnByb2pEaXN0ID0gMC4xO1xyXG4gICAgICAgIHRoaXMucHJvalNpemUgPSAwLjE7XHJcbiAgICAgICAgdGhpcy5wcm9qRmFyQ2xpcCA9IDE4MDA7XHJcblxyXG4gICAgICAgIHRoaXMuZnJhbWVXID0gMzA7XHJcbiAgICAgICAgdGhpcy5mcmFtZUggPSAzMDtcclxuXHJcbiAgICAgICAgdGhpcy5zZXQodGhpcy5sb2MsIHRoaXMuYXQsIHRoaXMudXApO1xyXG4gICAgICAgIHRoaXMuc2V0UHJvaih0aGlzLnByb2pTaXplLCB0aGlzLnByb2pEaXN0LCB0aGlzLnByb2pGYXJDbGlwKTtcclxuICAgICAgICB0aGlzLnNldFNpemUodGhpcy5mcmFtZVcsIHRoaXMuZnJhbWVIKTtcclxuICAgIH0gLy8gRW5kIG9mICdzZXREZWYnIGZ1bmN0aW9uXHJcbn0gLy8gRW5kIG9mICdjYW1lcmEnIGNsYXNzXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2FtZXJhKC4uLmFyZ3MpIHtcclxuICAgIHJldHVybiBuZXcgX2NhbWVyYShhcmdzKTtcclxufSAvLyBFbmQgb2YgJ21hdDQnIGZ1bmN0aW9uXHJcbiIsImltcG9ydCB7IHZlYzMgfSBmcm9tIFwiLi4vbWF0aC92ZWMzLmpzXCI7XHJcbmltcG9ydCB7IG1hdDQgfSBmcm9tIFwiLi4vbWF0aC9tYXQ0LmpzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJpbSB7XHJcbiAgICBjb25zdHJ1Y3RvcihnbCwgcHJvZywgc2NhbGUsIFYsIG51bU9mViwgSSwgbnVtT2ZJLCB0eXBlLCB0ZXhBcnJheSkge1xyXG4gICAgICAgIHRoaXMuViA9IFY7XHJcbiAgICAgICAgdGhpcy52QSA9IDA7IC8vIE9wZW5HTCB2ZXJ0ZXggYXJyYXkgSWRcclxuICAgICAgICB0aGlzLnZCdWZJZCA9IDA7IC8vIE9wZW5HTCB2ZXJ0ZXggYnVmZmVyIElkXHJcbiAgICAgICAgdGhpcy5pQnVmSWQgPSAwOyAvLyBPcGVuR0wgaW5kZXggYnVmZmVyIElkXHJcbiAgICAgICAgdGhpcy5udW1PZkVsZW1lbnRzID0gMDsgLy8gTnVtYmVyIG9mIGVsZW1lbnRzXHJcbiAgICAgICAgdGhpcy50ZXggPSB0ZXhBcnJheTtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMudHJhbnMgPSBuZXcgbWF0NCgpOyAvLyBBZGRpdGlvbmFsIHRyYW5zZm9ybWF0aW9uIG1hdHJpeFxyXG4gICAgICAgIHRoaXMuc2NhbGUgPSBzY2FsZTtcclxuXHJcbiAgICAgICAgaWYgKFYgIT0gdW5kZWZpbmVkICYmIG51bU9mViAhPSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMudkJ1ZklkID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMudkEgPSBnbC5jcmVhdGVWZXJ0ZXhBcnJheSgpO1xyXG4gICAgICAgICAgICBjb25zdCB2U2l6ZSA9IFYuQllURVNfUEVSX0VMRU1FTlQ7XHJcblxyXG4gICAgICAgICAgICBnbC5iaW5kVmVydGV4QXJyYXkodGhpcy52QSk7XHJcblxyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy52QnVmSWQpO1xyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxyXG4gICAgICAgICAgICAgICAgVi5sZW5ndGggKiB2U2l6ZSAqIDQsXHJcbiAgICAgICAgICAgICAgICBnbC5TVEFUSUNfRFJBV1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBnbC5idWZmZXJTdWJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgMCwgVik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwb3NMb2MgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9nLCBcImluX3Bvc1wiKTtcclxuICAgICAgICAgICAgY29uc3QgdGV4TG9jID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZywgXCJpbl90ZXhcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vcm1Mb2MgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9nLCBcImluX25cIik7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbExvYyA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2csIFwiaW5fY29sXCIpO1xyXG5cclxuICAgICAgICAgICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihwb3NMb2MsIDMsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcbiAgICAgICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHBvc0xvYyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBvc0xvYyk7XHJcbiAgICAgICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGV4TG9jLCAyLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDEyKTtcclxuICAgICAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGV4TG9jKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codGV4TG9jKTtcclxuICAgICAgICAgICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihub3JtTG9jLCAzLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDIwKTtcclxuICAgICAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkobm9ybUxvYyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG5vcm1Mb2MpO1xyXG4gICAgICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGNvbExvYywgNCwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAzMik7XHJcbiAgICAgICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGNvbExvYyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbExvYyk7XHJcbiAgICAgICAgICAgIGdsLmJpbmRWZXJ0ZXhBcnJheShudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChJICE9IHVuZGVmaW5lZCAmJiBudW1PZkkgIT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmlCdWZJZCA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmlCdWZJZCk7XHJcbiAgICAgICAgICAgIGdsLmJ1ZmZlckRhdGEoXHJcbiAgICAgICAgICAgICAgICBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUixcclxuICAgICAgICAgICAgICAgIEkubGVuZ3RoICogNCxcclxuICAgICAgICAgICAgICAgIGdsLlNUQVRJQ19EUkFXXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIDAsIEkpO1xyXG4gICAgICAgICAgICB0aGlzLm51bU9mRWxlbWVudHMgPSBudW1PZkk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5udW1PZkVsZW1lbnRzID0gbnVtT2ZWO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFuZ2xlID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkRnJvbVRleHQoZ2wsIHByb2csIG9ialRleHQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIk9iaiB0ZXh0OiBcIiArIG9ialRleHQpO1xyXG4gICAgICAgIGxldCBmaWxlU3RyID0gb2JqVGV4dC5zcGxpdChcIlxcblwiKTtcclxuICAgICAgICBsZXQgViA9IFtdLFxyXG4gICAgICAgICAgICBJbmQgPSBbXTtcclxuXHJcbiAgICAgICAgLyogTG9hZCBwcmltaXRpdmUgZGF0YSAqL1xyXG4gICAgICAgIGZpbGVTdHIuZm9yRWFjaCgoaXRlbSwgaW5kZXgsIGFycmF5KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBhcnIgPSBpdGVtLnNwbGl0KFwiIFwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpdGVtWzBdID09IFwidlwiICYmIGl0ZW1bMV0gPT0gXCIgXCIpIHtcclxuICAgICAgICAgICAgICAgIFYucHVzaCgrYXJyWzFdKTtcclxuICAgICAgICAgICAgICAgIFYucHVzaCgrYXJyWzJdKTtcclxuICAgICAgICAgICAgICAgIFYucHVzaCgrYXJyWzNdKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtWzBdID09IFwiZlwiICYmIGl0ZW1bMV0gPT0gXCIgXCIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjMCA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgYzEgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGM7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY250ID0gMTsgY250IDw9IDM7IGNudCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYyA9IHBhcnNlSW50KGFycltjbnRdKSAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNudCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMwID0gYztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNudCA9PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMxID0gYztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBUcmlhbmdsZSBjb21wbGV0ZWQgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgSW5kLnB1c2goYzApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBJbmQucHVzaChjMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEluZC5wdXNoKGMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjMSA9IGM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJpbShcclxuICAgICAgICAgICAgZ2wsXHJcbiAgICAgICAgICAgIHByb2csXHJcbiAgICAgICAgICAgIDAuMSxcclxuICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShWKSxcclxuICAgICAgICAgICAgVi5sZW5ndGgsXHJcbiAgICAgICAgICAgIG5ldyBVaW50MTZBcnJheShJbmQpLFxyXG4gICAgICAgICAgICBJbmQubGVuZ3RoLFxyXG4gICAgICAgICAgICBnbC5UUklBTkdMRV9TVFJJUCxcclxuICAgICAgICAgICAgWy0xXVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhnbCwgcHJvZywgY2FtZXJhKSB7XHJcbiAgICAgICAgbGV0IG1vZGVsVmlld0xvYyA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9nLCBcIk1vZGVsVmlld1BcIik7XHJcbiAgICAgICAgY2FtZXJhLnNldFNpemUoNDAwLCA0MDApO1xyXG4gICAgICAgIGNhbWVyYS5zZXQodmVjMygxLCAyLCA4KSwgdmVjMygwLCAwLCAwKSwgdmVjMygwLCAxLCAwKSk7XHJcblxyXG4gICAgICAgIGxldCBtb2RlbFZpZXcgPSBjYW1lcmEubWF0clZQXHJcbiAgICAgICAgICAgIC5yb3RhdGUoKHRoaXMuYW5nbGUgLT0gMC4wMSksIHZlYzMoMCwgMSwgMCkpXHJcbiAgICAgICAgICAgIC5zY2FsZSh0aGlzLnNjYWxlLCB0aGlzLnNjYWxlLCB0aGlzLnNjYWxlKTtcclxuXHJcbiAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDRmdihcclxuICAgICAgICAgICAgbW9kZWxWaWV3TG9jLFxyXG4gICAgICAgICAgICBmYWxzZSxcclxuICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShtb2RlbFZpZXcudG9BcnJheSgpKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnZCdWZJZCAhPSAwKSB7XHJcbiAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnZCdWZJZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdsLmJpbmRWZXJ0ZXhBcnJheSh0aGlzLnZBKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaUJ1ZklkICE9IDApIHtcclxuICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5pQnVmSWQpO1xyXG4gICAgICAgICAgICBnbC5kcmF3RWxlbWVudHMoXHJcbiAgICAgICAgICAgICAgICBnbC5UUklBTkdMRVMsXHJcbiAgICAgICAgICAgICAgICB0aGlzLm51bU9mRWxlbWVudHMsXHJcbiAgICAgICAgICAgICAgICBnbC5VTlNJR05FRF9TSE9SVCxcclxuICAgICAgICAgICAgICAgIDBcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBnbC5kcmF3QXJyYXlzKHRoaXMudHlwZSwgMCwgdGhpcy5udW1PZkVsZW1lbnRzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50ZXgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGV4W2ldICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgaSk7XHJcbiAgICAgICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0ZXhbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaFJlc291cmNlKHJlc1VSTCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25jZSA9IGF3YWl0IGZldGNoKHJlc1VSTCk7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlc3BvbmNlLnRleHQoKTtcclxuICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgYWxlcnQoJ0Vycm9yIGZldGNoaW5nIFwiJyArIHJlc1VSTCArICdcInJlc291cmNlLCBFcnJvcjogJyArIGVycm9yKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZFNoYWRlcihnbCwgdHlwZSwgc291cmNlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkxvYWRpbmcgc2hhZGVyOiBcIiArIHR5cGUgKyBcIiBzb3VyY2U6IFwiICsgc291cmNlKTtcclxuICAgIGNvbnN0IHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcclxuXHJcbiAgICBnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzb3VyY2UpO1xyXG4gICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xyXG5cclxuICAgIGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSB7XHJcbiAgICAgICAgYWxlcnQoXCJGYWlsZWQgc2hhZGVyIGxvYWQhXFxuXCIgKyBnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpO1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc2hhZGVyO1xyXG59XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVQcm9ncmFtKHJlbmRlciwgZ2wsIGNhbnZhc0lkLCB2c1VybCwgZnNVcmwpIHtcclxuICAgIGxldCB2c1BybSA9IGZldGNoUmVzb3VyY2UodnNVcmwpO1xyXG4gICAgbGV0IGZzUHJtID0gZmV0Y2hSZXNvdXJjZShmc1VybCk7XHJcblxyXG4gICAgUHJvbWlzZS5hbGwoW3ZzUHJtLCBmc1BybV0pXHJcbiAgICAgICAgLnRoZW4oKHJlcykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdnMgPSByZXNbMF07XHJcbiAgICAgICAgICAgIGxldCBmcyA9IHJlc1sxXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHZzU2hkID0gbG9hZFNoYWRlcihnbCwgZ2wuVkVSVEVYX1NIQURFUiwgdnMpO1xyXG4gICAgICAgICAgICBjb25zdCBmc1NoZCA9IGxvYWRTaGFkZXIoZ2wsIGdsLkZSQUdNRU5UX1NIQURFUiwgZnMpO1xyXG4gICAgICAgICAgICBjb25zdCBwcm9nID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2codnMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhmcyk7XHJcblxyXG4gICAgICAgICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZywgdnNTaGQpO1xyXG4gICAgICAgICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZywgZnNTaGQpO1xyXG4gICAgICAgICAgICBnbC5saW5rUHJvZ3JhbShwcm9nKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9nLCBnbC5MSU5LX1NUQVRVUykpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRmFpbGVkIHNoYWRlciBwcm9nIGxpbmshXFxuXCIgKyBnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9nKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVuZGVyLnByb2cgPSBwcm9nO1xyXG4gICAgICAgICAgICBjb25zdCBldmVudCA9IG5ldyBFdmVudChcIlNoYWRlciBwcm9ncmFtIGxvYWRlZFwiICsgY2FudmFzSWQpO1xyXG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXZlbnQgZGlzcGF0Y2hlZFwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRmFpbGVkIGNyZWF0aW5nIHByb2dyYW0hXCIgKyBlcnIpO1xyXG4gICAgICAgIH0pO1xyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBUaW1lciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmdsb2JhbFRpbWUgPSB0aGlzLmxvY2FsVGltZSA9IHRoaXMuZ2V0VGltZSgpO1xyXG4gICAgICAgIHRoaXMuZ2xvYmFsRGVsdGFUaW1lID0gdGhpcy5sb2NhbERlbHRhVGltZSA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gdGhpcy5vbGRUaW1lID0gdGhpcy5vbGRUaW1lRlBTID0gdGhpcy5nbG9iYWxUaW1lO1xyXG4gICAgICAgIHRoaXMuZnJhbWVDb3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLmlzUGF1c2UgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLkZQUyA9IDMwLjA7XHJcbiAgICAgICAgdGhpcy5wYXVzZVRpbWUgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRpbWUoKSB7XHJcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgbGV0IHQgPVxyXG4gICAgICAgICAgICBkYXRlLmdldE1pbGxpc2Vjb25kcygpIC8gMTAwMC4wICtcclxuICAgICAgICAgICAgZGF0ZS5nZXRTZWNvbmRzKCkgK1xyXG4gICAgICAgICAgICBkYXRlLmdldE1pbnV0ZXMoKSAqIDYwO1xyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG5cclxuICAgIHJlc3BvbnNlID0gKHRhZ19pZCA9IG51bGwpID0+IHtcclxuICAgICAgICBsZXQgdCA9IHRoaXMuZ2V0VGltZSgpO1xyXG4gICAgICAgIHRoaXMuZ2xvYmFsVGltZSA9IHQ7XHJcbiAgICAgICAgdGhpcy5nbG9iYWxEZWx0YVRpbWUgPSB0IC0gdGhpcy5vbGRUaW1lO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc1BhdXNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9jYWxEZWx0YVRpbWUgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnBhdXNlVGltZSArPSB0IC0gdGhpcy5vbGRUaW1lO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9jYWxEZWx0YVRpbWUgPSB0aGlzLmdsb2JhbERlbHRhVGltZTtcclxuICAgICAgICAgICAgdGhpcy5sb2NhbFRpbWUgPSB0IC0gdGhpcy5wYXVzZVRpbWUgLSB0aGlzLnN0YXJ0VGltZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5mcmFtZUNvdW50ZXIrKztcclxuICAgICAgICBpZiAodCAtIHRoaXMub2xkVGltZUZQUyA+IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5GUFMgPSB0aGlzLmZyYW1lQ291bnRlciAvICh0IC0gdGhpcy5vbGRUaW1lRlBTKTtcclxuICAgICAgICAgICAgdGhpcy5vbGRUaW1lRlBTID0gdDtcclxuICAgICAgICAgICAgdGhpcy5mcmFtZUNvdW50ZXIgPSAwO1xyXG4gICAgICAgICAgICBpZiAodGFnX2lkICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhZ19pZCkuaW5uZXJIVE1MID0gdGhpcy5nZXRGUFMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5vbGRUaW1lID0gdDtcclxuICAgIH07XHJcbiAgICBnZXRGUFMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuRlBTLnRvRml4ZWQoMyk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgdmVjMyB9IGZyb20gXCIuLi9tYXRoL3ZlYzMuanNcIjtcclxuaW1wb3J0IHsgbWF0NCB9IGZyb20gXCIuLi9tYXRoL21hdDQuanNcIjtcclxuaW1wb3J0IHsgY2FtZXJhIH0gZnJvbSBcIi4uL21hdGgvY2FtZXJhLmpzXCI7XHJcbmltcG9ydCB7IFByaW0gfSBmcm9tIFwiLi9wcmltLmpzXCI7XHJcbmltcG9ydCAqIGFzIHJlcyBmcm9tIFwiLi9zaGFkZXIgbG9hZC5qc1wiO1xyXG5pbXBvcnQgKiBhcyB0bSBmcm9tIFwiLi90aW1lci5qc1wiO1xyXG5leHBvcnQgeyB2ZWMzLCBtYXQ0IH07XHJcblxyXG5leHBvcnQgY2xhc3MgUmVuZGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhc0lkLCB0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXNJZCA9IGNhbnZhc0lkO1xyXG4gICAgICAgIC8qKiBAdHlwZSB7V2ViR0xSZW5kZXJpbmdDb250ZXh0fSAqL1xyXG4gICAgICAgIHRoaXMuZ2wgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2wyXCIpO1xyXG5cclxuICAgICAgICAvLyB0b2RvIHNldCBjYW1lcmEgcGFyYW1zXHJcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBjYW1lcmEoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9nID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJlcy5jcmVhdGVQcm9ncmFtKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB0aGlzLmdsLFxyXG4gICAgICAgICAgICBjYW52YXNJZCxcclxuICAgICAgICAgICAgXCIuL3NoYWRlcnMvdmVydC5nbHNsXCIsXHJcbiAgICAgICAgICAgIFwiLi9zaGFkZXJzL2ZyYWcuZ2xzbFwiXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIlNoYWRlciBwcm9ncmFtIGxvYWRlZFwiICsgY2FudmFzSWQsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcm9ncmFtIGNyZWF0ZWQhIFByb2dyYW06XCIgKyB0aGlzLnByb2cpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGUgPT09IFwiY3ViZVwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRDdWJlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHR5cGUgPT09IFwib2JqXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZE9iaihcInJlc291cmNlcy9jb3cub2JqXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiTW9kZWwgbG9hZGVkXCIgKyBjYW52YXNJZCwgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1vZGVsIGNyZWF0ZWQhXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2wuZW5hYmxlKHRoaXMuZ2wuQ1VMTF9GQUNFKTtcclxuICAgICAgICB0aGlzLmdsLmN1bGxGYWNlKHRoaXMuZ2wuRlJPTlQpO1xyXG4gICAgICAgIHRoaXMuZ2wuZW5hYmxlKHRoaXMuZ2wuREVQVEhfVEVTVCk7XHJcblxyXG4gICAgICAgIHRoaXMudGltZXIgPSBuZXcgdG0uVGltZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkQ3ViZSgpIHtcclxuICAgICAgICB0aGlzLnBvc0xvYyA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5wcm9nLCBcImluX3Bvc1wiKTtcclxuICAgICAgICB0aGlzLnBvc0J1ZiA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XHJcblxyXG4gICAgICAgIC8vIEN1YmUgcG9zaXRpb25zLlxyXG4gICAgICAgIGxldCBzcXJ0MjIgPSBNYXRoLnNxcnQoMikgLyAyO1xyXG4gICAgICAgIGNvbnN0IGN1YmVWZXJ0ZXhQb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KFtcclxuICAgICAgICAgICAgLXNxcnQyMixcclxuICAgICAgICAgICAgLXNxcnQyMixcclxuICAgICAgICAgICAgc3FydDIyLCAvLzBcclxuICAgICAgICAgICAgc3FydDIyLFxyXG4gICAgICAgICAgICAtc3FydDIyLFxyXG4gICAgICAgICAgICBzcXJ0MjIsIC8vMVxyXG4gICAgICAgICAgICAtc3FydDIyLFxyXG4gICAgICAgICAgICBzcXJ0MjIsXHJcbiAgICAgICAgICAgIHNxcnQyMiwgLy8yXHJcbiAgICAgICAgICAgIHNxcnQyMixcclxuICAgICAgICAgICAgc3FydDIyLFxyXG4gICAgICAgICAgICBzcXJ0MjIsIC8vM1xyXG4gICAgICAgICAgICAtc3FydDIyLFxyXG4gICAgICAgICAgICAtc3FydDIyLFxyXG4gICAgICAgICAgICAtc3FydDIyLCAvLzRcclxuICAgICAgICAgICAgc3FydDIyLFxyXG4gICAgICAgICAgICAtc3FydDIyLFxyXG4gICAgICAgICAgICAtc3FydDIyLCAvLzVcclxuICAgICAgICAgICAgLXNxcnQyMixcclxuICAgICAgICAgICAgc3FydDIyLFxyXG4gICAgICAgICAgICAtc3FydDIyLCAvLzZcclxuICAgICAgICAgICAgc3FydDIyLFxyXG4gICAgICAgICAgICBzcXJ0MjIsXHJcbiAgICAgICAgICAgIC1zcXJ0MjIsIC8vN1xyXG4gICAgICAgIF0pO1xyXG4gICAgICAgIGNvbnN0IGN1YmVWZXJ0ZXhJbmRpY2VzID0gbmV3IFVpbnQxNkFycmF5KFtcclxuICAgICAgICAgICAgLy9Ub3BcclxuICAgICAgICAgICAgNywgNiwgMiwgMiwgMywgNyxcclxuICAgICAgICAgICAgLy9Cb3R0b21cclxuICAgICAgICAgICAgMCwgNCwgNSwgNSwgMSwgMCxcclxuICAgICAgICAgICAgLy9MZWZ0XHJcbiAgICAgICAgICAgIDAsIDIsIDYsIDYsIDQsIDAsXHJcbiAgICAgICAgICAgIC8vUmlnaHRcclxuICAgICAgICAgICAgNywgMywgMSwgMSwgNSwgNyxcclxuICAgICAgICAgICAgLy9Gcm9udFxyXG4gICAgICAgICAgICAzLCAyLCAwLCAwLCAxLCAzLFxyXG4gICAgICAgICAgICAvL0JhY2tcclxuICAgICAgICAgICAgNCwgNiwgNywgNywgNSwgNCxcclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgdGhpcy5wciA9IG5ldyBQcmltKFxyXG4gICAgICAgICAgICB0aGlzLmdsLFxyXG4gICAgICAgICAgICB0aGlzLnByb2csXHJcbiAgICAgICAgICAgIDAuMyxcclxuICAgICAgICAgICAgY3ViZVZlcnRleFBvc2l0aW9ucyxcclxuICAgICAgICAgICAgOCxcclxuICAgICAgICAgICAgY3ViZVZlcnRleEluZGljZXMsXHJcbiAgICAgICAgICAgIDM2LFxyXG4gICAgICAgICAgICB0aGlzLmdsLlRSSUFOR0xFX1NUUklQLFxyXG4gICAgICAgICAgICBbLTFdXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgRXZlbnQoXCJNb2RlbCBsb2FkZWRcIiArIHRoaXMuY2FudmFzSWQpO1xyXG4gICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkT2JqKG1vZGVsVVJMKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkUHIgPSBuZXcgUHJpbSgpO1xyXG4gICAgICAgIHJlcy5mZXRjaFJlc291cmNlKG1vZGVsVVJMKS50aGVuKChyZXMpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wciA9IHRoaXMubG9hZFByLmxvYWRGcm9tVGV4dCh0aGlzLmdsLCB0aGlzLnByb2csIHJlcyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gbmV3IEV2ZW50KFwiTW9kZWwgbG9hZGVkXCIgKyB0aGlzLmNhbnZhc0lkKTtcclxuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIGNvbnN0IGRyYXcgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5sb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQgfCB0aGlzLmdsLkRFUFRIX0JVRkZFUl9CSVQpO1xyXG4gICAgICAgICAgICB0aGlzLmdsLnVzZVByb2dyYW0odGhpcy5wcm9nKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucHIuZHJhdyh0aGlzLmdsLCB0aGlzLnByb2csIHRoaXMuY2FtZXJhKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGltZXIucmVzcG9uc2UoXCJmcHMgd2luZG93XCIpO1xyXG5cclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZSgpIHt9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgcm5kIGZyb20gXCIuL2pzL3JlbmRlciBzeXN0ZW0vcmVuZGVyLmpzXCI7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG4gICAgbmV3IHJuZC5SZW5kZXIoXCJjdWJlIGNhbnZhc1wiLCBcImN1YmVcIikuc3RhcnQoKTtcclxuICAgIG5ldyBybmQuUmVuZGVyKFwib2JqIGNhbnZhc1wiLCBcIm9ialwiKS5zdGFydCgpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbInJlcy5jcmVhdGVQcm9ncmFtIiwidG0uVGltZXIiLCJyZXMuZmV0Y2hSZXNvdXJjZSIsInJuZC5SZW5kZXIiXSwibWFwcGluZ3MiOiI7OztJQUFBLE1BQU0sS0FBSyxDQUFDO0lBQ1osSUFBSSxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDekIsUUFBUSxJQUFJLENBQUMsSUFBSSxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMs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LENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzdCLGdCQUFnQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM3QixnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDN0IsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVCLGFBQWEsQ0FBQztJQUNkLFlBQVksT0FBTyxJQUFJLENBQUM7SUFDeEIsU0FBUyxDQUFDLENBQUM7SUFDWCxRQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsS0FBSztJQUNoRCxZQUFZLElBQUksT0FBTyxDQUFDLElBQUksUUFBUSxFQUFFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFFLFlBQVksT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDMUMsU0FBUyxDQUFDLENBQUM7SUFDWCxRQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLO0lBQ3RELFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNyQixnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDN0IsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzdCLGdCQUFnQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM3QixnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUIsYUFBYSxDQUFDLENBQUM7SUFDZixZQUFZLE9BQU8sSUFBSSxDQUFDO0lBQ3hCLFNBQVMsQ0FBQyxDQUFDO0lBQ1gsUUFBUSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUs7SUFDN0MsWUFBWSxJQUFJLE9BQU8sQ0FBQyxJQUFJLFFBQVEsRUFBRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RSxZQUFZLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLFNBQVMsQ0FBQyxDQUFDO0lBQ1gsS0FBSztBQUNMO0lBQ0EsSUFBSSxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUMsRUFBRTtJQUNoQyxRQUFRLElBQUksQ0FBQyxHQUFHLGFBQWEsR0FBRyxJQUFJLENBQUMsRUFBRTtJQUN2QyxZQUFZLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM5QixZQUFZLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNqQixZQUFZLENBQUMsR0FBRyxDQUFDO0lBQ2pCLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsQixRQUFRLElBQUksT0FBTyxDQUFDLElBQUksUUFBUTtJQUNoQyxZQUFZLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakQ7SUFDQSxRQUFRLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLFFBQVEsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2hDLFlBQVksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZFLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7SUFDckQsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDdkQsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDdkQsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QixRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUN2RCxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDO0lBQ3JELFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3ZELFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekIsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDdkQsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDdkQsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztJQUNyRCxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekIsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6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QUFDLENBQUM7SUFDN0Msb0JBQW9CLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxvQkFBb0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekMsb0JBQW9CLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxvQkFBb0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLG9CQUFvQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0MsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QyxvQkFBb0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLG9CQUFvQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0Msb0JBQW9CLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pDLG9CQUFvQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0Msb0JBQW9CLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxvQkFBb0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLGFBQWE7SUFDYixZQUFZO0lBQ1osZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QyxvQkFBb0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLG9CQUFvQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0Msb0JBQW9CLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pDLG9CQUFvQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0Msb0JBQW9CLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxvQkFBb0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekMsb0JBQW9CLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxvQkFBb0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLG9CQUFvQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0MsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QyxvQkFBb0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLG9CQUFvQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0Msb0JBQW9CLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxhQUFhO0lBQ2IsWUFBWTtJQUNaLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekMsb0JBQW9CLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxvQkFBb0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLG9CQUFvQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0MsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QyxvQkFBb0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLG9CQUFvQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0Msb0JBQW9CLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pDLG9CQUFvQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0Msb0JBQW9CLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxvQkFBb0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekMsb0JBQW9CLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxvQkFBb0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLG9CQUFvQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FB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Q0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2YsWUFBWSxJQUFJLENBQUMsU0FBUztJQUMxQixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixhQUFhLEdBQUcsR0FBRyxDQUFDO0lBQ3BCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNmLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUztJQUMzQixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixhQUFhLEdBQUcsR0FBRyxDQUFDO0lBQ3BCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNmLFlBQVksSUFBSSxDQUFDLFNBQVM7SUFDMUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsYUFBYSxHQUFHLEdBQUcsQ0FBQztJQUNwQixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZixZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVM7SUFDM0IsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsYUFBYSxHQUFHLEdBQUcsQ0FBQztBQUNwQjtJQUNBLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNmLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUztJQUMzQixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixhQUFhLEdBQUcsR0FBRyxDQUFDO0lBQ3BCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNmLFlBQVksSUFBSSxDQUFDLFNBQVM7SUFDMUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsYUFBYSxHQUFHLEdBQUcsQ0FBQztJQUNwQixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZixZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVM7SUFDM0IsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsYUFBYSxHQUFHLEdBQUcsQ0FBQztJQUNwQixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZixZQUFZLElBQUksQ0FBQyxTQUFTO0lBQzFCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGFBQWEsR0FBRyxHQUFHLENBQUM7QUFDcEI7SUFDQSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZixZQUFZLElBQUksQ0FBQyxTQUFTO0lBQzFCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGFBQWEsR0FBRyxHQUFHLENBQUM7SUFDcEIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2YsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTO0lBQzNCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGFBQWEsR0FBRyxHQUFHLENBQUM7SUFDcEIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2YsWUFBWSxJQUFJLENBQUMsU0FBUztJQUMxQixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixhQUFhLEdBQUcsR0FBRyxDQUFDO0lBQ3BCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNmLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUztJQUMzQixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixhQUFhLEdBQUcsR0FBRyxDQUFDO0FBQ3BCO0lBQ0EsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2YsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTO0lBQzNCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGFBQWEsR0FBRyxHQUFHLENBQUM7QUFDcEI7SUFDQSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZixZQUFZLElBQUksQ0FBQyxTQUFTO0lBQzFCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGFBQWEsR0FBRyxHQUFHLENBQUM7SUFDcEIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2YsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTO0lBQzNCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGFBQWEsR0FBRyxHQUFHLENBQUM7SUFDcEIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2YsWUFBWSxJQUFJLENBQUMsU0FBUztJQUMxQixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLGdCQUFnQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FB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QUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLFFBQVEsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsUUFBUSxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMzQixRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRztJQUNwQixZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxTQUFTLENBQUM7SUFDVixRQUFRLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRztJQUNuQixZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxTQUFTLENBQUM7SUFDVixRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRztJQUN0QixZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxT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QVksSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxRDtJQUNBLFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDOUM7SUFDQSxZQUFZLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQyxTQUFTLENBQUM7SUFDVixRQUFRLElBQUksRUFBRSxDQUFDO0lBQ2YsS0FBSztBQUNMO0lBQ0EsSUFBSSxLQUFLLEdBQUcsRUFBRTtJQUNkOztJQzVJQSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE1BQU07SUFDdEMsSUFBSSxJQUFJQyxNQUFVLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2xELElBQUksSUFBSUEsTUFBVSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNoRCxDQUFDLENBQUM7Ozs7OzsifQ==
