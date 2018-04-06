import * as THREE from 'three'

export const addLightSphere = (light: THREE.Light, color: THREE.Color) : void => {
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry( 2, 16, 16 ),
        new THREE.MeshBasicMaterial( { color: color } ) )
    light.add(sphere)
}

export const getPositionAsVector = (obj: THREE.Object3D) : THREE.Vector3 => {
    const pos = new THREE.Vector3();
    pos.copy( obj.position );
    return pos;
}

export const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const  reMap = (value: number, in_min: number, in_max: number, out_min: number, out_max: number) : number => {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
