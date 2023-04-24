import { Game } from "./game";
import { Entity } from "./entity";
import { Camera, IRenderer } from "./rendering";

export class Scene {

    private camera: Camera;
    public entities: Array<Entity> = [];//contains objectionable content

    constructor(gl: WebGL2RenderingContext) {
        this.camera = new Camera(gl);
    }

    public Load(g: Game) {
        g.ActiveScene = this
    }
    public Unload(g: Game) {

    }
    public _Update() {
        this.entities.forEach(
            (object: Entity) => {
                object._Update();
            }
        )
    }
    public _OnRender() {
        this.camera.RenderObjects(this.renderers)
    }

    private renderers: Array<IRenderer> = [];
    /**Registers a renderer for rendering
     * @param renderer, the renderer
     * @returns the id of the registered component
     */
    public RegisterRenderer(renderer: IRenderer): number {
        this.renderers.push(renderer);
        return this.renderers.length - 1;
    }

    /**
     * Deregisters a renderer from being checked for renderering
     * @param id the id of the renderer HINT: RegisterRenderer returns it
     * @returns the renderer
     */
    public DeregisterRenderer(id: number): IRenderer {
        const ret = this.renderers[id];

        this.renderers = this.renderers.slice(0, id)
        this.renderers.push(...this.renderers.slice(id + 1))

        return ret
    }
}