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
    starsMaterial: THREE.ShaderMaterial;
    starField: THREE.Points;
    scale: number;
    galaxyShape: boolean;
    scene: THREE.Scene;

    constructor(numberOfParticles = 100000, scale = 5000, galaxyShape: boolean, scene: THREE.Scene) {
        this.numberOfParticles = numberOfParticles
        this.galaxyShape = galaxyShape
        this.scene = scene;
        this.scale = scale
        this.createParticles()
    }

    private createStarGalaxy(): THREE.Vector3 {

        let star = new THREE.Vector3()

        const axis1= (400+Math.random()*20);
        const axis2= (axis1+20+Math.random()*100);

        let maja,
            mina;

        axis1 > axis2 ? (maja=axis1,mina=axis2):
            axis1 == axis2 ? (maja=axis1+1,mina=axis2) : (maja=axis2,mina=axis1)

        const armsAngle= ((Math.random()*2-1)>0?1:-1)*12+3

        //core proportion in the (x,y) plane, between 0 and 1, proposed value range : between .1 and .8
        const bulbSize = Math.random()*.6

        const ellipticity = 2+Math.random()*.2

        const dist= Math.random()
        const angle=(dist-bulbSize)*armsAngle
        //ellipse parameters
        const a=maja*dist
        const b=mina*dist
        const e=Math.sqrt(a*a-b*b)/a
        const phi=ellipticity*Math.PI/2*(1-dist)*(Math.random()*2-1)

        //create point on the ellipse with polar coordinates
        //1. random angle from the center
        let theta=Math.random()*Math.PI*2

        //2. deduce radius from theta in polar coordinates, from the CENTER of an ellipse, plus vartiations
        const radius=Math.sqrt(b*b/(1-e*e*Math.pow(Math.cos(theta),2)))*(1+Math.random()*.1)

        //3. then shift theta with the angle offset to get arms, outside the bulb
        if(dist>bulbSize)theta += angle

        star.x = Math.cos(phi)*Math.cos(theta)*radius
        star.y = Math.cos(phi)*Math.sin(theta)*radius
        star.z = Math.sin(phi)* (radius * 0.3)
        return star;
    }

    private createStarCube(): THREE.Vector3 {
        let star = new THREE.Vector3()
        star.x = THREE.Math.randFloatSpread( this.scale );
        star.y = THREE.Math.randFloatSpread( this.scale );
        star.z = THREE.Math.randFloatSpread( this.scale );
        return star;
    }

    private createParticles() {

        this.starsGeometry = new THREE.Geometry();

        for ( let i = 0; i < this.numberOfParticles; i ++ ) {
            let star = this.galaxyShape ? this.createStarGalaxy() : this.createStarCube()
            this.starsGeometry.vertices.push( star )
        }

        this.starsMaterial = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge( [

            THREE.UniformsLib[ "fog" ],
            {
                time: {type: 'f', value: 0.0},
                galaxy: {type: 'b', value: false}
            }]),
            vertexShader: gpuVertShader,
            fragmentShader: gpuFragShader,
            transparent: true,
            depthTest: false,
            blending: THREE.AdditiveBlending,
            fog: true
        })

        this.starsMaterial.depthTest = true
        this.starsMaterial.depthWrite = false


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