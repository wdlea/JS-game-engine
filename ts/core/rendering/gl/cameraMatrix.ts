import { mat4, vec2, vec4 } from "gl-matrix";
import { trash, constants, Remap } from "../../../math";
import { Ray } from "../../../math/ray";

const CAMERA_NEAR = 0.01;
const CAMERA_FAR = 10000;

/**
 * Class representing a 4x4 projection matrix
 * Uses lazy evaluation for the matrix to save processing power
 * @category Rendering
 */

export class CameraMatrix {
    private projectionMatrix: mat4 = mat4.create();
    private viewMatrix: mat4 = mat4.create();

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

    set ViewMatrix(v: mat4) {
        this.viewMatrix = v;
        this.anyMatrixUpdated = true;
    }
    set ProjectionMatrix(v: mat4) {
        this.projectionMatrix = v;
        this.anyMatrixUpdated = true;
    }

    get ProjectionMatrix() {
        return this.projectionMatrix;
    }
    get ViewMatrix() {
        return this.viewMatrix;
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
        if (this._gl.canvas instanceof HTMLCanvasElement)
            return this._gl.canvas.clientWidth / this._gl.canvas.clientHeight;
        else
            return this._gl.canvas.width / this._gl.canvas.height;
    }

    get Position(): vec4 {
        return vec4.transformMat4(vec4.create(), constants.ORIGIN, this.viewMatrix)
    }
    get Direction(): vec4 {
        const d = vec4.create()
        vec4.transformMat4(d, constants.FORWARD, this.viewMatrix)

        return vec4.normalize(d, d);
    }


    /**
     * Converts a point in clip space to a Ray.
     * @param {vec4} clipSpace The position in clip space, use (x, y, 0, 0)(SEE DOUBLE CHECK IN SOURCE) by default
     * @returns {Ray} The computed ray
     */
    ClipSpaceToRay(clipSpace: vec4): Ray {
        //https://stackoverflow.com/a/46079014
        // ^ was so handy when making this function, worth a read


        // Find x, the distance from the tip of the frustum to the closest plane
        //                _
        //               /|\        
        //              /_|_\   ∠Fovy 
        //             /  |  \        
        //            /   L   \          
        //           /    |    \  
        //  (-1, 0, L) /__B__|__A__\ (1, 0, L)
        //             (0, 0, L)  
        // B = A = 1, same lengths

        // tan(Fovy/2) = A/x
        // tan(Fovy/2) = 1/x
        // x = 1/tan(Fovy/2)
        // Proud of this, it used to be called x and i made it up from the above diagram,
        // then i discovered that this equation is the focal length of the camera
        // const focalLength = 1 / Math.tan(this.Fovy / 2);
        // but it is also matrix element 11 (one-one or (1, 1), not eleven) so im using
        // the value in the matrix to save calculations
        const focalLength = this.projectionMatrix[11]

        // Double check my dodgy math
        if (focalLength <= 0)
            throw new Error("focalLength should NEVER be 0, which would be 180° Fovy, unexpected behavior")

        // find focal point
        const focalPoint = vec4.add(trash.vec4, this.Position, vec4.scale(trash.vec4, this.Direction, focalLength))

        // calculate clip spaces position in world
        const worldSpace = vec4.create()
        worldSpace[0] = clipSpace[0]
        worldSpace[1] = clipSpace[1]
        worldSpace[2] = focalLength

        vec4.add(
            worldSpace,
            this.Position,
            vec4.mul(
                trash.vec4,
                this.Direction,
                worldSpace
            )
        )

        //make the ray
        //it has to start from the rayOrigin and intercept the position in clip-space
        const ray = Ray.FromPoints(
            focalPoint,
            worldSpace,
            true
        );

        // apply transformations to ray so that it is positioned like the camera
        ray.Transform(this.viewMatrix);

        return ray;
    }

    /**
     * Converts screenPosition relative to the canvas to clip space
     * @param {vec2} screenPosition The position relative to the canvas
     * @returns {vec4} The clip-space coordinates
     */
    ScreenPositionToClipSpace(screenPosition: vec2): vec4 {
        const x = Remap(
            screenPosition[0],
            0, this._gl.canvas.width,
            -1, 1
        )
        const y = Remap(
            screenPosition[1],
            0, this._gl.canvas.height,
            -1, 1
        )

        return vec4.fromValues(
            x, y,
            0, 0
        )
    }

    /**
     * Converts a screen position to a ray, representing the points overlaps with world space
     * @param {vec2} screenPosition The position relative to the canvas
     * @returns {Ray} The computed ray
     */
    ScreenPositionToRay(screenPosition: vec2): Ray {
        return this.ClipSpaceToRay(this.ScreenPositionToClipSpace(screenPosition))
    }
}