import { ShaderProgram } from "./shaderProgram";

/**
 * Represents an attribute in a shader
 * @category Internal
 */
export class ShaderAttribute {
    public buffer: WebGLBuffer;

    public location: number;
    public size: number;
    public type: number;

    /**
     * 
     * @param {number} location The location of the shader attribute(gl.GetAttributeLocation)
     * @param {number} size The amount of components that are "given" to each vertex shader call
     * @param {number} type A GLENUM of the type of number given eg gl.FLOAT or gl.UINT16
     * @param {WebGLBuffer} buffer
     */
    constructor(location: number, size: number, type: number, buffer: WebGLBuffer) {
        this.location = location;
        this.size = size;
        this.type = type;

        this.buffer = buffer;
    }
    /**
     * Applies attribute to a shader program
     * @param {WebGL2RenderingContext} gl 
     * @param {ShaderProgram} shader 
     */
    public Apply(gl: WebGL2RenderingContext, shader: ShaderProgram) {
        shader.Use(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(
            this.location,
            this.size,
            this.type,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(this.location)
    }
}