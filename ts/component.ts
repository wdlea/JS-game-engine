export interface IComponent {
    enabled: boolean

    Awake(): void
    // Start(): void
    Update(): void
    // LateUpdate(): void

    get WhoAmI(): string
}