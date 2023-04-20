/**
 * Contains the type definitions for the render data type
 */

import { mat4 } from "gl-matrix";

/**Represents the quality graphics are rendered at */
export enum RenderQuality {
    Potato = 0,
    Low,
    Medium,
    High,
}

/**Represents all data that gets passed to renderers */
export type RenderData = {
    context: WebGLRenderingContext,
    viewMatrix: mat4,
    defaultProgram: WebGLProgram,
    quality: RenderQuality
}