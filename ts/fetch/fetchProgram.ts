/**
 * Contains the code to fetch, compile and link a shader program
 */

import { FetchShader } from "./fetchShader"

export const PROGRAM_PATH = "/shaders"//the directory that the shaders are stored within
export const FRAGMENT_SHADER_SUFFIX = ".frag"
export const VERTEX_SHADER_SUFFIX = ".vert"

/**
 * resolves into a webglprogram, given the name of the program
 * paths for shader are made with this:
 * @example vertex shader
 * PROGRAM_PATH + name + VERTEX_SHADER_SUFFIX
 * @example fragment shader
 * PROGRAM_PATH + name + FRAGMENT_SHADER_SUFFIX
 * 
 * all constants used above are exported
 * 
 * @param gl WebGLRenderingContext, the webgl rendering context
 * @param name string, the first part of the path to the shader
 * @returns a promise resolved to the shader program
 */
export function FetchProgram(gl: WebGLRenderingContext, name: string): Promise<WebGLProgram> {
    return new Promise<WebGLProgram>(
        async (resolve, reject) => {
            const vsProm = FetchShader(gl, PROGRAM_PATH + name + VERTEX_SHADER_SUFFIX, gl.VERTEX_SHADER);
            const fsProm = FetchShader(gl, PROGRAM_PATH + name + FRAGMENT_SHADER_SUFFIX, gl.FRAGMENT_SHADER);

            const program = gl.createProgram();
            if (program === null) {
                reject("Could not create webgl program")
                throw Error("Could not create webgl program");
            }


            //doing operations in series becuase i can expect fs to resolve after 
            //vs and this minimises downtime, effishency(efficiency) 100

            const vs = await vsProm
            gl.attachShader(program, vs);

            const fs = await fsProm
            gl.attachShader(program, fs);

            gl.linkProgram(program);
            gl.validateProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                const errmsg = "Unable to link program: " + gl.getProgramInfoLog(program);
                reject(errmsg);
                throw Error(errmsg);
            }

            resolve(program);
        }
    )
}