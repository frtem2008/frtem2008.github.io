#version 300 es
precision highp float;

in vec2 DrawPos;
out vec4 o_color;

uniform float scale;
uniform vec4 rect;
uniform vec3 colorMod;

vec2 mulCmpl( vec2 A, vec2 B )
{
    return vec2(A.x * B.x - A.y * B.y, A.x * B.y + A.y * B.x);            
}

vec2 divCmpl( vec2 Z1, vec2 Z2 ) 
{
    float a = Z1.x;
    float b = Z1.y;
    float c = Z2.x;
    float d = Z2.y;

    return vec2((a * c + b * d) / (c * c + d * d), (b * c - a * d) / (c * c + d * d));
}

vec2 squareCmpl( vec2 A )
{
    return mulCmpl(A, A);
}

float cmod2( vec2 A )
{
    return A.x * A.x + A.y * A.y;
}

float X0( void ) {
    return rect.x;
}

float X1( void ) {
    return rect.z   ;
}

float Y0( void ) {
    return rect.y;
}

float Y1( void ) {
    return rect.w;
}

float mandl( vec2 Z )
{
    float n = 0.0;
    vec2 Z0 = Z;  


    while (n < 255.0 && cmod2(Z) < (X1() - X0()) * (X1() - X0()))
    {
        Z = squareCmpl(Z) + Z0;
        n += 1.0;
    }

    return n;            
}

vec3 smth( vec2 Z )
{
    vec3 col = vec3(0);
    vec2 Z0 = Z;

    for (int i = 0; i < 50; i++) {
        Z = divCmpl(squareCmpl(Z), vec2(1, 0) + Z + squareCmpl(squareCmpl(Z))) + Z0;

        if (Z.x < -2.0 || Z.x > 1.0 || Z.y > 1.5 || Z.y < -1.5) {
            col = vec3(255.0 - 5.5 * (float(i) - 1.0)) / 255.0;
        }   
    }

    return col;
}

vec3 newton( vec2 Z ) 
{
    vec3 col = vec3(0);
    vec2 Z0 = Z;
    float k = 0.0;

    while (cmod2(Z) < 20.0 && k < 255.0)
    {
        Z = divCmpl( 3.0 * squareCmpl(squareCmpl(Z)) + vec2(1, 0), 4.0 * mulCmpl(squareCmpl(Z), Z)) + Z0;

        if (Z.x < -2.0 || Z.x > 1.0 || Z.y > 1.5 || Z.y < -1.5) {
            col = vec3(k / 255.0) * 4.0;
        }   
        k += 1.0;
    }

    return col;
}

float fromPosX( void )
{
    return rect.x + DrawPos.x * (X1() - X0()) / scale;            
}

float fromPosY( void )
{
    return rect.y + DrawPos.y * (Y1() - Y0()) / scale;            
}

vec3 calcColor( void )
{
    // calculate color depended on position
    vec2 Z = vec2(fromPosX(), fromPosY());
    vec3 col = vec3(0.30, 0.47, 0.8);
    float n = mandl(Z);
    n /= 255.0;
    col = vec3(n);
    // col = smth(Z);
    // col = newton(Z);
    
    return col * colorMod;
    // return vec3(n / 255.0, 0, 0);
    // return vec3(Z.Re, Z.Im, 0);
    // return vec3(in_pos.xy, 1);
}

void main( void ) 
{
    o_color = vec4(calcColor(), 1);
}