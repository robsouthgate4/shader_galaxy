import {Blending, Color, LensFlareProperty, Object3D, Texture, Vector3} from "three/three-core";

declare module "THREE" {
    export class Lensflare extends Object3D {
        constructor(texture?: Texture, size?: number, distance?: number, blending?: Blending, color?: Color);

        lensFlares: LensFlareProperty[];
        positionScreen: Vector3;
        customUpdateCallback: (object: Lensflare) => void;

        addElement(object: Object3D): void;
        addElement(texture: Texture, size?: number, distance?: number, blending?: Blending, color?: Color): void;

        updateLensFlares(): void;

    }
    export class LensflareElement extends Object3D {
        constructor(texture?: Texture, size?: number, distance?: number, color?: Color)
    }
}