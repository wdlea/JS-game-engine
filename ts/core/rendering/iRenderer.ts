import { Camera } from "./camera";

export interface IRenderer {
    enabled: boolean;

    OnRender(cam: Camera): void;
}

export function IsRenderer(obj: any): obj is IRenderer {
    if (obj === null || obj === undefined)
        return false
    return "OnRender" in Object.getOwnPropertyNames(obj);
}