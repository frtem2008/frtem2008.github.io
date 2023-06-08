#version 300 es

precision highp float;

out vec4 o_color;
in vec4 pos;
in vec2 tc;
in vec3 n;
in vec4 c;

void main() {
    o_color = vec4(pos.x, pos.y, pos.z, 1);
}
