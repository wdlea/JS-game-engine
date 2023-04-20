/**
 * Contains functions that makes shaders from source
 */

namespace Rendering {
    export function MakeShaderFromSource(gl: WebGLRenderingContext, source: string, type: number): WebGLShader {
        const shader = gl.createShader(type);
        if (shader === null) {
            throw Error("Could not create webgl shader, perhaps you gave the wrong type argument enum")
        }

        gl.shaderSource(shader, source);
        gl.compileShader(shader)

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw Error("Could not compile shader: " + gl.getShaderInfoLog(shader))
        }
        return shader;
    }
}

