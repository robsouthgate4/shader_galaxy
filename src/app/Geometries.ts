import * as THREE from "three"
import {getRandomInt} from "./Utils/Helpers"

export default class Geometries {

    public static CreateSphere(radius = 5, width = 32, height = 32): THREE.SphereGeometry {
        return new THREE.SphereGeometry(radius, width, height)
    }

    public static CreatePlaneGeometry( width = 30, height = 30, ws = 1, hs = 1 ): THREE.PlaneGeometry {
        return new THREE.PlaneGeometry( width, height, ws, hs );
    }

    public static CreateNebulaGeometry( planeCount = 20, planeWidth = 60, planeHeight = 40 ) : THREE.Object3D {
        const nebulaGroup = new THREE.Group();
        for (var i = 0; i < planeCount; i++) {

            const plane = new THREE.PlaneGeometry(planeWidth, planeHeight, 1, 1)
            const mesh = new THREE.Mesh(plane)

            mesh.position.x = 0;
            mesh.position.y = 0;
            mesh.position.z = 0;

            mesh.rotation.y = THREE.Math.degToRad(getRandomInt(0, 360));
            mesh.rotation.x = THREE.Math.degToRad(getRandomInt(0, 360));
            mesh.rotation.z = THREE.Math.degToRad(getRandomInt(0, 360));

            nebulaGroup.add(mesh);
        }
        return nebulaGroup;
    }

}