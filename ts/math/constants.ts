import { mat4, vec2, vec3, vec4 } from "gl-matrix";

/**
 * Mathematical constants
 * @memberof module:Math
 * @alias module:Math.constants
 */
export const constants = {
    ORIGIN: vec4.fromValues(0, 0, 0, 0),
    FORWARD: vec4.fromValues(0, 0, 1, 0),
} as const

/**
 * Use in when you dont care about the out parameter of a calculation
 * @memberof module:Math
 * @alias module:Math.trash
 */
export const trash = {
    vec4: vec4.create(),
    vec3: vec3.create(),
    vec2: vec2.create(),
    mat4: mat4.create()
}
