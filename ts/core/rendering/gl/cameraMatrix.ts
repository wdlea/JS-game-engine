import { mat4, vec2, vec3, vec4 } from "gl-matrix";
import { Ray } from "../../../math/ray";

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
            this.Fovy,
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

    private fovy: number = 45 / 180 * Math.PI;
    get Fovy(): number {
        return this.fovy;
    }
    set Fovy(v: number) {
        this.fovy = v;
    }

    get AspectRatio(): number {
        return this._gl.canvas.width / this._gl.canvas.height;
    }

    /**
     * Converts a point in clip space to a Ray.
     * @param {vec4} clipSpace The position in clip space, use (x, y, 0, 0)(SEE DOUBLE CHECK IN SOURCE) by default
     * @returns {Ray} The computed ray
     */
    ClipSpaceToRay(clipSpace: vec4): Ray {
        // Find x, the distance from the tip of the frustum to the closest plane
        //                _
        //               /|\        
        //              /_|_\   ∠Fovy 
        //             /  |  \        
        //            /   x   \          
        //           /    |    \  
        //  (-1, 0) /__B__|__A__\ (1, 0)
        //             (0, 0)   <--------------- Double check this value, it may be (0, -1)
        // B = A = 1, same lengths

        // tan(Fovy/2) = A/x
        // tan(Fovy/2) = 1/x
        // x = 1/tan(Fovy/2)
        const x = 1 / Math.tan(this.Fovy / 2);

        //Double check my dodgy math
        if (x <= 0)
            throw new Error("x should NEVER be 0, which would be 180° Fovy, unexpected behavior")

        //make RayOrigin which is at (0, 0, x)
        const rayOrigin = vec4.fromValues(0, 0, x, 0);

        //make the ray
        //it has to start from the rayOrigin and intercept the position in clip-space
        const ray = Ray.FromPoints(
            rayOrigin,
            clipSpace,
            true
        );

        // apply transformations to ray so that it is positioned like the camera
        ray.Transform(this.transformationMatrix);

        return ray;
    }

    ScreenPositionToClipSpace(screenPosition: vec2): vec4 {
        throw new Error("Not implemented")
    }
}