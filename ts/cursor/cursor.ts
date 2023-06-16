import { vec2 } from "gl-matrix";
import { Camera } from "../core";
import { Ray } from "../math";

class Cursor {
    private camera: Camera;
    private ray: Ray | undefined;

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