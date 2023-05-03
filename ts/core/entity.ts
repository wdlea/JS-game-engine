import { Game } from "./game";
import { IComponent } from "./component";
import { IRenderer, IsRenderer } from "./rendering";


/**
 * A Entity is the smallest possible thing that can
 * interact with the game, it has zero functionality on its own
 * @category Core
 */
export class Entity {

    private components: Array<IComponent> = [];
    private renderers: Array<IRenderer> = [];

    /**
     * @param {Game} game An instance of the Game 
     * @constructor
     */
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

    public get Renderers(): Array<IRenderer> {
        return this.renderers;
    }

    public _Awake(): void {
        this.components.forEach((component: IComponent) => component.Start())
    }

    public Update(): void {
        this.components.forEach(
            (component: IComponent) => {
                if (component.enabled) {
                    component.Update()
                }
            }
        )
    }

    /** Gets the first component added of the specific type, found by calling IComponent.WhoAmI
     * @param {string} type Compared to every components WhoAmI fuction
     * @returns {IComponent | null} The component found, if any, otheriwse null
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
     * @param {string} type Compared to every components WhoAmI fuction
     * @returns {Array<IComponent>} an array with all the components found, will be empty if there is no matches
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
     * @param {IComponent} component the component to add
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