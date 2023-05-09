import { mat4, vec4 } from "gl-matrix"
/**
 * Symbolizes a line in 3d space
 */
export class Ray {
    origin: vec4;
    direction: vec4;

    constructor(origin: vec4, direction: vec4) {
        this.origin = origin;
        this.direction = direction;
    }


    /**
     * Returns origin + mul * direction
     * @param {number} mul 
     * @returns {vec3} The final position
     */
    private step(mul: number): vec4 {
        const delta: vec4 = vec4.create();

        vec4.scale(delta, this.direction, mul);

        const point: vec4 = vec4.create();
        vec4.add(point, delta, this.origin);

        return point;
    }

    /**
     * Finds intersection point with an offset plane
     * @param offset the offset, in whatever unit you are using along the normal of the plane
     * @param plane 0 -> YZ, 1 -> XZ, 2 -> XY planes
     * @returns {vec3} The point of intersection with the given plane
     */
    InterceptOffsetPlane(offset: number, plane: number): vec4 {
        if (plane < 0 || plane > 2)
            throw new Error(`Invalid plane ${plane}`)

        const dist = this.origin[plane] - offset;
        const mul = dist / this.direction[plane];
        return this.step(mul)
    }

    /**
     * alias for InterceptOffsetPlane(0, 0)
     * @returns {vec3} The point of intersection with the YZ plane
     */
    InterceptYZ(): vec4 {
        return this.InterceptOffsetPlane(0, 0)
    }

    /**
     * alias for InterceptOffsetPlane(0, 1)
     * @returns {vec3} The point of intersection with the XZ plane
     */
    InterceptXZ(): vec4 {
        return this.InterceptOffsetPlane(0, 1)
    }

    /**
     * alias for InterceptOffsetPlane(0, 2)
     * @returns {vec3} The point of intersection with the XY plane
     */
    InterceptXY(): vec4 {
        return this.InterceptOffsetPlane(0, 2)
    }

    /**
     * Normalizes the current ray
     */
    Normalize() {
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
     * @returns 
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
    }
}

