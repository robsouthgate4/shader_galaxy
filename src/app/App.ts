import Renderer from './Renderer'
import '../style/app.scss'

import Props from "./model/Props"
import {reMap} from "./Utils/Helpers"
import * as THREE from "three"

const millLogo = require('../../static/images/mill_export_logo.png')
console.log(millLogo)


class App {

    public container: HTMLCanvasElement;
    public props: Props;
    public renderer: Renderer;

    constructor() {
        this.container = <HTMLCanvasElement>document.getElementById('canvas')
        this.props = new Props()
        this.renderer = new Renderer (
            this.container,
            this.props
        )
        
    }

    onResize() : void {
        this.renderer.refreshSize();
    }

    updateProps(state: any): void {

    }

    offsetCamera(offset: THREE.Vector3): void {
        this.renderer.updateCameraPos(offset);
    }

    resetProps(): void {

    }

    mapCoordsMouse(e: MouseEvent): void {

        let numX;
        let numY;

        numX = e.clientX;
        numY = e.clientY;

        const x = reMap(numX, 0, window.innerWidth, -1, 1);
        const y = reMap(numY, 0, window.innerHeight, 1, -1);

        this.props.mouseX = x;
        this.props.mouseY = y;

    }

    mapCoordsTouch(e: TouchEvent): void {

        let numX;
        let numY;

            numX = e.touches[0].clientX;
            numY = e.touches[0].clientY;

        const x = reMap(numX, 0, window.innerWidth, -1, 1);
        const y = reMap(numY, 0, window.innerHeight, 1, -1);

        this.props.mouseX = x;
        this.props.mouseY = y;


    }

    onMouseDown(e: MouseEvent): void {
        window.onmousemove = (e) => {
            this.mapCoordsMouse(e);
        }
    }

    onTouchDown(e: TouchEvent): void {
        window.ontouchmove = (e) => {
            e.preventDefault()
            this.mapCoordsTouch(e);
        }
    }

    zoomToPos(target: THREE.Vector3): void {
        this.renderer.zoomToPos(target)
    }

    attachListeners() : void {

        this.container.addEventListener("mouseup", () =>{
            window.onmousemove = null
        });

        this.container.addEventListener("touchmove",  this.onTouchDown.bind(this), false);
        this.container.addEventListener("touchend", () => {
            window.ontouchmove = null
        });

        this.container.addEventListener( 'mousedown', this.onMouseDown.bind(this), false )
        window.addEventListener( 'resize', this.onResize.bind(this), false );
    }


    start(): void {
        console.log('start');
        this.renderer.start()
        this.attachListeners()
    }

}

export default App;