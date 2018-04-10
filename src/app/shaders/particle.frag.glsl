uniform float time;
uniform bool galaxy;

varying vec3 vPosition;
varying vec3 mPosition;
varying vec4 vColor;
varying float gas;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}


void main()	{

    float a=distance(mPosition,vPosition);

    if(a>0.)a=1.;

    float b=max(1.0, .0035 *length(vPosition));
    float g=max(1.0, .0025 *length(vPosition));
    float r=max(1.0, .0004 *length(vPosition));


    float c=distance(gl_PointCoord,vec2(.5));
    float starlook=-(c-.5)*1.8*gas;
    float gaslook=(1.-gas)/(c*10.);
    float texture=starlook+gaslook;

    if (galaxy) {
        gl_FragColor = vec4(
            vec3(r, g, b),  max(0.5, sin(time / 20. * rand(vPosition.xy))))
            *texture*(1.-a*.35);
    } else {
        gl_FragColor = vec4(vec3(0.8, 0.8, 0.8) * texture,  max(0.5, sin(time / 30. * rand(vPosition.xy))));
    }

}