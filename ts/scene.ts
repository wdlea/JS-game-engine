import { Game } from ".";
import { GameObject } from "./object";

export class Scene {
    public objects: Array<GameObject> = [];//contains objectionable content

    public Load(g: Game) {
        g.ActiveScene = this
    }
    public Unload(g: Game) {

    }
    public _Update() {
        this.objects.forEach(
            (object: GameObject) => {
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