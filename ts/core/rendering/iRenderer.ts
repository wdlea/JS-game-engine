import { Camera } from "./camera";

export interface IRenderer {
    enabled: boolean;

    OnRender(cam: Camera): void;
}

export function IsRenderer(obj: any): obj is IRenderer {
    return "OnRender" in obj.members;
}