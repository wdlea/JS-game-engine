import { mat4 } from "gl-matrix";

const CAMERA_NEAR = 0.01;
const CAMERA_FAR = 100;


export class CameraMatrix {
    private projectionMatrix = mat4.create();
    private transformationMatrix = mat4.create();

    private anyMatrixUpdated = true;

    private finalMatrix = mat4.create();

    constructor() {
        this.RecomputeProjectionMatrix();
    }

    public RecomputeProjectionMatrix() {
        //@ts-expect-error, probably wouldent happen, it will TODO make it not happen
        const aspectRatio = this._gl.canvas.clientWidth / this._gl.canvas.clientWidth;
        mat4.perspective(
            this.projectionMatrix,
            45 / 180 * Math.PI,
            aspectRatio,
            CAMERA_NEAR,
            CAMERA_FAR
        );
        this.anyMatrixUpdated = true;
    }

    set TransformationMatrix(v: mat4) {
        this.transformationMatrix = v;
        this.anyMatrixUpdated = true;
    }

    get Matrix() {
        if (this.anyMatrixUpdated) {
            this.anyMatrixUpdated = false
            mat4.mul(this.finalMatrix, this.transformationMatrix, this.projectionMatrix);// transform the projection, not project the transformation
        }

        return this.finalMatrix;
    }
}