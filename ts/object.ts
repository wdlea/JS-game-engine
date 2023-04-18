import { Game } from ".";
import { IComponent } from "./component";
import { IRenderer, IsRenderer } from "./renderer";

export class GameObject {

    private components: Array<IComponent> = [];
    private renderers: Array<IRenderer> = [];

    constructor(game: Game) {
        game.MakeDefaultComponents().forEach(
            (component: IComponent) => {
                this.AddComponent(component);
            }
        )
    }

    public get Components(): Array<IComponent> {
        return this.components
    }

    public _Awake(): void {
        this.components.forEach((component: IComponent) => component.Awake())
    }
    public _Update(): void {
        this.components.forEach(
            (component: IComponent) => {
                if (component.enabled) {
                    component.Update()
                }
            }
        )
    }
    public _OnRender(context: WebGLRenderingContext): void {
        this.renderers.forEach(
            (renderer: IRenderer) => {
                if (renderer.enabled) {
                    renderer.OnRender(context)
                }
            }
        )
    }


    public GetComponentOfType(type: string): IComponent | null {
        for (let i = 0; i < this.components.length; i++) {
            const component = this.components[i];
            if (component.WhoAmI == type) {
                return component
            }
        }
        return null;
    }
    public GetComponentsOfType(type: string): Array<IComponent> {
        let ret: Array<IComponent> = []

        for (let i = 0; i < this.components.length; i++) {
            const component = this.components[i];
            if (component.WhoAmI == type) {
                ret.push(component);
            }
        }
        return ret;
    }
    public AddComponent(component: IComponent) {
        if (component.IsCompatable(this)) {
            component.Awake()
            // component.Start()
            this.components.push(component);

            if (IsRenderer(component)) {
                this.renderers.push(component)
            }
        }

    }
}