import { mat4, vec4 } from "gl-matrix"
/**
 * Symbolizes a line in 3d space
 * @memberof module:Math
 * @alias module:Math.Ray
 */
export class Ray {
    private origin: vec4;
    private direction: vec4;

    constructor(origin: vec4, direction: vec4) {
        this.origin = vec4.fromValues(origin[0], origin[1], origin[2], 1)//deep copy values
        this.direction = vec4.fromValues(direction[0], direction[1], direction[2], 1)
        this.fixVectors()
    }

    private fixVectors() {
        this.origin[4] = 1
        this.direction[4] = 1
    }

    /**
     * Returns origin + mul * direction
     * @alias module:Math.Ray.Step
     * @param {number} mul 
     * @returns {vec4} The final position
     */
    Step(mul: number): vec4 {
        const delta: vec4 = vec4.create();

        vec4.scale(delta, this.direction, mul);

        const point: vec4 = vec4.create();
        vec4.add(point, delta, this.origin);

        this.fixVectors()

        point[3] = 1

        return point;
    }

    /**
     * Finds intersection point with an offset plane
     * @alias module:Math.Ray.InterceptOffsetPlane
     * @param offset the offset, in whatever unit you are using along the normal of the plane
     * @param plane 0 -> YZ, 1 -> XZ, 2 -> XY planes
     * @returns {vec4} The point of intersection with the given plane
     */
    InterceptOffsetPlane(offset: number, plane: number): vec4 {
        if (plane < 0 || plane > 2)
            throw new Error(`Invalid plane ${plane}`)

        const dist = this.origin[plane] - offset;
        const mul = dist / this.direction[plane];
        return this.Step(mul)
    }

    /**
     * alias for InterceptOffsetPlane(0, 0)
     * @alias module:Math.Ray.InterceptYZ
     * @returns {vec4} The point of intersection with the YZ plane
     */
    InterceptYZ(): vec4 {
        return this.InterceptOffsetPlane(0, 0)
    }

    /**
     * alias for InterceptOffsetPlane(0, 1)
     * @alias module:Math.Ray.InterceptXZ
     * @returns {vec4} The point of intersection with the XZ plane
     */
    InterceptXZ(): vec4 {
        return this.InterceptOffsetPlane(0, 1)
    }

    /**
     * alias for InterceptOffsetPlane(0, 2)
     * @alias module:Math.Ray.InterceptXY
     * @returns {vec4} The point of intersection with the XY plane
     */
    InterceptXY(): vec4 {
        return this.InterceptOffsetPlane(0, 2)
    }

    /**
     * Normalizes the current ray
     * @returns {void}
     */
    Normalize(): void {
        vec4.normalize(this.direction, this.direction);
    }

    /**
     * Makes a copy of the current ray
     * @returns {Ray} the made copy
     */
    Copy(): Ray {
        return new Ray(
            this.origin,
            this.direction
        );
    }

    /**
     * Creates a new ray with an origin at start that intercepts end
     * @param {vec3} start The origin of the ray
     * @param {vec3} end A point which the ray intercepts
     * @param {boolean} normalize Whether to normalize the returned ray
     * @returns {Ray} The new ray
     */
    static FromPoints(start: vec4, end: vec4, normalize: boolean = false): Ray {
        const direction = vec4.create()
        vec4.sub(direction, end, start)

        const ray = new Ray(
            start,
            direction
        )

        if (normalize)
            ray.Normalize()

        return ray
    }

    /**
     * Applies matrix transformations to the ray
     * @param {mat4} matrix The transformation matrix
     */
    Transform(matrix: mat4) {
        vec4.transformMat4(this.direction, this.direction, matrix)
        vec4.transformMat4(this.origin, this.origin, matrix)
        this.fixVectors()
    }

    get Values() {
        return [this.Origin, this.Direction] as const
    }
    get Origin() {
        return this.origin;
    }
    get Direction() {
        return this.direction;
    }

    public ToString(): string {
        return `Ray from ${this.origin.values.toString()} in direction ${this.direction.values.toString()}`
    }
}

