import { Game } from "./game";
import { Entity } from "./entity";
import { Camera, IRenderer } from "./rendering";
import { Stats } from "webpack";
import { stats } from "../debugging";
/**
 * Base class for a scene in a game, only one can be active at a time, but Entities can be part of multiple scenes
 * @category Core 
*/
export class Scene {

    public camera: Camera;
    public entities: Array<Entity> = [];//contains objectionable content

    /**
     * Makes a new scene
     * @param {WebGL2RenderingContext} gl 
     */
    constructor(gl: WebGL2RenderingContext) {
        this.camera = new Camera(gl);
    }
    /**
     * Sets this scene as active 
     * @param {Game} g The game to make the scene active in
     */
    public Load(g: Game) {
        g.ActiveScene = this
    }
    /**
     * Called when scene is unloaded
     * @param {Game} g The game to make the scene active in
     */
    public Unload(g: Game) {

    }
    /**
     * Called repeatedly, and non-fixed speed
     */
    public Update() {
        this.entities.forEach(
            (object: Entity) => {
                object.Update();
            }
        )
    }
    /**
     * Called every AnimationFrame
     */
    public OnRender() {
        this.camera.BeginDraw()

        stats.rendererCount += this.renderers.length;

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