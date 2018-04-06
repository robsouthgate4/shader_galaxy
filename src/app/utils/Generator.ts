import Renderer from "../Renderer";
import App from '../App'

const millLogo = require('../../../static/images/mill_export_logo.png')

export default class Generator {

    static _saveFile(strData: string, filename: string) : void {
        var link = document.createElement('a');

        
        link.download = filename;
        link.href = strData;

        document.body.appendChild(link); //Firefox requires the link to be in the body

        link.click();
        document.body.removeChild(link); //remove the link when done

    }

    static dataURIToBlob(dataURI: string): Blob {

        var binStr = atob(dataURI.split(',')[1]),
            len = binStr.length,
            arr = new Uint8Array(len),
            mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
        }

        return new Blob([arr], {
            type: mimeString
        });

    }

    static aspectResize(srcUrl: string, dstW: number, dstH: number, callback: Function): void {


        const cpuScaleAspect	= function(maxW: number, maxH: number, curW: number, curH: number){
            const ratio	= curH / curW;
            if( curW >= maxW && ratio <= 1 ){
                curW	= maxW;
                curH	= maxW * ratio;
            }else if(curH >= maxH){
                curH	= maxH;
                curW	= maxH / ratio;
            }
            return { width: curW, height: curH };
        }


        const onLoad = function(){


            const canvas	= document.createElement('canvas');
            canvas.width	= dstW;	canvas.height	= dstH;
            const ctx		= canvas.getContext('2d');



            ctx.fillStyle	= "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const scaled	= cpuScaleAspect(canvas.width, canvas.height, image.width, image.height);


            const offsetX	= (canvas.width  - scaled.width )/2;
            const offsetY	= (canvas.height - scaled.height)/2;

            ctx.drawImage(image, offsetX, offsetY, scaled.width, scaled.height);


            const mimetype	= "image/png";
            const newDataUrl	= canvas.toDataURL(mimetype);

            callback && callback(newDataUrl)

        }.bind(this);

        const image 	= new Image();
        image.onload	= onLoad;
        image.src	= srcUrl;

    }


    static saveAsImage(app: App) : void {

        document.body.classList.add("loading")

        let imgData;
        let firstRun = true;
        const strMime = "image/png";

        const canvas = <HTMLCanvasElement>document.createElement("canvas")
        canvas.id = "fakeCanvas"
        canvas.style.display = "none"

        let rendererInstance = new Renderer(
            canvas,
            app.props
        )

        const run = () => {

            rendererInstance.camera.position.z = 20;
            rendererInstance.camera.position.y = 2;

            rendererInstance.refreshSize(540, 540)

            const srcWidth = rendererInstance.renderer.domElement.width;
            const srcHeight = rendererInstance.renderer.domElement.height;

            const finalCanvas = document.createElement("canvas")
            finalCanvas.width	= srcWidth
            finalCanvas.height	= srcHeight
            finalCanvas.id = "finalCanvas"
            finalCanvas.style.display = "none"


            const destCanvasContext = finalCanvas.getContext("2d");
            destCanvasContext.fillStyle = "#ececec"
            destCanvasContext.fillRect(1, 1, finalCanvas.width, finalCanvas.height);

            setTimeout(() => {

                imgData = rendererInstance.renderer.domElement.toDataURL(strMime);

                const canvWidth = rendererInstance.renderer.domElement.width;
                const canvHeight = rendererInstance.renderer.domElement.height;

                const destinationImage = new Image;

                    destinationImage.onload = () =>{

                        const logo = new Image;

                        console.log(logo.width)
                        console.log(logo.height)

                        logo.onload = () => {

                            destCanvasContext.drawImage(
                                destinationImage,
                                0,
                                0
                            );

                            destCanvasContext.drawImage(
                                logo,
                                (canvWidth / 2) - (logo.width / 2),
                                60,
                                logo.width,
                                logo.height
                            );

                            setTimeout(() => {

                                    let blob = this.dataURIToBlob(finalCanvas.toDataURL(strMime));
                                    let url = URL.createObjectURL(blob);

                                    Generator._saveFile(url, "name.png");

                                    const currentCanvas = document.getElementById("fakeCanvas");
                                    currentCanvas.remove()
                                    rendererInstance.renderer.dispose()

                                    document.body.classList.remove("loading")

                            }, 50)


                        };

                        logo.src = millLogo;

                    };

                    destinationImage.src = imgData;


            }, 50)

        }


    }
}