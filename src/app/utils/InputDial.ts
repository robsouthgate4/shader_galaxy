import { EventEmitter } from "events";

interface Input {
    x: number;
    y: number;
}

export default class InputDial extends EventEmitter{

    inputX: number;
    inputY: number;
    isTouching: boolean;
    hasTouch: boolean;
    dial: HTMLElement;
    radius: number;
    currentInput: Input;

    constructor(domElementId: string, radius: number)
    {
        super();
        this.inputX = 0;
        this.inputY = 0;
        this.currentInput = {x: 0, y: 0};
        this.isTouching = false;
        this.hasTouch = false;
        (<any>window).dial = this;
        this.radius = radius;
        this.dial = <HTMLElement>document.getElementById(domElementId);

        this.setSize(radius);
        this.setupInput();
    }

    setSize(radius: number) : void
    {
        this.radius = radius;
        this.dial.style.position = "absolute";
        this.dial.style.width = (this.radius * 2) + "px";
        this.dial.style.height = this.radius + "px";
        this.dial.style.marginLeft = "50%";
        this.dial.style.bottom = "0px";
        this.dial.style.left = (-radius) + "px";
        this.dial.style.background = "red";
    }

    trackMovementMouse(e: MouseEvent): void {
        this.currentInput.x = e.clientX - this.dial.offsetLeft - this.radius;
        this.currentInput.y = window.innerHeight - e.clientY;
        // this.setInputValuesByXY();
        this.setInputValuesByRadiusAngle();
    }

    trackMovementTouch(e: TouchEvent): void
    {
        if(!this.isTouching)
            return;
        if(this.hasTouch && e.touches.length > 0)
        {
            this.currentInput.x = e.touches[0].clientX - this.dial.offsetLeft - this.radius;
            this.currentInput.y = window.innerHeight - e.touches[0].clientY;
        }
        // this.setInputValuesByXY();
        this.setInputValuesByRadiusAngle();
    }

    setInputValuesByRadiusAngle(): void
    {
        var angle = 180- ( 180 * Math.atan2(this.currentInput.y, this.currentInput.x)/Math.PI);
        var dist = Math.sqrt(this.currentInput.x*this.currentInput.x + this.currentInput.y * this.currentInput.y);
        this.inputX = -1 + 2 * this.clampValues(angle/180, 0, 1);
        this.inputY = - 1 + 2 * this.clampValues(dist/this.radius, 0, 1);

        this.emit("update");
    }

 
    setInputValuesByXY() : void
    {
        this.inputX = this.clampValues(this.currentInput.x/this.radius, -1, 1);
        this.inputY = -1 + 2 * this.clampValues(this.currentInput.y/this.radius, 0, 1);
        this.emit("update");
    }

    clampValues(val: number, min: number, max: number) : number
    {
        return Math.min(Math.max(val, min), max);
    }

    setIsTouching(isTouching: boolean)
    {
        this.isTouching = isTouching;
    }

    setupInput() : void {
        window.addEventListener("mouseup", (e)=>{
            this.setIsTouching(false);
        });
        window.addEventListener("touchend", (e)=>{
            this.setIsTouching(false);
        });
        this.dial.addEventListener("mousedown", (e)=>{
            this.setIsTouching(true);
        });
        this.dial.addEventListener("touchstart", (e)=>{
            this.hasTouch = true;
            this.setIsTouching(true);
        });
        this.dial.addEventListener("touchmove", (e: TouchEvent)=>{this.trackMovementTouch(e)}, false);
        this.dial.addEventListener("mousemove", (e: MouseEvent)=>{this.trackMovementMouse(e)}, false);
    }

}