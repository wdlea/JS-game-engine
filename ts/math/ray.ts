import { vec3 } from "gl-matrix"

/**
 * Symbolizes a line in 3d space
 */
export class Ray {
    origin: vec3;
    direction: vec3;

    constructor(origin: vec3, direction: vec3) {
        this.origin = origin;
        this.direction = direction;
    }


    /**
     * Returns origin + mul * direction
     * @param {number} mul 
     * @returns {vec3} The final position
     */
    private step(mul: number): vec3 {
        const delta: vec3 = vec3.create();

        vec3.scale(delta, this.direction, mul);

        const intercept: vec3 = vec3.create();
        vec3.add(intercept, intercept, this.origin);

        return intercept;
    }

    /**
     * Finds intersection point with an offset plane
     * @alias module:Math.Ray.InterceptOffsetPlane
     * @param offset the offset, in whatever unit you are using along the normal of the plane
     * @param plane 0 -> YZ, 1 -> XZ, 2 -> XY planes
     * @returns {vec3} The point of intersection with the given plane
     */
    InterceptOffsetPlane(offset: number, plane: number): vec3 {
        if (plane < 0 || plane > 2)
            throw new Error(`Invalid plane ${plane}`)

        const dist = this.origin[plane] - offset;
        const mul = dist / this.direction[plane];
        return this.step(mul)
    }

    /**
     * alias for InterceptOffsetPlane(0, 0)
     * @alias module:Math.Ray.InterceptYZ
     * @returns {vec3} The point of intersection with the YZ plane
     */
    InterceptYZ(): vec3 {
        return this.InterceptOffsetPlane(0, 0)
    }
    /**
     * alias for InterceptOffsetPlane(0, 1)
     * @alias module:Math.Ray.InterceptXZ
     * @returns {vec3} The point of intersection with the XZ plane
     */
    InterceptXZ(): vec3 {
        return this.InterceptOffsetPlane(0, 1)
    }
    /**
     * alias for InterceptOffsetPlane(0, 2)
     * @alias module:Math.Ray.InterceptXY
     * @returns {vec3} The point of intersection with the XY plane
     */
    InterceptXY(): vec3 {
        return this.InterceptOffsetPlane(0, 2)
    }

<<<<<<< Updated upstream
}
=======
    /**
     * Normalizes the current ray
     * @alias module:Math.Ray.Normalize
     * @returns {void}
     */
    Normalize(): void {
        vec4.normalize(this.direction, this.direction);
    }

    /**
     * Makes a copy of the current ray
     * @alias module:Math.Ray.Copy
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
     * @alias module:Math.Ray.FromPoints
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
     * @alias module:Math.Ray.Transform
     * @param {mat4} matrix The transformation matrix
     */
    Transform(matrix: mat4) {
        vec4.transformMat4(this.direction, this.direction, matrix)
        vec4.transformMat4(this.origin, this.origin, matrix)
    }

    /**
     * The Origin and Direction of the Ray
     * @alias module:Math.Ray.Values
     * @returns The origin and direction
     */
    get Values(): readonly [vec4, vec4] {
        return [this.Origin, this.Direction] as const
    }
    /**
     * The origin of the Ray
     * @alias module:Math.Ray.Origin
     * @returns {vec4} The origin of the ray
     */
    get Origin(): vec4 {
        return this.origin;
    }
    /**
     * The direction of the Ray
     * @alias module:Math.Ray.Direction
     * @returns {vec4} The direction of the ray
     */
    get Direction(): vec4 {
        return this.direction;
    }
}

>>>>>>> Stashed changes
