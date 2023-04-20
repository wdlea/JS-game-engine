/**
 * Contains definition for the mesh renderer component
 */

import { IComponent, IRenderer, Entity, RenderData, LoadedMesh } from "../";
import { Transform, TRANSFORM_IDENTIFIER } from "./transform";

export const MESH_RENDERER_IDENTIFIER = "MESH_RENDERER"


class MeshRenderer implements IComponent, IRenderer {
    public enabled: boolean = true;


    private mesh: LoadedMesh | undefined;
    public program: WebGLProgram | null = null



    //@ts-expect-error, engine handles this
    private transform: Transform;

    set Mesh(m: LoadedMesh) {
        this.mesh = m;
    }

    OnRender(data: RenderData): void {
        const gl = data.context;

        if (this.mesh === undefined || !this.enabled) return //skip rendering if nothing to render

        const modelMatrix = this.transform.ModelMatrix;
        const renderProgram = this.program != null ? this.program : data.defaultProgram

        gl.useProgram(renderProgram);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);

        const VERTEX_ATTRIB_LOCATION = gl.getAttribLocation(renderProgram, "uVertex");

        gl.vertexAttribPointer(
            VERTEX_ATTRIB_LOCATION,
            4,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(VERTEX_ATTRIB_LOCATION);//might be wrong

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
        const NORMAL_ATTRIB_LOCATION = gl.getAttribLocation(renderProgram, "uNormal");
        gl.vertexAttribPointer(
            NORMAL_ATTRIB_LOCATION,
            3,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(NORMAL_ATTRIB_LOCATION);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.textureBuffer);
        const TEXTURE_ATTRIB_LOCATION = gl.getAttribLocation(renderProgram, "uTexture")
        gl.vertexAttribPointer(
            TEXTURE_ATTRIB_LOCATION,
            3,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(TEXTURE_ATTRIB_LOCATION);

        gl.uniformMatrix4fv(
            gl.getUniformLocation(renderProgram, "uModelMatrix"),
            false,
            modelMatrix
        )

        gl.uniformMatrix4fv(
            gl.getUniformLocation(renderProgram, "uProjectionMatrix"),
            false,
            data.projectionMatrix
        )

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.mesh.indexCount, gl.UNSIGNED_SHORT, 0)
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