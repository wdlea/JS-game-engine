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
     * @returns {vec3} The point of intersection with the YZ plane
     */
    InterceptYZ(): vec3 {
        return this.InterceptOffsetPlane(0, 0)
    }
    /**
     * alias for InterceptOffsetPlane(0, 1)
     * @returns {vec3} The point of intersection with the XZ plane
     */
    InterceptXZ(): vec3 {
        return this.InterceptOffsetPlane(0, 1)
    }
    /**
     * alias for InterceptOffsetPlane(0, 2)
     * @returns {vec3} The point of intersection with the XY plane
     */
    InterceptXY(): vec3 {
        return this.InterceptOffsetPlane(0, 2)
    }

}