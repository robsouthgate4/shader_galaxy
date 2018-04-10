varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal;
varying vec3 norm;
varying float edge;


uniform float time;

 void main() {
     vUv = uv;
     vNormal = normalMatrix * normal;

     /* Calculate amount that object normal is facing the camera */
     vec3 viewVector = (viewMatrix * vec4(cameraPosition, 1.0)).xyz - (modelViewMatrix * vec4(position, 1.0)).xyz;
     viewVector = normalize(viewVector);

     edge = max(abs(dot(viewVector, vNormal)), 0.0);



     gl_Position =  projectionMatrix *
                     modelViewMatrix *
                     vec4(
                        position, 1.0);


 }