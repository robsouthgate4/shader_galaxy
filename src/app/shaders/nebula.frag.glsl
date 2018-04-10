varying vec2 vUv;
//varying vec3 vNormal;
varying vec3 norm;
varying float edge;

uniform float time;
uniform vec2 resolution;

//#pragma glslify: simplex2d = require("glsl-noise/simplex/2d")
#pragma glslify: perlin2d = require("glsl-noise/classic/2d")

#define PI 3.14159

float remap (float value, float from1, float to1, float from2, float to2) {
    return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
}

vec2 random2(vec2 c) { float j = 4906.0*sin(dot(c,vec2(169.7, 5.8))); vec2 r; r.x = fract(512.0*j); j *= .125; r.y = fract(512.0*j);return r-0.5;}

const float F2 =  0.3660254;
const float G2 = -0.2113249;

float simplex2d(vec2 p){vec2 s = floor(p + (p.x+p.y)*F2),x = p - s - (s.x+s.y)*G2; float e = step(0.0, x.x-x.y); vec2 i1 = vec2(e, 1.0-e),  x1 = x - i1 - G2, x2 = x - 1.0 - 2.0*G2; vec3 w, d; w.x = dot(x, x); w.y = dot(x1, x1); w.z = dot(x2, x2); w = max(0.5 - w, 0.0); d.x = dot(random2(s + 0.0), x); d.y = dot(random2(s +  i1), x1); d.z = dot(random2(s + 1.0), x2); w *= w; w *= w; d *= w; return dot(d, vec3(70.0));}

vec3 rgb2yiq(vec3 color){return color * mat3(0.299,0.587,0.114,0.596,-0.274,-0.321,0.211,-0.523,0.311);}
vec3 yiq2rgb(vec3 color){return color * mat3(1.,0.956,0.621,1,-0.272,-0.647,1.,-1.107,1.705);}

vec2 sincos( float x ){return vec2(sin(x), cos(x));}
vec3 rotate3d(vec3 p, vec3 v, float phi){ v = normalize(v); vec2 t = sincos(-phi); float s = t.x, c = t.y, x =-v.x, y =-v.y, z =-v.z; mat4 M = mat4(x*x*(1.-c)+c,x*y*(1.-c)-z*s,x*z*(1.-c)+y*s,0.,y*x*(1.-c)+z*s,y*y*(1.-c)+c,y*z*(1.-c)-x*s,0.,z*x*(1.-c)-y*s,z*y*(1.-c)+x*s,z*z*(1.-c)+c,0.,0.,0.,0.,1.);return (vec4(p,1.)*M).xyz;}


void main() {

    vec2 uv = vUv;
    float timeSlowed = time * 0.03;

    vec3 color2 = vec3(0.3, 0.3, 1.0);

    uv = (uv-.5)*20.;

    vec3 vlsd = vec3(0,1,0);
        vlsd = rotate3d(vlsd, vec3(1.,1.,0.), timeSlowed);

        vec2
            v0 = .75 * sincos(.3457 * timeSlowed + .3423),
            v1 = .75 * sincos(.7435 * timeSlowed + .4565),
            v2 = .75 * sincos(.5345 * timeSlowed + .3434) + perlin2d(uv * .759);

        vec3 color = mix(vec3(1.0, 1.0, 1.0), color2, uv.x) + vec3(0.0, 0.1, 0.0);

        float calc = perlin2d(uv+v0) * 0.122;

        color *= .2 + 2.5*vec3(
        	calc
        );

        color = yiq2rgb(color + color2) * color;


    float alpha = edge;


    float pct = remap(
         distance (vUv, vec2(0.5)),
         0.0,
         1.0,
         0.8,
         -1.0
    );

    float pct2 = remap(
         distance (vUv, vec2(0.5)),
         0.0,
         1.0,
         0.9,
         -2.0
    );

    vec3 white = vec3(1.0, 1.0, 1.0) * (pct2 - 0.2);

    alpha *= (pct - 0.01);

    gl_FragColor = vec4(color2 * color + white, alpha * 0.2);
}