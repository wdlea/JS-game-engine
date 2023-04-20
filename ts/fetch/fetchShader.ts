/**
 * Contains the code to fetch and compile a shader
 */

import { GetData } from "./sendRequest"

/**
 * Asyncronously fetches and compiles a shader program from a given url
 * @param gl WebGLRenderingContext, the webgl rendering context
 * @param url string, the relative url of the item
 * @param type number, the webgl enum that represents the type of the shader
 * @returns a promise that is resolved to the shader
 */
export function FetchShader(gl: WebGLRenderingContext, url: string, type: number): Promise<WebGLShader> {
    return new Promise<WebGLShader>(
        async (resolve, reject) => {
            const prom = GetData(url);
            const shader = gl.createShader(type);
            if (shader === null) {
                reject("Could not make shader")
                throw Error("Could not make shader")
                return;
            }

            const source = await prom;

            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                const failMsg = "Failed to compile shader: " + gl.getShaderInfoLog(shader)

                reject(failMsg);
                throw Error(failMsg)
            }
            resolve(shader);
        }
    )
}
