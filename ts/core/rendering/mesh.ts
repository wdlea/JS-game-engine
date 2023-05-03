import { Model } from "obj-lib";
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
        let vertices: Float32Array = new Float32Array(model.vertices.length * 4);
        let UVs: Float32Array = new Float32Array(model.UVs.length * 3);
        let Normals: Float32Array = new Float32Array(model.Normals.length * 3);

        let i = 0;
        model.vertices.forEach(
            (v) => {
                vertices.set(v, i * 4)
                i++;
            }
        )
        i = 0;
        model.UVs.forEach(
            (u) => {
                UVs.set(u, i * 3)
                i++;
            }
        )
        i = 0;
        model.Normals.forEach(
            (n) => {
                Normals.set(n, i * 3);
                i++;
            }
        )

        return new EngineMesh(
            gl,
            new Float32Array(vertices),
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