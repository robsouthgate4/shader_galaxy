import * as THREE from 'three'

(<any>global).THREE = THREE;

const OrbitControls = require('three-orbit-controls')(THREE)
import ExampleMaterial from './materials/ExampleMaterial'
import Props from './model/props'
const OBJLoader = require('three-obj-loader')(THREE);
import {TweenMax, Power4} from "gsap"
import Geometries from "./Geometries"
import MaterialsLib from "./materials/MaterialsLib"
import GpuParticles from './low_level/GpuParticles'

const posX = require("../../static/images/posx.png")
const posY = require("../../static/images/posy.png")
const posZ = require("../../static/images/posz.png")

const negX = require("../../static/images/negx.png")
const negY = require("../../static/images/negy.png")
const negZ = require("../../static/images/negz.png")

export default class Renderer{

    canvas: HTMLCanvasElement
    props: Props
    controls: THREE.OrbitControls
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    sphereGeometry: THREE.SphereGeometry
    nebulaGeomerty: THREE.Geometry
    light: THREE.Light
    light2: THREE.Light
    sphereMaterial: THREE.Material
    textGeometry: THREE.TextGeometry;
    nerbGroup: THREE.Object3D
    nerbMaterial: THREE.ShaderMaterial
    cubeMap: THREE.CubeTextureLoader
    gpuParticleSystem: GpuParticles
    gpuParticleSystem2: GpuParticles
    particleField: THREE.Points


    constructor(canvas: HTMLCanvasElement, props: Props) {
        this.canvas = canvas
        this.props = props
        this.controls = null
        this.camera = null
        this.textGeometry = null
    }

    loadObject(objToLoad: string): Promise<object> {
        return new Promise((resolve, reject) => {
            const loader = new OBJLoader();
            loader.load(objToLoad,
                (obj: object) => {
                    resolve(obj)
                })
        })
    }

    destroy(object: object): void {
        if (object instanceof THREE.Mesh) {
            object.parent.remove(object)
            object.geometry.dispose();
            object = null
        }
        if (object instanceof THREE.Group) {
            object.children.forEach(child2 => {
                this.destroy(child2)
            })
            object.parent.remove(object)
        }
    }

    zoomToPos(target: THREE.Vector3, duration = 12): void{
        TweenMax.to(this.camera.position, duration, {
            x: target.x,
            y: target.y,
            z: target.z,
            ease: Power4.easeInOut,
            onUpdate: this.update.bind(this),
            onComplete: () => {
                console.log('done')
            }
        })
    }

    start() {

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            preserveDrawingBuffer: true
        })

        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 35000 )

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setPixelRatio(2);

        document.body.appendChild( this.renderer.domElement )

        const position = { x : 0, y: 0, z: 10000 }

        this.camera.position.copy(
            new THREE.Vector3(
                position.x,
                position.y,
                position.z
            )
        )

       // this.zoomToPos(
       //     new THREE.Vector3(0,  0, 25),
       //     15)

        // this.scene.background = new THREE.CubeTextureLoader().load([
        //     posX,
        //     negX,
        //     posY,
        //     negY,
        //     posZ,
        //     negZ
        // ]);

        this.gpuParticleSystem =  new GpuParticles(50000, 5000, true, this.scene)
        this.particleField = this.gpuParticleSystem.particlePoints;
        this.particleField.rotation.x = THREE.Math.degToRad(-70);
        this.gpuParticleSystem.particleMaterial.uniforms.galaxy.value = true;
        this.scene.add(this.particleField);

        this.gpuParticleSystem2 =  new GpuParticles(50000, 50000, false, this.scene)
        const particleField2 = this.gpuParticleSystem2.particlePoints;
        this.scene.add(particleField2);

        var textureFlare0 = THREE.ImageUtils.loadTexture('https://s3.amazonaws.com/jsfiddle1234/lensflare0.png');
        var textureFlare3 = THREE.ImageUtils.loadTexture('https://images-na.ssl-images-amazon.com/images/I/41quvbpzlfS.png');
        // THREE.ImageUtils.crossOrigin = '';
        // var flareColor = new THREE.Color(0xffaacc);

        // //
        // lensFlare.add(textureFlare3, 60, 0.6, THREE.AdditiveBlending);
        // lensFlare.add(textureFlare3, 70, 0.7, THREE.AdditiveBlending);
        // lensFlare.add(textureFlare3, 120, 0.9, THREE.AdditiveBlending);
        // lensFlare.add(textureFlare3, 70, 1.0, THREE.AdditiveBlending);
        //
        // lensFlare.position.copy(this.nerbGroup.position);
        //
        // this.scene.add(lensFlare)

        /*
           Add scene lights
        */

        this.light = new THREE.PointLight( new THREE.Color('#ffffff'), 1, 100);
        this.light.position.set( 0, 0, 0 );+
        this.scene.add( this.light );

        this.light2 = new THREE.PointLight( new THREE.Color('#ffffff'), 1, 100);
        this.light2.position.set( -20, 0, 0 );
        this.scene.add( this.light2 );


        /* Create Nebula  */

        this.nerbMaterial = ExampleMaterial.createMaterial();
        this.nerbGroup = Geometries.CreateNebulaGeometry(12, 90, 60);
        this.nerbGroup.scale.set(0.5, 0.5, 0.5)

        this.nerbGroup.traverse((item) => {
            if (item instanceof THREE.Mesh) {
                item.material = this.nerbMaterial
            }
        })

        
        this.scene.add(this.nerbGroup);
        


        this.draw()

        if (this.props.orbitControls) {
            this.controls = new OrbitControls( this.camera )
        } else {
            this.controls = null;
        }

    }

    update(): void {
        this.refreshRenderer()
    }

    updateCameraPos(offset: THREE.Vector3): void {
        this.camera.position.x += offset.x;
        this.camera.position.y += offset.y;
        this.camera.position.z += offset.z;
    }

    refreshSize(width?: number, height?: number): void {
        const newWidth = width == null ? window.innerWidth : width
        const newHeight = height == null ? window.innerHeight : height
        this.camera.aspect = newWidth / newHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize( newWidth, newHeight )
    }

    refreshRenderer(): void {
        this.renderer.render(this.scene, this.camera)
    }

    draw(): void {

        let time = 0

        const animate = () => {

            time += 1;

            if (this.nerbMaterial) {

                this.nerbMaterial.uniforms.time.value = time
                this.nerbMaterial.uniforms.resolution.value.x = this.renderer.domElement.width
                this.nerbMaterial.uniforms.resolution.value.y = this.renderer.domElement.height

                this.gpuParticleSystem.particleMaterial.uniforms.time.value =  time
                this.gpuParticleSystem2.particleMaterial.uniforms.time.value =  time

            }


            if (this.props.animateLights) {
                // Animate scene lights
                this.light.position.x = -Math.sin(time/100) * 10.9
                this.light2.position.x = Math.sin(time/100) * 10.9
            }


            requestAnimationFrame(animate)
            this.renderer.render(this.scene, this.camera)
        }
        animate()
    }
}