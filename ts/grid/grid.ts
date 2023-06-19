import { mat4, vec3 } from "gl-matrix";
import { Transform } from "../components";
import { Entity, Game, IComponent } from "../core";
import { make } from "../math";

export const GRID_IDENTIFIER = "GRID_COMPONENT"

export type Coords = readonly [number, number]

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
        return object.GetComponentOfType(new Transform()) != null
    }

    OnAttach(parent: Entity, game: Game): void {
        const t_trans = parent.GetComponentOfType(new Transform())
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
     * @param {Array<number>} coords The XY coords of the square
     * @returns {Coords} The index of the square in the grid array
     */
    public GetSquareIndexFromPackedCoords(coords: Coords): number {
        const [x, y] = coords
        return this.GetSquareIndex(x, y)
    }
    /**
     * Returns the grid items x, y coords in the grid
     * @param {number} index The index of the element in the grid array
     * @returns {Coords} The xy coordinates of the square
     */
    public GetSquareCoordinates(index: number): Coords {
        return [
            index % this.width,
            Math.floor(index / this.width)
        ] as const
    }

    /**
     * Returns the point as the index of the closest square determined
     * by roundingFunction
     * @param {vec3} point The point in 3D space to find the closest square
     * @param {Function} roundingFunction The function used when rounding the value to the nearest square
     * @param {boolean} checkBounds Whether to make sure that the point exists inside the grid
     * @param {boolean} silent Whether to error out on invalid inputs
     * @returns {Coords | null} The coords, if any
     */
    public PointToSquare(point: vec3, roundingFunction: (arg0: number) => number = Math.floor, checkBounds: boolean = true, silent: boolean = false): Coords | null {
        const inverseTransform = mat4.invert(make.mat4, this.transform.ModelMatrix)

        const rawPoint = vec3.transformMat4(make.vec3, point, inverseTransform)

        const rawPos = [
            rawPoint[0] / this.tileWidth,
            rawPoint[2] / this.tileHeight
        ]
        rawPos[0] = roundingFunction(rawPos[0])
        rawPos[1] = roundingFunction(rawPos[1])

        if (rawPos[0] % 1 != 0 || rawPos[1] % 1 != 0) {
            if (silent) {
                return null
            } else {
                throw new Error("Rounding function didnt return an integer")
            }
        }

        if (checkBounds) {
            if (rawPos[0] > this.width || rawPos[1] > this.height)
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