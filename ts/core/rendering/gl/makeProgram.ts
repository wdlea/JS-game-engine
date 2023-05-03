/**
 * Contains the function that makes a program given source
 */

import { MakeShaderFromSource } from "./makeShader";

/**
 * Constructs a program from shaders
 * @category Internal
 * @param gl WebGLRenderingContext, the gl context
 * @param vs WebGLShader, the vertex shader object
 * @param fs WebGLShader, the fragment shader object
 * @returns WebGLProgram, the compiled program
 */
export function MakeProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram {
    const program = gl.createProgram();
    if (program === null) {
        throw Error("Could not create webgl program");
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    gl.linkProgram(program);
    gl.validateProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw Error("Could not link webgl program: " + gl.getProgramInfoLog(program))
    }

    return program
}

/**
 * Constructs a program from source code of its shaders
 * @category Internal
 * @param gl WebGLRenderingContext, the gl context
 * @param vss string, vertex shader source
 * @param fss string, fragment shader source
 * @returns WebGLProgram, the compiled program
 */
export function MakeProgramFromSource(gl: WebGLRenderingContext, vss: string, fss: string): WebGLProgram {
    const vs = MakeShaderFromSource(gl, vss, gl.VERTEX_SHADER);
    const fs = MakeShaderFromSource(gl, fss, gl.FRAGMENT_SHADER);

    return MakeProgram(gl, vs, fs);
}
