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
import RenderLoop from './utils/RenderLoop'

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
    light: THREE.Light
    light2: THREE.Light
    textGeometry: THREE.TextGeometry;
    nebGroup: THREE.Object3D
    nebMaterial: THREE.ShaderMaterial
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
        this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 105000 )

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setPixelRatio(2);

        document.body.appendChild( this.renderer.domElement )

        const position = { x : 0, y: 100, z: 50000 }

        this.camera.position.copy(
            new THREE.Vector3(
                position.x,
                position.y,
                position.z
            )
        )

       // this.zoomToPos(
       //     new THREE.Vector3(0,  0, 30),
       //     15)


        this.gpuParticleSystem =  new GpuParticles(30000, 5000, true, this.scene)
        this.particleField = this.gpuParticleSystem.particlePoints;
        this.particleField.rotation.x = THREE.Math.degToRad(-60);
        this.particleField.rotation.z = THREE.Math.degToRad(-30);
        this.gpuParticleSystem.particleMaterial.uniforms.galaxy.value = true;
        this.scene.add(this.particleField);

        this.gpuParticleSystem2 =  new GpuParticles(30000, 100000, false, this.scene)
        const particleField2 = this.gpuParticleSystem2.particlePoints;
        this.scene.add(particleField2);

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

        this.nebMaterial = ExampleMaterial.createMaterial();
        this.nebGroup = Geometries.CreateNebulaGeometry(12, 90, 60);
        this.nebGroup.scale.set(0.5, 0.5, 0.5)

        this.nebGroup.traverse((item) => {
            if (item instanceof THREE.Mesh) {
                item.material = this.nebMaterial
            }
        })


        this.scene.add(this.nebGroup);
        this.draw()

        if (this.props.orbitControls) {
            this.controls = new OrbitControls( this.camera )
        } else {
            this.controls = null;
        }

    }

    update(): void {

        if (this.camera.fov < 75) {
            this.camera.fov += 0.1
            this.camera.updateProjectionMatrix();
        }

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

    onRender(): void {

    }

    draw(): void {

        let time = 0
        let angle = 0;

        const rloop = new RenderLoop((dt) =>{
            time += 1;
            angle += THREE.Math.degToRad(90);
            if (this.nebMaterial) {

                this.nebMaterial.uniforms.time.value = time
                this.nebMaterial.uniforms.resolution.value.x = this.renderer.domElement.width
                this.nebMaterial.uniforms.resolution.value.y = this.renderer.domElement.height

                this.gpuParticleSystem.particleMaterial.uniforms.angle.value = angle
                this.gpuParticleSystem.particleMaterial.uniforms.time.value =  time

                this.gpuParticleSystem2.particleMaterial.uniforms.time.value =  time
                this.gpuParticleSystem2.particleMaterial.uniforms.angle.value = angle

            }
            if (this.props.animateLights) {
                // Animate scene lights
                this.light.position.x = -Math.sin(time/100) * 10.9
                this.light2.position.x = Math.sin(time/100) * 10.9
            }

            this.renderer.render(this.scene, this.camera)

        },10).start();
    }
}