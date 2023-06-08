#version 300 es
precision highp float;        
in vec4 in_pos;
out vec2 DrawPos;

void main( void ) 
{
    gl_Position = in_pos;
    DrawPos = vec2(in_pos.xy);
}