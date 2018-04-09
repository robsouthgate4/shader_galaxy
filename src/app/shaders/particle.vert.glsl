
uniform float time;
uniform bool galaxy;

varying vec3 vPosition;
varying vec3 mPosition;
varying vec4 vColor;
varying float gas;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float a;

void main()	{

    vPosition = position;
    mPosition = position * (1.+ 0. * 4.);
    vec4 mvPosition=modelViewMatrix*vec4(mPosition,1.);
    a = length(position);

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    gas = max(.0,sin(-a/20.));

    if (galaxy) {
        //gl_PointSize = rand(vPosition.xy) * 4.0; // low processing
        gl_PointSize = 3.0 * 2.0 * (1.+ gas * 2.); // v-high processing
    } else {
        gl_PointSize = rand(vPosition.xy) * 6.0;
    }


}