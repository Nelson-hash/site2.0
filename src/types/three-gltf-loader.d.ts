// src/types/three-gltf-loader.d.ts
declare module 'three' {
  export class GLTFLoader {
    constructor();
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (progress: ProgressEvent) => void,
      onError?: (error: ErrorEvent) => void
    ): void;
  }

  export interface GLTF {
    scene: THREE.Group;
    scenes: THREE.Group[];
    cameras: THREE.Camera[];
    animations: THREE.AnimationClip[];
    asset: {
      copyright?: string;
      generator?: string;
      version?: string;
      minVersion?: string;
      extensions?: any;
      extras?: any;
    };
    parser: any;
    userData: any;
  }
}
