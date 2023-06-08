#version 300 es

precision highp float;

out vec4 o_color;
in vec3 pos;
in vec2 tc;
in vec3 n;
in vec4 c;

void main() {
    o_color = vec4(pos.x, pos.x, pos.x, 1);
}
