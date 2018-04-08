import * as THREE from "three";

const gpuVertShader = require('../shaders/particle.vert.glsl')
const gpuFragShader = require('../shaders/particle.frag.glsl')



interface Item {
   itemSize: number,
   array: Float32Array,
   numItems: number
}

interface NewBufferObject {
    position?: Item;
    normal?: Item;
    color?: Item;
}


export default class GpuParticles {

    numberOfParticles: number;
    geometry: THREE.BufferGeometry;
    material: THREE.ShaderMaterial;
    starsGeometry: THREE.Geometry;
    starsMaterial: THREE.PointsMaterial;
    starField: THREE.Points;
    scale: number;

    constructor(numberOfParticles = 100000, scale = 5000) {
        this.numberOfParticles = numberOfParticles;
        this.scale = scale;
        this.createParticleMaterial()
    }

    private createParticleMaterial() {


        ///This will add a starfield to the background of a scene
            this.starsGeometry = new THREE.Geometry();

            for ( var i = 0; i < this.numberOfParticles; i ++ ) {

                var star = new THREE.Vector3();
                
                star.x = THREE.Math.randFloatSpread( this.scale );
                star.y = THREE.Math.randFloatSpread( this.scale );
                star.z = THREE.Math.randFloatSpread( this.scale );

                this.starsGeometry.vertices.push( star );

            }

            this.starsMaterial = new THREE.PointsMaterial( { color: 0x888888 } );

            const starsShaderMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: {type: 'f', value: 0.0}        
                },
                vertexShader: gpuVertShader,
                fragmentShader: gpuFragShader,
                transparent: true
            })

            starsShaderMaterial.depthTest = true
            starsShaderMaterial.depthWrite = false


            this.starField = new THREE.Points( this.starsGeometry, this.starsMaterial );

    }

    get particleGeometry() {
        return this.starsGeometry;
    }

    get particlePoints() {
        return this.starField;
    }

    get particleMaterial() {
        return this.starsMaterial;
    }

}