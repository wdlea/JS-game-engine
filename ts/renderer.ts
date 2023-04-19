/**
 * This file contains the interface IRenderer, and all relating functions
 */

/**
 * the interface for every component that wants the OnRender callback
 */
export interface IRenderer {
    discriminator: "RENDERER"

    enabled: boolean

    /**
     * Called every animation frame, implemented so i can make Renderer components
     * @param context WebGLRenderingContext, the rendering context so objects can write to the render buffer
     */
    OnRender(context: WebGLRenderingContext): void
}

/**
 * Tests to see if a given object is a renderer
 * @param obj The object in question
 * @returns boolean, if the object is a renderer
 */
export function IsRenderer(obj: any): obj is IRenderer {
    return obj.discriminator === "RENDERER"
}