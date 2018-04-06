import * as THREE from 'three';

export default class AudioAnalyser {

    track: string;
    loop: boolean;
    fftSize: number;
    listener: THREE.AudioListener;
    audioLoader: THREE.AudioLoader;
    sound: THREE.Audio;
    buffer: THREE.AudioBuffer;
    analyser: THREE.AudioAnalyser;
    volume: number;

    constructor( track: string, loop: boolean, fftSize: number){

        this.track = track
        this.listener = new THREE.AudioListener()
        this.audioLoader = new THREE.AudioLoader()
        this.sound =  new THREE.Audio(this.listener)
        this.loop = loop
        this.fftSize = fftSize

    }

    loadTrack(): Promise<object> {

        return new Promise((resolve: Function, reject: Function) => {

            this.audioLoader.load(
                this.track,
                ((buffer: THREE.AudioBuffer) => {
                    this.sound.setBuffer( buffer )
                    this.sound.setLoop(this.loop)
                    this.sound.setVolume(0.5)
                    this.analyser = new THREE.AudioAnalyser( this.sound, this.fftSize )
                    resolve(buffer)
                }),
                (xhr: string) => {

                },
                (err: string) => {
                    reject(err)
                }
            )
        })

    }

    playTrack(): void {
        this.sound.play()
    }

    setVol(volume: number): void {
        this.sound.setVolume(volume);
    }

    get trackAnalyser(): THREE.AudioAnalyser {
        return this.analyser;
    }

    get getFrequency(): number {
        return this.analyser.getAverageFrequency()
    }

    get getListener(): THREE.AudioListener {
        return this.listener;
    }
}