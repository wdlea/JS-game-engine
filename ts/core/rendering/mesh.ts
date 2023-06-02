import { Model } from "@wdlea/obj-lib";
import { Vector3, Vector4 } from "@wdlea/obj-lib/lib/vectors";
import { MeshInstance } from "./meshInstance";
import { ShaderProgram } from "./shaderProgram";

/**
 * Class that represents a loaded mesh in the engine
 * @see MeshInstance
 * @category Rendering
 */
export class EngineMesh {
    vertexBuffer: WebGLBuffer;
    indexBuffer: WebGLBuffer;
    UVBuffer: WebGLBuffer;
    NormalBuffer: WebGLBuffer;

    indexCount: number;

    /**
     * Makes a new EngineMesh from data and buffers it
     * @param {WebGL2RenderingContext} gl 
     * @param {Float32Array} vertices 
     * @param {Uint16Array} indices 
     * @param {Float32Array} UVs 
     * @param {Float32Array} Normals 
     */
    constructor(gl: WebGL2RenderingContext, vertices: Float32Array, indices: Uint16Array, UVs: Float32Array, Normals: Float32Array) {
        this.indexCount = indices.length;

        // make buffers

        let tVerticesBuffer = gl.createBuffer();
        if (tVerticesBuffer === null)
            throw Error("Could not create buffer")

        let tIndexBuffer = gl.createBuffer();
        if (tIndexBuffer === null)
            throw Error("Could not create buffer")

        let tUVBuffer = gl.createBuffer();
        if (tUVBuffer === null)
            throw Error("Could not create buffer")

        let tNormalBuffer = gl.createBuffer();
        if (tNormalBuffer === null)
            throw Error("Could not create buffer")

        this.vertexBuffer = tVerticesBuffer;
        this.indexBuffer = tIndexBuffer;
        this.UVBuffer = tUVBuffer;
        this.NormalBuffer = tNormalBuffer;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, UVs, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.NormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, Normals, gl.STATIC_DRAW);


        //unbind buffer to prevent bugs later
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    /**
     * Creates an EngineMesh from a model
     * @param {WebGL2RenderingContext} gl 
     * @param {Model} model 
     * @returns {EngineMesh}
     */
    static FromModel(gl: WebGL2RenderingContext, model: Model): EngineMesh {
        let Vertices: Float32Array = new Float32Array(model.vertices.length * 4);
        let UVs: Float32Array = new Float32Array(model.UVs.length * 3);
        let Normals: Float32Array = new Float32Array(model.normals.length * 3);

        for (let i = 0; i < model.vertices.length; i++) {
            Vertices.set(model.vertices[i], i * 4);
        }
        for (let i = 0; i < model.UVs.length; i++) {
            Normals.set(model.normals[i], i * 3);
        }
        for (let i = 0; i < model.normals.length; i++) {
            Normals.set(model.normals[i], i * 3);
        }

        return new EngineMesh(
            gl,
            new Float32Array(Vertices),
            new Uint16Array(model.indices),
            new Float32Array(UVs),
            new Float32Array(Normals)
        )
    }

    /**
     * Creates a MeshInstance from the given mesh
     * @param {ShaderProgram} shader The shader program to use when rendering the instance
     * @returns {MeshInstance}
     */
    MakeInstance(shader: ShaderProgram): MeshInstance {
        return new MeshInstance(
            Object.freeze(this),
            Object.freeze(shader)
        )
    }
}