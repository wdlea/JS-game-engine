import { vec3, vec4 } from "gl-matrix";

export const trash = {
    vec4: vec4.create(),
    vec3: vec3.create()
}

export const constants = {
    ORIGIN: vec4.fromValues(0, 0, 0, 0),
    FORWARD: vec4.fromValues(0, 0, 1, 0)
} as const