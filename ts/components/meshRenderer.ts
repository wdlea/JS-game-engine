import { IComponent, Entity } from "../";
import { Camera } from "../core/rendering/camera";
import { IRenderer } from "../core/rendering/iRenderer";
import { MeshInstance } from "../core/rendering/meshInstance";
import { FrameStats } from "../debugger";
import { Transform, TRANSFORM_IDENTIFIER } from "./transform";

export const MESH_RENDERER_IDENTIFIER = "MESH_RENDERER"

/**
 * A basic renderer
 * @implements {IComponent}
 * @implements {IRenderer}
 * @category Components
 */
export class MeshRenderer implements IComponent, IRenderer {
    public enabled: boolean = true;


    private mesh: MeshInstance | undefined;
    public program: WebGLProgram | null = null



    //@ts-expect-error, engine handles this
    private transform: Transform;

    set Mesh(m: MeshInstance) {
        this.mesh = m;
    }

    OnRender(camera: Camera, frameStats: FrameStats): void {
        if (this.mesh != undefined) {
            camera.DrawMesh(this.mesh, frameStats);
            frameStats.IndexCount += this.mesh.mesh.indexCount
        }
    }

    get WhoAmI(): string {
        return MESH_RENDERER_IDENTIFIER;
    }

    IsCompatable(object: Entity): boolean {
        return object.GetComponentOfType(TRANSFORM_IDENTIFIER) != null
    }

    OnAttach(parent: Entity): void {
        //@ts-expect-error, IsCompatable will only let this run if it can be attatched
        this.transform = parent.GetComponentOfType(TRANSFORM_IDENTIFIER);
    }
    Start(): void { }
    Update(): void { }
}