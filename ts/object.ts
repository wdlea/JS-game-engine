import { IComponent } from "./component";

export class GameObject {
    private components: Array<IComponent> = [];

    constructor() {

    }

    public get Components(): Array<IComponent> {
        return this.components
    }

    public _Awake(): void { this.components.forEach((component: IComponent) => component.Awake()) }
    public _Update(): void { this.components.forEach((component: IComponent) => component.Update()) }

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
        component.Awake()
        // component.Start()
        this.components.push(component);
    }
}