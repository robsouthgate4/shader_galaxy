import * as THREE from 'three'
import {EventEmitter} from "events"

const glslify = require('glslify')

const fragmentShaderDistort = glslify('../shaders/distort.frag')
const vertexShaderDistort = glslify('../shaders/distort.vert')

const fragmentShader = glslify('../shaders/test.frag')
const vertexShader = glslify('../shaders/test.vert')

function replaceThreeChunkFn(a: string, b: string): string {
    return THREE.ShaderChunk[b] + '\n';
}

function shaderParse(glsl: string): string {
    return glsl.replace(/\/\/\s?chunk\(\s?(\w+)\s?\);/g, replaceThreeChunkFn);
}

export default class MaterialsLib extends EventEmitter {

    constructor() {
        super()
    }

    static CreateBasicMaterial(color = 0xffff00) : THREE.MeshBasicMaterial {
        return new THREE.MeshBasicMaterial( {color: color} );
    }

    static CreateWireframeMaterial(color = [0, 0, 0], lineWidth = 1): THREE.MeshBasicMaterial {
        return new THREE.MeshBasicMaterial({
            color: new THREE.Color(`rgb(${color[0]},${color[1]},${color[2]})`),
            wireframe: true
        });
    }

    static CreateDistortionMaterial(): THREE.ShaderMaterial {

       //const texture = THREE.ImageUtils.loadTexture(img, undefined)

        const material = new THREE.ShaderMaterial(
            {
                uniforms:{
                    wind: { type: 'f', value: 0.0 },
                    //textureSampler: { type: "t", value: texture },
                    diffuse: {type: 'c', value: new THREE.Color()},
                    amount: {type: 'f', value: 20.0},
                    time: { value: 1.0 },
                    resolution: { value: new THREE.Vector2() },
                    color: {value: new THREE.Color()},
                    frequency: {value: 0.0, type: 'f'}
                },
                transparent: true,
                flatShading: false,
                vertexShader: vertexShaderDistort,
                fragmentShader: fragmentShaderDistort
            }
        )

        return material

    }

    static CreateShaderMaterial(): THREE.ShaderMaterial {

        const material = new THREE.ShaderMaterial(
            {
                uniforms: THREE.UniformsUtils.merge(
                    [THREE.UniformsLib['lights'],
                        {
                            diffuse: {type: 'c', value: new THREE.Color()},
                            amount: {type: 'f', value: 20.0},
                            time: { value: 1.0 },
                            resolution: { value: new THREE.Vector2() },
                            color: {value: new THREE.Color()},
                            frequency: {value: 0.0, type: 'f'}
                        }
                    ]
                ),
                lights: true,
                vertexShader: vertexShader,
                fragmentShader: fragmentShader
            }
        )

        return material

    }

}
