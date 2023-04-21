import { OBJFile } from "obj-lib";
import { GetData } from "./sendRequest"

const DEFAULT_MODEL_PATH = "/models/"
const DEFAULT_MODEL_SUFFIX = '.obj'

export function FetchModel(gl: WebGLRenderingContext, name: string): Promise<OBJFile> {
    return new Promise(
        async (resolve, reject) => {
            const source = await GetData(DEFAULT_MODEL_PATH + name + DEFAULT_MODEL_SUFFIX);
            const file = OBJFile.fromSrc(source);
            resolve(file);
        }
    )
}