import { Entity } from "./entity"
import { Game } from "./game"

/**
 * Interface that all components must derive from
 * @category Core
 */
export interface IComponent {
    enabled: boolean

    /**
     * Checks if a component can go on a Entity, 
     * implemented with th idea that this could help prevent
     * duplicate components, or components that rely on others, 
     * such as transform.
     * @param object Entity, the Entity to check compatibility with
     */
    IsCompatable(object: Entity): boolean

    /**Called once when the component is attatched to an entity */
    OnAttach(parent: Entity, game: Game): void

    /*Called every time the entities scene is loaded*/
    Start(): void

    /**Called repeatedly */
    Update(): void
    // LateUpdate(): void

    /**Used in the engine to compare objects types, 
     * could also be hacked to get components to "mimic" other
     * components, i dont know how useful that is but it is a 
     * possible use case.
     * @returns string, the string with the objects type name
     */
    get WhoAmI(): string
}

/**
 * Base class for components
 * @category Core
 */
export class BaseComponent implements IComponent {

    enabled: boolean = true;
    IsCompatable(object: Entity): boolean {
        return false
    }
    OnAttach(parent: Entity): void { }
    Start(): void { }
    Update(): void { }
    get WhoAmI(): string { return ""; }
}

export function IsComponentOfType<Type extends IComponent>(obj: any, t: Type): obj is Type {
    try {
        return typeof obj.WhoAmI != undefined && obj.WhoAmI == t.WhoAmI
    } catch {
        return false
    }
}