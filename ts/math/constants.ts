import { mat4, vec2, vec3, vec4 } from "gl-matrix";

/**
 * Mathematical constants
 * @memberof module:Math
 * @alias module:Math.constants
 */
export class constants {
    static get ORIGIN() { return vec4.fromValues(0, 0, 0, 1) }//position 4 is 1 becuase of translation
    static get FORWARD() { return vec4.fromValues(0, 0, 1, 1) }// ^
}


/**
 * Creates new instances of types
 */
export class make {
    static get vec4(): vec4 { return vec4.create() }
    static get vec3(): vec3 { return vec3.create() }
    static get vec2(): vec2 { return vec2.create() }
    static get mat4(): mat4 { return mat4.create() }
}