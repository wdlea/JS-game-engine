import { mat4, vec3 } from "gl-matrix";
import { Transform, TRANSFORM_IDENTIFIER } from "../components";
import { Entity, Game, IComponent } from "../core";
import { trash } from "../math";

export const GRID_IDENTIFIER = "GRID_COMPONENT"

/**
 * This component defines a grid component
 */
export class Grid<element extends IComponent> implements IComponent {
    public grid: Array<element>

    enabled: boolean = true;

    transform!: Transform;

    public tileWidth: number;
    public tileHeight: number;

    private width: number;
    private height: number;

    constructor(width: number, height: number, tileWidth: number = 1, tileHeight: number = 1) {
        this.grid = new Array<element>(width * height)

        this.tileHeight = tileHeight
        this.tileWidth = tileWidth
        this.width = width
        this.height = height
    }

    IsCompatable(object: Entity): boolean {
        return object.GetComponentOfType(TRANSFORM_IDENTIFIER) != null
    }

    OnAttach(parent: Entity, game: Game): void {
        const t_trans = parent.GetComponentOfType(TRANSFORM_IDENTIFIER)
        if (t_trans === null)
            throw new Error("No Transform componenet")

        this.transform = t_trans as Transform
    }
    Start(): void { }
    Update(): void { }
    get WhoAmI(): string {
        throw new Error("Method not implemented.");
    }

    /**
     * Returns the index of a square in the grid array
     * @param {number} x The x coordinate of the square
     * @param {number} y The y coordinate of the square
     * @returns {number} The index of the square in the grid array
     */
    public GetSquareIndex(x: number, y: number): number {
        return this.width * y + x
    }

    /**
     * Returns the index of a square in the grid array
     * @param {readonly [number, number]} coords The XY coords of the square
     * @returns {number} The index of the square in the grid array
     */
    public GetSquareIndexFromPackedCoords(coords: readonly [number, number]): number {
        const [x, y] = coords
        return this.GetSquareIndex(x, y)
    }
    /**
     * Returns the grid items x, y coords in the grid
     * @param {number} index The index of the element in the grid array
     * @returns {readonly [number, number]} The xy coordinates of the square
     */
    public GetSquareCoordinates(index: number): readonly [number, number] {
        return [
            index % this.width,
            Math.floor(index / this.width)
        ] as const
    }

    /**
     * Returns the point as the index of the closest square determined
     * by roundingFunction
     * @param point 
     * @param roundingFunction 
     * @param checkBounds 
     * @param silent 
     * @returns 
     */
    public PointToSquare(point: vec3, roundingFunction: (arg0: number) => number = Math.floor, checkBounds: boolean = true, silent: boolean = false): readonly [number, number] | null {
        const inverseTransform = mat4.invert(trash.mat4, this.transform.ModelMatrix)

        const rawPoint = vec3.transformMat4(trash.vec3, point, inverseTransform)

        const rawPos = [
            rawPoint[0] / this.tileWidth,
            rawPoint[1] / this.tileHeight
        ]
        rawPoint[0] = roundingFunction(rawPos[0])
        rawPoint[1] = roundingFunction(rawPos[1])

        if (rawPoint[0] % 1 != 0 || rawPoint[1] % 1 != 0) {
            if (silent) {
                return null
            } else {
                throw new Error("Rounding function didnt return an integer")
            }
        }

        if (checkBounds) {
            if (rawPoint[0] > this.width || rawPoint[1] > this.height)
                if (silent) {
                    return null
                } else {
                    throw new Error("Point outside bounds of array")
                }
        }

        //@ts-expect-error, rawPos will have 2 elements
        return rawPos as const
    }
}