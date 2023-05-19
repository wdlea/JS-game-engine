import { IComponent, Entity } from "../";
import { Camera } from "../core/rendering/camera";
import { IRenderer } from "../core/rendering/iRenderer";
import { MeshInstance } from "../core/rendering/meshInstance";
import { ObjectSettings } from "../core/rendering/uniforms";
import { Transform, TRANSFORM_IDENTIFIER } from "./transform";

export const MESH_RENDERER_IDENTIFIER = "MESH_RENDERER"

/**
 * A basic renderer
 * @implements {IComponent}
 * @implements {IRenderer}
 * 
 * @memberof module:Components
 */
export class MeshRenderer implements IComponent, IRenderer {
    public enabled: boolean = true;


    private mesh: MeshInstance | undefined;
    public program: WebGLProgram | null = null

    private settings!: ObjectSettings;

    private transform!: Transform;

    //@ts-expect-error, engine handles this
    private transform: Transform;

    set Mesh(m: MeshInstance) {
        this.mesh = m;
    }

    OnRender(camera: Camera): void {
        if (this.mesh != undefined) {
            this.settings.TransformMatrix = this.transform.ModelMatrix;
            camera.DrawMesh(this.mesh, this.settings);
        }
    }

    get WhoAmI(): string {
        return MESH_RENDERER_IDENTIFIER;
    }

    IsCompatable(object: Entity): boolean {
        return object.GetComponentOfType(TRANSFORM_IDENTIFIER) != null
    }

    OnAttach(parent: Entity): void {
        //@ts-expect-error Will always be transform
        this.transform = parent.GetComponentOfType(TRANSFORM_IDENTIFIER);

        this.settings = new ObjectSettings(
            this.transform.ModelMatrix,
            0
        )
    }
    Start(): void { }
    Update(): void { }

    set MaterialIndex(value: number) {
        this.settings.MaterialIndex = value
    }
}