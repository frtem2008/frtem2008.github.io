#version 300 es

precision highp float;

in vec3 in_pos;
in vec2 in_tex;
in vec3 in_n;
in vec4 in_col;

uniform mat4 ModelViewP;

out vec3 pos;
out vec2 tc;
out vec3 n;
out vec4 c;

void main() {
    gl_Position = vec4(in_pos, 1) * ModelViewP;
    pos = in_pos;
    tc = in_tex;
    n = in_n;
    c = in_col;
}