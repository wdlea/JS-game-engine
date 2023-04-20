/**
 * This file contains the Entity class, which is the smallest thing that can interact with the game -An Atomic
 */

import { Game } from "./game";
import { IComponent } from "./component";
import { IRenderer, IsRenderer } from "./renderer";


/**A Entity is the smallest possible thing that can interact with the game, it has zero functionality on its own */
export class Entity {

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
        this.components.forEach((component: IComponent) => component.Start())
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

    /** Gets the first component added of the specific type, found by calling IComponent.WhoAmI
     * @param type string, compared to every components WhoAmI fuction
     * @returns The component found, if any, otheriwse null
     */
    public GetComponentOfType(type: string): IComponent | null {
        for (let i = 0; i < this.components.length; i++) {
            const component = this.components[i];
            if (component.WhoAmI == type) {
                return component
            }
        }
        return null;
    }

    /**
     * Much like GetComponentOfType, but returns all matches
     * @param type string, compared to every components WhoAmI fuction
     * @returns an array with all the components found, will be empty if there is no matches
     */
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

    /**
     * Appends a component to the Entities componenet
     * @param component IComponent, the component to add
     */
    public AddComponent(component: IComponent) {
        if (component.IsCompatable(this)) {
            component.OnAttach(this)
            // component.Start()
            this.components.push(component);

            if (IsRenderer(component)) {
                this.renderers.push(component)
            }
        }

    }
}