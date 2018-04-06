float lines(in vec2 pos, float b){
    float scale = 10.0;
    pos *= scale;
    return step(
                    .5+b*.5,
                    abs((sin(pos.x*3.1415)+b*2.0))*.5);
}

float noiseZ(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( random( i + vec2(0.0,0.0) ),
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ),
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                * 43758.5453123);
}

#pragma glslify: export(lines)
#pragma glslify: export(noiseZ)
#pragma glslify: export(rotate2d)
#pragma glslify: export(random)