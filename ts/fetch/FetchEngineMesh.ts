import $ from "jquery"
import { Model } from "obj-lib"
import { EngineMesh } from "../core"
import { BASE_RESOURCE_PATH } from "./setup"

const ENGINE_MESH_SUBPATH = "static/game/"
const ENGINE_MESH_SUFFIX = ".obj"

export function FetchEngineMesh(gl: WebGL2RenderingContext, name: string): Promise<EngineMesh> {
    const PATH = BASE_RESOURCE_PATH + ENGINE_MESH_SUBPATH + name + ENGINE_MESH_SUFFIX;
    return new Promise<EngineMesh>((resolve, reject) => {
        $.ajax({
            url: PATH
        }).done(
            (data) => {
                if (typeof data == "string") {
                    const model = Model.FromSrc(data)
                    resolve(EngineMesh.FromModel(gl, model))
                } else {
                    throw new Error("Ajax request did not return string")
                    reject()
                }
            }).fail(
                () => {
                    throw new Error("Ajax request failed");
                    reject();
                }
            )
    })
}