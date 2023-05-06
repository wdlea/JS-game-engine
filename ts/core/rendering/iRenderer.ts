import { FrameStats } from "../../debugger";
import { Camera } from "./camera";

/**
 * Interface to expose rendering logic to components
 * @category Rendering
 */
export interface IRenderer {
    enabled: boolean;

    /**
     * Called every time the camera renders the component
     * @param {Camera} cam The camera rendering the component 
     * @param {FrameStats} frameStats, the current frames stats
     */
    OnRender(cam: Camera, frameStats: FrameStats): void;
}

/**
 * Checks if object is a renderer
 * @param {any} obj 
 * @category Rendering
 * @returns {boolean} Whether the object is IRenderer
 */
export function IsRenderer(obj: any): obj is IRenderer {
    if (obj === null || obj === undefined)
        return false
    return obj.OnRender != undefined;
}