/**
 * Contains definition for the mesh renderer component
 */

import { IComponent } from "../component";
import { Entity } from "../entity";
import { IRenderer } from "../renderer";
import { Transform, TRANSFORM_IDENTIFIER } from "./transform";

export const MESH_RENDERER_IDENTIFIER = "MESH_RENDERER"

class MeshRenderer implements IComponent, IRenderer {
    public enabled: boolean = true;

    //@ts-expect-error, engine handles this
    private transform: Transform;

    IsCompatable(object: Entity): boolean {
        return object.GetComponentOfType(TRANSFORM_IDENTIFIER) != null
    }

    OnAttach(parent: Entity): void {
        //@ts-expect-error, only called if IsCompatable() returns true, so never null
        this.transform = parent.GetComponentOfType(TRANSFORM_IDENTIFIER);
    }
    Start(): void { }
    Update(): void { }
    OnRender(context: WebGLRenderingContext): void {
        const modelMatrix = this.transform.ModelMatrix;

    }

    get WhoAmI(): string {
        return MESH_RENDERER_IDENTIFIER;
    }
}