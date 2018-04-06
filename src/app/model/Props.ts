import {EventEmitter} from 'events'

export default class Props extends EventEmitter {

    orbitControls: boolean;
    animateLights: boolean;
    color: number[];
    mouseX: number;
    mouseY: number;
    animate: boolean;

    constructor() {
        super()

        this.orbitControls = true
        this.animateLights = true
        this.color = [128, 145, 122]
        this.mouseX = 0
        this.mouseY = 0
        this.animate = false
        
    }
}
