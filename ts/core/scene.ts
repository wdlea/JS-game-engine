import { Game } from "./game";
import { Entity } from "./entity";

export class Scene {
    public objects: Array<Entity> = [];//contains objectionable content

    public Load(g: Game) {
        g.ActiveScene = this
    }
    public Unload(g: Game) {

    }
    public _Update() {
        this.objects.forEach(
            (object: Entity) => {
                object._Update();
            }
        )
    }
    public _OnRender(context: WebGLRenderingContext) {
        this.objects.forEach(
            (object) => {
                object._OnRender(context);
            }
        )
    }
}