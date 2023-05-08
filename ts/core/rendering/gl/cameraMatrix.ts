import { mat4 } from "gl-matrix";

const CAMERA_NEAR = 0.01;
const CAMERA_FAR = 100;

/**
 * Class representing a 4x4 projection matrix
 * Uses lazy evaluation for the matrix to save processing power
 * @category Rendering
 */
export class CameraMatrix {
    private projectionMatrix: mat4 = mat4.create();
    private transformationMatrix: mat4 = mat4.create();

    private anyMatrixUpdated: boolean = true;

    private finalMatrix: mat4 = mat4.create();

    private _gl: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext) {
        this._gl = gl;
        this.RecomputeProjectionMatrix();
    }

    /**
     * Recomputes matrix
     */
    public RecomputeProjectionMatrix() {
        if (this._gl.canvas instanceof OffscreenCanvas)
            throw new Error("Canvas is offscreen")

        mat4.perspective(
            this.projectionMatrix,
            this.Fov,
            this.AspectRatio,
            this.NearClip,
            this.FarClip
        );
        this.anyMatrixUpdated = true;
    }

    set TransformationMatrix(v: mat4) {
        this.transformationMatrix = v;
        this.anyMatrixUpdated = true;
    }
    set ProjectionMatrix(v: mat4) {
        this.projectionMatrix = v;
        this.anyMatrixUpdated = true;
    }

    get Matrix() {
        if (this.anyMatrixUpdated) {
            this.anyMatrixUpdated = false
            mat4.mul(this.finalMatrix, this.transformationMatrix, this.projectionMatrix);// transform the projection, not project the transformation
        }

        return this.finalMatrix;
    }

    get NearClip(): number {
        return CAMERA_NEAR
    }
    get FarClip(): number {
        return CAMERA_FAR
    }

    private fov: number = 45 / 180 * Math.PI;
    get Fov(): number {
        return this.fov;
    }
    set Fov(v: number) {
        this.fov = v;
    }

    get AspectRatio(): number {
        return this._gl.canvas.width / this._gl.canvas.height;
    }
}