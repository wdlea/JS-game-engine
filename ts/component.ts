export interface IComponent {
    Awake(): void
    // Start(): void
    Update(): void
    // LateUpdate(): void

    get WhoAmI(): string
}