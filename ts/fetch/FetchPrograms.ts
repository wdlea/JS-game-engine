import { AttributeLookup, ShaderOrder, ShaderProgram } from "../core/rendering/shaderProgram";
import { BASE_RESOURCE_PATH } from "./setup";

import $ from "jquery"

const SHADER_SUBPATH = "shaders/"
const VERTEX_SHADER_SUBPATH = "vertex/"
const VERTEX_SHADER_SUFFIX = ".vert"
const FRAGMENT_SHADER_SUBPATH = "fragment/"
const FRAGMENT_SHADER_SUFFIX = ".frag"

/**
 * Requests, compiles shaders and links programs.
 * Optimised for speed.
 * @see ShaderProgram.BatchCompileAndLink() similar args to this, calls it
 * @param {WebGL2RenderingContext} gl The webgl rendering context
 * @param {Array<string>} vsp An array with all the names of vertex shaders
 * @param {Array<string>} fsp An array with all the names of fragment shaders
 * @param {Array<AttributeLookup>} AttributeLookups An array with all the AttributeLookups
 * @param {Array<ShaderOrder>} orders An array with all the desired programs
 * @returns {Array<ShaderProgram>} The linked programs
 */
export function FetchPrograms(gl: WebGL2RenderingContext, vsp: Array<string>, fsp: Array<string>, AttributeLookups: Array<Array<AttributeLookup>>, orders: Array<ShaderOrder>): Promise<Array<ShaderProgram>> {
    return new Promise(async (resolve, reject) => {
        let vsReqs: Array<JQuery.jqXHR<string>> = []

        for (let vspi = 0; vspi < vsp.length; vspi++) {
            const vspath = BASE_RESOURCE_PATH + SHADER_SUBPATH + VERTEX_SHADER_SUBPATH + vsp[vspi] + VERTEX_SHADER_SUFFIX;
            vsReqs.push(
                $.ajax({
                    url: vspath,
                })
            )
        }

        let fsReqs: Array<JQuery.jqXHR<string>> = []

        for (let fspi = 0; fspi < fsp.length; fspi++) {
            const fspath = BASE_RESOURCE_PATH + SHADER_SUBPATH + FRAGMENT_SHADER_SUBPATH + fsp[fspi] + FRAGMENT_SHADER_SUFFIX;
            fsReqs.push(
                $.ajax({
                    url: fspath,
                })
            )
        }

        //resolve all reqs
        let vss: Array<string> = []
        vsReqs.forEach(async (req) => {
            vss.push(await req)
        })

        let fss: Array<string> = []
        fsReqs.forEach(async (req) => {
            fss.push(await req)
        })

        resolve(ShaderProgram.BatchCompileAndLink(gl, vss, fss, AttributeLookups, orders))
    })
}
