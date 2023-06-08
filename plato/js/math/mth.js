export function d2r(deg) {
    return (deg * Math.PI) / 180.0;
}

export function rd2(r) {
    return (deg * 180.0) / Math.PI;
}

export class vec3 {
    constructor(x, y = undefined, z = undefined) {
        console.log("X: " + x);
        console.log("Y: " + y);
        console.log("Z: " + z);

        if (x == undefined) {
            this.x = this.y = this.z = 0;
        } else if (typeof x == "object") {
            if (x.length == 3) {
                [this.x, this.y, this.z] = x;
            } else {
                this.x = x.x;
                this.y = x.y;
                this.z = x.z;
            }
        } else if (y == undefined && z == undefined) {
            this.x = this.y = this.z = x;
        } else {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }

    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v) {
        return new vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    sub(v) {
        return new vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    mul(n) {
        return new vec3(this.x * n, this.y * n, this.z * n);
    }

    div(n) {
        return new vec3(this.x / n, this.y / n, this.z / n);
    }

    cross(v) {
        return new vec3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }

    len() {
        return Math.sqrt(this.dot(this));
    }

    len2() {
        return this.dot(this);
    }

    norm() {
        return this.div(this.len());
    }

    normalize() {
        return this.div(this.len());
    }

    toArray() {
        return [this.x, this.y, this.z];
    }
}

export class mat4 {
    constructor(m) {
        if (m == null) {
            this.m = [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1],
            ];
        } else if (typeof m == "object" && m.length == 4) {
            this.m = m;
        } else if (typeof m == "number") {
            this.m = arguments;
        } else {
            this.m = m.m;
        }
    }

    translate(v) {
        if (v.length == 4)
            return new mat4([
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [v[0], v[1], v[2], 1],
            ]);
        else
            return new mat4([
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [v.x, v.y, v.z, 1],
            ]);
    }

    scale(v) {
        if (v.length == 4) {
            return new mat4([
                [v[0], 0, 0, 0],
                [0, v[1], 0, 0],
                [0, v[2], 1, 0],
                [0, 0, 0, 1],
            ]);
        } else {
            return new mat4([
                [v.x, 0, 0, 0],
                [v.y, 1, 0, 0],
                [v.z, 0, 1, 0],
                [0, 0, 0, 1],
            ]);
        }
    }

    rotateX(a) {
        let ra = d2r(a);
        let si = Math.sin(ra);
        let co = Math.cos(ra);

        return new mat4([
            [1, 0, 0, 0],
            [0, co, si, 0],
            [0, -si, co, 0],
            [0, 0, 0, 1],
        ]);
    }

    rotateY(a) {
        let ra = d2r(a);
        let si = Math.sin(ra);
        let co = Math.cos(ra);

        return new mat4([
            [co, 0, -si, 0],
            [0, 1, 0, 0],
            [si, 0, co, 0],
            [0, 0, 0, 1],
        ]);
    }

    rotateZ(a) {
        let ra = d2r(a);
        let si = Math.sin(ra);
        let co = Math.cos(ra);

        return new mat4([
            [co, 0, -si, 0],
            [0, 1, 0, 0],
            [si, 0, co, 0],
            [0, 0, 0, 1],
        ]);
    }

    rotateV(a, V) {
        let ra = d2r(a);
        let si = Math.sin(ra);
        let co = Math.cos(ra);

        console.log("Ra: " + ra);
        console.log("Si: " + si);
        console.log("Co: " + co);
        V = V.normalize();
        let mat = new mat4([
            [co + V.x * V.x * (1 - co), V.x * V.y * (1 - co) + V.z * si, V.x * V.z * (1 - co) - V.y * si, 0],
            [V.y * V.x * (1 - co) - V.z * si, co + V.y * V.y * (1 - co), V.y * V.z * (1 - co) + V.x * si, 0],
            [V.z * V.x * (1 - co) + V.y * si, V.z * V.y * (1 - co) - V.x * si, co + V.z * V.z * (1 - co), 0],
            [0, 0, 0, 1],
        ]);
        console.log(mat);
        return mat;
    }

    transpose() {
        return new mat4([
            [this.m.m[0][0], this.m.m[1][0], this.m.m[2][0], this.m.m[3][0]],
            [this.m.m[0][1], this.m.m[1][1], this.m.m[2][1], this.m.m[3][1]],
            [this.m.m[0][2], this.m.m[1][2], this.m.m[2][2], this.m.m[3][2]],
            [this.m.m[0][3], this.m.m[1][3], this.m.m[2][3], this.m.m[3][3]],
        ]);
    }

    mul(m) {
        let matr;
        if (m.length == 4) matr = m;
        else matr = m.m;
        this.m = [
            [
                this.m[0][0] * matr[0][0] + this.m[0][1] * matr[1][0] + this.m[0][2] * matr[2][0] + this.m[0][3] * matr[3][0],
                this.m[0][0] * matr[0][1] + this.m[0][1] * matr[1][1] + this.m[0][2] * matr[2][1] + this.m[0][3] * matr[3][1],
                this.m[0][0] * matr[0][2] + this.m[0][1] * matr[1][2] + this.m[0][2] * matr[2][2] + this.m[0][3] * matr[3][2],
                this.m[0][0] * matr[0][3] + this.m[0][1] * matr[1][3] + this.m[0][2] * matr[2][3] + this.m[0][3] * matr[3][3],
            ],
            [
                this.m[1][0] * matr[0][0] + this.m[1][1] * matr[1][0] + this.m[1][2] * matr[2][0] + this.m[1][3] * matr[3][0],
                this.m[1][0] * matr[0][1] + this.m[1][1] * matr[1][1] + this.m[1][2] * matr[2][1] + this.m[1][3] * matr[3][1],
                this.m[1][0] * matr[0][2] + this.m[1][1] * matr[1][2] + this.m[1][2] * matr[2][2] + this.m[1][3] * matr[3][2],
                this.m[1][0] * matr[0][3] + this.m[1][1] * matr[1][3] + this.m[1][2] * matr[2][3] + this.m[1][3] * matr[3][3],
            ],
            [
                this.m[2][0] * matr[0][0] + this.m[2][1] * matr[1][0] + this.m[2][2] * matr[2][0] + this.m[2][3] * matr[3][0],
                this.m[2][0] * matr[0][1] + this.m[2][1] * matr[1][1] + this.m[2][2] * matr[2][1] + this.m[2][3] * matr[3][1],
                this.m[2][0] * matr[0][2] + this.m[2][1] * matr[1][2] + this.m[2][2] * matr[2][2] + this.m[2][3] * matr[3][2],
                this.m[2][0] * matr[0][3] + this.m[2][1] * matr[1][3] + this.m[2][2] * matr[2][3] + this.m[2][3] * matr[3][3],
            ],
            [
                this.m[3][0] * matr[0][0] + this.m[3][1] * matr[1][0] + this.m[3][2] * matr[2][0] + this.m[3][3] * matr[3][0],
                this.m[3][0] * matr[0][1] + this.m[3][1] * matr[1][1] + this.m[3][2] * matr[2][1] + this.m[3][3] * matr[3][1],
                this.m[3][0] * matr[0][2] + this.m[3][1] * matr[1][2] + this.m[3][2] * matr[2][2] + this.m[3][3] * matr[3][2],
                this.m[3][0] * matr[0][3] + this.m[3][1] * matr[1][3] + this.m[3][2] * matr[2][3] + this.m[3][3] * matr[3][3],
            ],
        ];
        return this;
    }

    determ() {
        let det =
            this.m[0][0] * this.determ3x3(this.m[1][1], this.m[1][2], this.m[1][3], this.m[2][1], this.m[2][2], this.m[2][3], this.m[3][1], this.m[3][2], this.m[3][3]) -
            this.m[0][1] * this.determ3x3(this.m[1][0], this.m[1][2], this.m[1][3], this.m[2][0], this.m[2][2], this.m[2][3], this.m[3][0], this.m[3][2], this.m[3][3]) +
            this.m[0][2] * this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][3], this.m[2][0], this.m[2][1], this.m[2][3], this.m[3][0], this.m[3][1], this.m[3][3]) -
            this.m[0][3] * this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][2], this.m[2][0], this.m[2][1], this.m[2][2], this.m[3][0], this.m[3][1], this.m[3][2]);
    }
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

            return new mat4(m);
        }

        r[0][0] = this.determ3x3(this.m[1][1], this.m[1][2], this.m[1][3], this.m[2][1], this.m[2][2], this.m[2][3], this.m[3][1], this.m[3][2], this.m[3][3]) / det;
        r[1][0] = -this.determ3x3(this.m[1][0], this.m[1][2], this.m[1][3], this.m[2][0], this.m[2][2], this.m[2][3], this.m[3][0], this.m[3][2], this.m[3][3]) / det;
        r[2][0] = this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][3], this.m[2][0], this.m[2][1], this.m[2][3], this.m[3][0], this.m[3][1], this.m[3][3]) / det;
        r[3][0] = -this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][2], this.m[2][0], this.m[2][1], this.m[2][2], this.m[3][0], this.m[3][1], this.m[3][2]) / det;

        r[0][1] = -this.determ3x3(this.m[0][1], this.m[0][2], this.m[0][3], this.m[2][1], this.m[2][2], this.m[2][3], this.m[3][1], this.m[3][2], this.m[3][3]) / det;
        r[1][1] = this.determ3x3(this.m[0][0], this.m[0][2], this.m[0][3], this.m[2][0], this.m[2][2], this.m[2][3], this.m[3][0], this.m[3][2], this.m[3][3]) / det;
        r[2][1] = -this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][3], this.m[2][0], this.m[2][1], this.m[2][3], this.m[3][0], this.m[3][1], this.m[3][3]) / det;
        r[3][1] = this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][2], this.m[2][0], this.m[2][1], this.m[2][2], this.m[3][0], this.m[3][1], this.m[3][2]) / det;

        r[0][2] = this.determ3x3(this.m[0][1], this.m[0][2], this.m[0][3], this.m[1][1], this.m[1][2], this.m[1][3], this.m[3][1], this.m[3][2], this.m[3][3]) / det;
        r[1][2] = -this.determ3x3(this.m[0][0], this.m[0][2], this.m[0][3], this.m[1][0], this.m[1][2], this.m[1][3], this.m[3][0], this.m[3][2], this.m[3][3]) / det;
        r[2][2] = this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][3], this.m[1][0], this.m[1][1], this.m[1][3], this.m[3][0], this.m[3][1], this.m[3][3]) / det;
        r[3][2] = -this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][2], this.m[1][0], this.m[1][1], this.m[1][2], this.m[3][0], this.m[3][1], this.m[3][2]) / det;

        r[0][3] = -this.determ3x3(this.m[0][1], this.m[0][2], this.m[0][3], this.m[1][1], this.m[1][2], this.m[1][3], this.m[2][1], this.m[2][2], this.m[2][3]) / det;

        r[1][3] = this.determ3x3(this.m[0][0], this.m[0][2], this.m[0][3], this.m[1][0], this.m[1][2], this.m[1][3], this.m[2][0], this.m[2][2], this.m[2][3]) / det;
        r[2][3] = -this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][3], this.m[1][0], this.m[1][1], this.m[1][3], this.m[2][0], this.m[2][1], this.m[2][3]) / det;
        r[3][3] = this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][2], this.m[1][0], this.m[1][1], this.m[1][2], this.m[2][0], this.m[2][1], this.m[2][2]) / det;
        this.m = r;
        return new mat4(r);
    }
    setIdentity() {
        let r = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ];
        return new mat4(r);
    }

    setView(Loc, At, Up1) {
        let Dir = At.sub(Loc).normalize(),
            Right = Dir.cross(Up1).normalize(),
            Up = Right.cross(Dir).normalize();
        let r = [
            [Right.x, Up.x, -Dir.x, 0],
            [Right.y, Up.y, -Dir.y, 0],
            [Right.z, Up.z, -Dir.z, 0],
            [-Loc.dot(Right), -Loc.dot(Up), Loc.dot(Dir), 1],
        ];
        return new mat4(r);
    }

    setOrtho(Left, Right, Bottom, Top, Near, Far) {
        let r = [
            [2 / (Right - Left), 0, 0, 0],
            [0, 2 / (Top - Bottom), 0, 0],
            [0, 0, -2 / (Far - Near), 0],
            [-(Right + Left) / (Right - Left), -(Top + Bottom) / (Top - Bottom), -(Far + Near) / (Far - Near), 1],
        ];
        return new mat4(r);
    }

    setFrustum(Left, Right, Bottom, Top, Near, Far) {
        let r = [
            [(2 * Near) / (Right - Left), 0, 0, 0],
            [0, (2 * Near) / (Top - Bottom), 0, 0],
            [(Right + Left) / (Right - Left), (Top + Bottom) / (Top - Bottom), -(Far + Near) / (Far - Near), -1],
            [0, 0, (-2 * Near * Far) / (Far - Near), 0],
        ];
        return new mat4(r);
    }

    view(Loc, At, Up1) {
        return new mat4(this.mul(new mat4().setView(Loc, At, Up1)));
    }

    ortho(Left, Right, Bottom, Top, Near, Far) {
        return new mat4(this.mul(new mat4().setOrtho(Left, Right, Bottom, Top, Near, Far)));
    }

    frustum(Left, Right, Bottom, Top, Near, Far) {
        return new mat4(this.mul(new mat4().setFrustum(Left, Right, Bottom, Top, Near, Far)));
    }

    transform(V) {
        let w = V.x * this.m[0][3] + V.y * this.m[1][3] + V.z * this.m[2][3] + this.m[3][3];

        return new vec3(
            (V.x * this.m[0][0] + V.y * this.m[1][0] + V.z * this.m[2][0] + this.m[3][0]) / w,
            (V.x * this.m[0][1] + V.y * this.m[1][1] + V.z * this.m[2][1] + this.m[3][1]) / w,
            (V.x * this.m[0][2] + V.y * this.m[1][2] + V.z * this.m[2][2] + this.m[3][2]) / w
        );
    }

    transformVector(V) {
        return new vec3(
            V.x * this.m[0][0] + V.y * this.m[1][0] + V.z * this.m[2][0],
            V.x * this.m[0][1] + V.y * this.m[1][1] + V.z * this.m[2][1],
            V.x * this.m[0][2] + V.y * this.m[1][2] + V.z * this.m[2][2]
        );
    }

    transformPoint(V) {
        return new vec3(
            V.x * this.m[0][0] + V.y * this.m[1][0] + V.z * this.m[2][0] + this.m[3][0],
            V.x * this.m[0][1] + V.y * this.m[1][1] + V.z * this.m[2][1] + this.m[3][1],
            V.x * this.m[0][2] + V.y * this.m[1][2] + V.z * this.m[2][2] + this.m[3][2]
        );
    }

    toArray() {
        return [].concat(...this.m);
    }
}

function det(A11, A12, A13, A21, A22, A23, A31, A32, A33) {
    return A11 * A22 * A33 - A11 * A23 * A32 - A12 * A21 * A33 + A12 * A23 * A31 + A13 * A21 * A32 - A13 * A22 * A31;
}

export class Camera {
    constructor() {
        this.projSize = 0.1;
        this.projDist = 0.1;
        this.projFarClip = 1800;

        this.frameW = 30;
        this.frameH = 30;

        this.matrView = new mat4();
        this.matrProj = new mat4();
        this.matrVP = new mat4();

        this.loc = new vec3();
        this.at = new vec3();
        this.dir = new vec3();
        this.up = new vec3();
        this.right = new vec3();

        this.setDef();
    }

    set(loc, at, up) {
        this.matrView.setView(loc, at, up);
        this.loc = new vec3(loc);
        this.at = new vec3(at);
        this.dir.set(-this.matrView.m[0][2], -this.matrView.m[1][2], -this.matrView.m[2][2]);
        this.up.set(this.matrView.m[0][1], this.matrView.m[1][1], this.matrView.m[2][1]);
        this.right.set(this.matrView.m[0][0], this.matrView.m[1][0], this.matrView.m[2][0]);
        this.matrVP = new mat4(this.matrView).mul(this.matrProj);
    }

    setProj(projSize, projDist, projFarClip) {
        let rx = projSize,
            ry = projSize;

        this.projDist = projDist;
        this.projSize = projSize;
        this.projFarClip = projFarClip;

        if (this.frameW > this.frameH) rx *= this.frameW / this.frameH;
        else ry *= this.frameH / this.frameW;
        this.matrProj.setFrustum(-rx / 2.0, rx / 2.0, -ry / 2.0, ry / 2.0, projDist, projFarClip);

        this.matrVP = new mat4(this.matrView).mul(this.matrProj);
    }

    setSize(frameW, frameH) {
        if (frameW < 1) frameW = 1;
        if (frameH < 1) frameH = 1;
        this.frameW = frameW;
        this.frameH = frameH;

        this.setProj(this.projSize, this.projDist, this.projFarClip);
    }

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
    }
}
