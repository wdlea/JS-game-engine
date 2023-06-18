import { vec2, vec4 } from "gl-matrix";
import { Camera } from "../core";
import { Ray, Remap } from "../math";

/**
 * Cursor is my "bugfix" for the 
 * cursor being out of sync with the ray's position
 * It steps the ray by one, then projects that point 
 * back to the camera.
 * NOTE: call Activate to start tracking position
 */
export class Cursor {
    private camera: Camera;
    private ray: Ray | undefined;
    cursorElement: HTMLElement | undefined;
    cursorAccuratePlane: number = 1;
    cursorAccuratePlaneOffset: number = 0;

    constructor(camera: Camera) {
        this.camera = camera
        this.pos = vec2.create()
    }


    get Ray(): Ray {
        if (this.ray === undefined) {
            this.ray = this.camera.CameraMatrix.ScreenPositionToRay(this.Pos)
        }
        return this.ray
    }

    pos: vec2;
    get Pos(): vec2 {
        return this.pos
    }

    get AlteredPos(): vec2 {
        const point = this.Ray.InterceptOffsetPlane(this.cursorAccuratePlaneOffset, this.cursorAccuratePlane)
        const newPos = vec4.transformMat4(point, point, this.camera.CameraMatrix.ProjectionMatrix)
        const w = newPos[3]


        if (this.camera._gl.canvas instanceof OffscreenCanvas)
            throw Error("Canvas is offscreen")

        //divide by w to perform perspective divide
        const canvasPos = vec2.fromValues(
            Remap(newPos[0] / w, -1, 1, 0, this.camera._gl.canvas.clientWidth),
            Remap(newPos[1] / w, -1, 1, 0, this.camera._gl.canvas.clientHeight),
        )
        return canvasPos
    }


    private HandleMouseMove(ev: MouseEvent) {
        this.pos = vec2.fromValues(
            ev.clientX,
            ev.clientY
        )
        this.ray = undefined//reset ray for recomputation

        if (this.cursorElement !== undefined) {
            const [x, y] = this.AlteredPos
            this.cursorElement.style.left = String(x) + "px"
            this.cursorElement.style.top = String(y) + "px"
        }
    }
    private BoundHandleMouseMove = this.HandleMouseMove.bind(this)

    /**
     * Activates the cursor
     */
    Activate() {
        document.onmousemove = this.BoundHandleMouseMove
    }
}