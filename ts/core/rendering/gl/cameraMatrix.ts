import { mat4, vec2, vec3, vec4 } from "gl-matrix";
import { make, constants, Remap } from "../../../math";
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
        const pos = mat4.getTranslation(make.vec3, this.ViewMatrix)
        return vec4.fromValues(
            pos[0],
            pos[1],
            pos[2],
            1
        )
    }
    get Direction(): vec4 {
        const dir = mat4.getRotation(make.quat, this.ViewMatrix)
        let dir_vector = vec4.transformQuat(make.vec4, constants.FORWARD, dir)

        vec4.normalize(dir_vector, dir_vector)

        return dir_vector
    }

    get FocalPoint(): vec4 {
        const delta = vec4.scale(make.vec4, this.Direction, this.ProjectionMatrix[0])//assuming index [0] is matrix position 11
        return vec4.add(delta, delta, this.Position)
    }


    /**
     * Converts a point in clip space to a Ray.
     * @param {vec4} ndc The position in clip space, use (x, y, 0, 0)(SEE DOUBLE CHECK IN SOURCE) by default
     * @returns {Ray} The computed ray
     */
    ClipSpaceToRay(ndc: vec3): Ray {
        //https://antongerdelan.net/opengl/raycasting.html

        const I_projectionMatrix = mat4.create();
        mat4.invert(I_projectionMatrix, this.projectionMatrix)

        const I_worldMatrix = mat4.create()
        mat4.invert(I_worldMatrix, this.viewMatrix)

        const ray_clip = vec4.fromValues(
            ndc[0],
            ndc[1],
            -1,
            1
        )

        var ray_eye = vec4.transformMat4(make.vec4, ray_clip, I_projectionMatrix);
        ray_eye = vec4.fromValues(
            ray_eye[0],
            ray_eye[1],
            -1,
            0
        )

        const ray_world = vec4.transformMat4(make.vec4, ray_eye, I_worldMatrix);

        vec4.normalize(ray_world, ray_world)
        const v4_ray_world = vec4.fromValues(
            ray_world[0],
            ray_world[1],
            ray_world[2],
            1
        )

        const ray = new Ray(
            this.FocalPoint,
            vec4.scale(v4_ray_world, v4_ray_world, -1)//flip ray
        )


        return ray
    }

    /**
     * Converts screenPosition relative to the canvas to clip space
     * @param {vec2} screenPosition The position relative to the canvas
     * @returns {vec4} The clip-space coordinates
     */
    ScreenPositionToClipSpace(screenPosition: vec2): vec3 {
        if (this._gl.canvas instanceof OffscreenCanvas)
            throw new Error("Canvas is offscreen")

        const rect = this._gl.canvas.getBoundingClientRect()

        const x = Remap(
            screenPosition[0],
            rect.x, rect.x + rect.width,
            -1, 1
        )
        const y = Remap(
            screenPosition[1],
            rect.y, rect.y + rect.height,
            -1, 1
        )

        return vec3.fromValues(
            -x, y,
            1
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