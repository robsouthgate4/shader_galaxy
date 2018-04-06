import * as THREE from "three";

const gpuVertShader = require('../shaders/particle.vert.glsl')
const gpuFragShader = require('../shaders/particle.frag.glsl')

export default class GpuParticles {

    numberOfParticles: number;
    geometry: THREE.BufferGeometry;
    material: THREE.ShaderMaterial;

    constructor(numberOfParticles = 75000) {
        this.numberOfParticles = numberOfParticles;
        this.createParticleMaterial()
    }

    private createParticleMaterial() {





        var triangles = 12 * 150000;

        this.geometry = new THREE.BufferGeometry();

        // const attributes: THREE.BufferAttribute = {
        //
        //     position: {
        //         itemSize: 3,
        //         array: new Float32Array( triangles * 3 * 3 ),
        //         numItems: triangles * 3 * 3
        //     },
        //
        //     normal: {
        //         itemSize: 3,
        //         array: new Float32Array( triangles * 3 * 3 ),
        //         numItems: triangles * 3 * 3
        //     },
        //
        //     color: {
        //         itemSize: 3,
        //         array: new Float32Array( triangles * 3 * 3 ),
        //         numItems: triangles * 3 * 3
        //     }
        //
        // }
        //
        // this.geometry.attributes = attributes;

        this.material = new THREE.ShaderMaterial( {
            uniforms: {
                time: { value: 0.0 }
            },
            vertexShader: gpuVertShader,
            fragmentShader: gpuFragShader,
            side: THREE.DoubleSide,
            transparent: true
        } );

    }

    get particleGeometry() {
        return this.geometry;
    }

    get particleMaterial() {
        return this.material;
    }

}