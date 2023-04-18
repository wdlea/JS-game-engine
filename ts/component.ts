/**
 * This file contains the IComponent interface and everything to do with it
 */

import { Entity } from "./entity"

/**
 * Interface for components
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

    /**Called every time when the scene is loaded, 
     * and once when the object is added to a scene */
    Awake(): void
    // Start(): void
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