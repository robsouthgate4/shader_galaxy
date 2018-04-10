
uniform float time;
uniform bool galaxy;
uniform float angle;

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
    mPosition = position * (1.+ 2.5 * 4.);
    vec4 mvPosition=modelViewMatrix*vec4(mPosition,1.);

    a = length(position);
    float numOfRings = 35.;

    gas = max(.0,sin(-a/numOfRings));

    if (galaxy) {
        //gl_PointSize = max(4.0, rand(vPosition.xy)) * 4.0; // low processing
        gl_Position = projectionMatrix * modelViewMatrix * vec4(
            mPosition,
         1.0 );
        gl_PointSize = 3.0 * 2.8 * (1.+ gas * 2.);// v-high processing
    } else {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
        gl_PointSize = rand(vPosition.xy) * 8.0;
    }


}