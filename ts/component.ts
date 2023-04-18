import { GameObject } from "./object"

export interface IComponent {
    enabled: boolean

    IsCompatable(object: GameObject): boolean

    Awake(): void
    // Start(): void
    Update(): void
    // LateUpdate(): void

    get WhoAmI(): string
}