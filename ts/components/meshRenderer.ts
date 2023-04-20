/**
 * Contains definition for the mesh renderer component
 */

import { Model } from "obj-lib/lib/model";
import { IComponent, IRenderer, Entity, RenderData } from "../";
import { Transform, TRANSFORM_IDENTIFIER } from "./transform";

export const MESH_RENDERER_IDENTIFIER = "MESH_RENDERER"

class MeshRenderer implements IComponent, IRenderer {
    public enabled: boolean = true;


    public model: Model | null = null;
    public program: WebGLProgram | null = null

    //@ts-expect-error, engine handles this
    private transform: Transform;

    IsCompatable(object: Entity): boolean {
        return object.GetComponentOfType(TRANSFORM_IDENTIFIER) != null
    }

    OnAttach(parent: Entity): void {
        //@ts-expect-error, IsCompatable will only let this run if it can be attatched
        this.transform = parent.GetComponentOfType(TRANSFORM_IDENTIFIER);
    }
    Start(): void { }
    Update(): void { }
    OnRender(data: RenderData): void {
        if (this.model === null || !this.enabled) return //skip rendering if nothing to render

        const modelMatrix = this.transform.ModelMatrix;
        const renderProgram = this.program != null ? this.program : data.defaultProgram

        //todo rendering here
    }

    get WhoAmI(): string {
        return MESH_RENDERER_IDENTIFIER;
    }
}