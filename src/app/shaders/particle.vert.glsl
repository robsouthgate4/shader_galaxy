
uniform float time;
varying vec3 vPosition;
varying vec4 vColor;

void main()	{
    vPosition = position;
    gl_PointSize = 3.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}