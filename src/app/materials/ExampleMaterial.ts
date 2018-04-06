
import * as THREE from 'three'

const hmr = require('../../lib/three-hmr')
const cache = hmr.cache(__filename)

const fragmentShader = require('../shaders/test.frag.glsl')
const vertexShader = require('../shaders/test.vert.glsl')

if (module.hot) {
    console.log('hello')
    module.hot.accept()
    hmr.update(cache, {
        vertexShader,
        fragmentShader
    })
} else {
    console.log('mans not hot')
}

function replaceThreeChunkFn(a: string, b: string): string {
    return THREE.ShaderChunk[b] + '\n';
}

function shaderParse(glsl: string) : string {
    return glsl.replace(/\/\/\s?chunk\(\s?(\w+)\s?\);/g, replaceThreeChunkFn);
}


export default class ExampleMaterial {

    static createMaterial() {

        const material = new THREE.ShaderMaterial(
            {
                uniforms: THREE.UniformsUtils.merge([
                    THREE.UniformsLib['lights'],
                    {
                        time: { value: 1.0 },
                        color: {value: new THREE.Color()},
                        color2: {value: new THREE.Color()},
                        color3: {value: new THREE.Color()},
                        color4: {value: new THREE.Color()},
                        mouseX: { type: "f", value: 0.0 },
                        mouseY: { type: "f", value: 0.0 },
                        resolution: { type: 'v2', value: new THREE.Vector2() },
                        lightPosition: {type: 'v3', value: new THREE.Vector3(700, 700, 700)}
                    }]),
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                transparent: true
            }
        )

        material.side = THREE.DoubleSide
        material.extensions.derivatives = true
        material.depthTest = true
        material.depthWrite = false
        material.polygonOffset = true
        material.polygonOffsetFactor = -4

        hmr.enable(cache, material)
        return material
    }


}