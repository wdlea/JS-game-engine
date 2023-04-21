
export class ShaderAttribute {
    public buffer: WebGLBuffer;

    public location: number;
    public size: number;
    public type: number;

    /**
     * 
     * @param location number, the location of the shader attribute(gl.GetAttributeLocation)
     * @param size number, the amount of components that are "given" to each vertex shader call
     * @param type number, a GLENUM of the type of number given eg gl.FLOAT or gl.UINT16
     * @param buffer WebGLBuffer
     */
    constructor(location: number, size: number, type: number, buffer: WebGLBuffer) {
        this.location = location;
        this.size = size;
        this.type = type;

        this.buffer = buffer;
    }

    public Apply(gl: WebGL2RenderingContext, shader: WebGLProgram) {
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