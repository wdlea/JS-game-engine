import { vec2, vec4 } from "gl-matrix";
import { Camera } from "../core";
import { Ray, Remap } from "../math";

class Cursor {
    private camera: Camera;
    private ray: Ray | undefined;
    private cursorElement: HTMLElement | undefined;

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
        const point = this.Ray.Step(1)
        const newPos = vec4.transformMat4(point, point, this.camera.CameraMatrix.ProjectionMatrix)

        if (this.camera._gl.canvas instanceof OffscreenCanvas)
            throw Error("Canvas is offscreen")

        const canvasPos = vec2.fromValues(
            Remap(newPos[0], -1, 1, 0, this.camera._gl.canvas.clientWidth),
            Remap(newPos[1], -1, 1, 0, this.camera._gl.canvas.clientHeight),
        )
        return canvasPos
    }

    constructor(camera: Camera) {
        this.camera = camera
        this.pos = vec2.create()
    }

    HandleMouseMove(ev: MouseEvent) {
        this.pos = vec2.fromValues(
            ev.clientX,
            ev.clientY
        )
        this.ray = undefined//reset ray for recomputation
    }

    Activate() {
        document.onmousemove = this.HandleMouseMove
    }
}