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
            throw new Error("Canvas offscreen")
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
        //https://antongerdelan.net/opengl/raycasting.html

        const I_projectionMatrix = mat4.create();
        mat4.invert(I_projectionMatrix, this.projectionMatrix)

        const I_worldMatrix = mat4.create()
        mat4.invert(I_worldMatrix, this.viewMatrix)

        var ray_eye = vec4.transformMat4(vec4.create(), clipSpace, I_projectionMatrix);
        ray_eye = vec4.fromValues(ray_eye[0], ray_eye[1], -1.0, 0.0);

        const ray_world = vec4.transformMat4(vec4.create(), ray_eye, I_worldMatrix);

        vec4.normalize(ray_world, ray_world)
        ray_world[3] = 1

        const ray = new Ray(
            this.Position,
            ray_world
        )

        return ray
    }

    /**
     * Converts screenPosition relative to the canvas to clip space
     * @param {vec2} screenPosition The position relative to the canvas
     * @returns {vec4} The clip-space coordinates
     */
    ScreenPositionToClipSpace(screenPosition: vec2): vec4 {
        if (this._gl.canvas instanceof OffscreenCanvas)
            throw new Error("Canvas is offscreen")

        const x = Remap(
            screenPosition[0],
            0, this._gl.canvas.clientWidth,
            -1, 1
        )
        const y = Remap(
            screenPosition[1],
            0, this._gl.canvas.clientHeight,
            -1, 1
        )

        return vec4.fromValues(
            x, y,
            -1, 1
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