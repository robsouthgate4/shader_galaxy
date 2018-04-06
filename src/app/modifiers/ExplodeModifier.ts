import * as THREE from "three"

export default class ExplodeModifier {

    modify(geometry: THREE.Geometry): void {

        var vertices = [];

        for ( let i = 0, il = geometry.faces.length; i < il; i ++ ) {

            const n = vertices.length;

            const face = geometry.faces[ i ];

            const a = face.a;
            const b = face.b;
            const c = face.c;

            const va = geometry.vertices[ a ];
            const vb = geometry.vertices[ b ];
            const vc = geometry.vertices[ c ];

            vertices.push( va.clone() );
            vertices.push( vb.clone() );
            vertices.push( vc.clone() );

            face.a = n;
            face.b = n + 1;
            face.c = n + 2;

        }

        geometry.vertices = vertices;
    }
}