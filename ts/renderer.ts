export interface IRenderer {
    discriminator: "RENDERER"

    enabled: boolean

    OnRender(context: WebGLRenderingContext): void
}

export function IsRenderer(obj: any): obj is IRenderer {
    return obj.discriminator === "RENDERER"
}