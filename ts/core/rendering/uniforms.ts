/**
 * Defines the settings layouts
 * GLOBAL UNIFORMS
 * 0. cameraMatrix(4)
 * PER OBJECT UNIFORMS
 * 4. transformMatrix(4)
 * 8. textureIndex(1)
 * LIGHTING UNIFORMS
 * 9.  lightPosition(1)
 * 10. lightColour(1)
 * 11. lightIntensity(1)
 * 12. lightDirection(1)
 */

import { mat4, vec4 } from "gl-matrix";
import { ShaderProgram } from "./shaderProgram";

export const DEFUALT_UNIFORM_BLOCK_NAME: string = "defaultUniforms";
export const DEFAULT_UNIFORM_BLOCK_LOCATION = 0;

const FLOAT_LENGTH = 4;
const VECTOR_LENGTH = 4;
const MAT4_LENGTH = 4 * VECTOR_LENGTH;

/**
 * Represents the Uniform Buffer
 * @category Rendering
 */
export class RendererSettings {
    public globals: GlobalSettings;
    public objects: Readonly<ObjectSettings>;
    public lights: LightSettings;

    private buffer: WebGLBuffer;

    private _gl: WebGL2RenderingContext;

    /**
     * 
     * @param globals GlobalSettings, the settings that are constant between objecs
     * @param objects Readonly<ObjectSettings>, the settings that are pecific for each object HINT:to make it Readonly<> use Object.Freeze(obj)
     * @param lights LightSettings, the settings that can be changes based on nearby light[note singular pluralization]
     */
    constructor(gl: WebGL2RenderingContext, globals: GlobalSettings, objects: Readonly<ObjectSettings>, lights: LightSettings) {
        this._gl = gl;

        // objects is readonly to prevent the user(me) from overwriting other objects becuase the settings are stored in a reference type(class) and are thus mutable
        this.globals = globals;
        this.objects = objects
        this.lights = lights;

        const tBuffer = gl.createBuffer();
        if (tBuffer === null)
            throw new Error('could not create buffer')

        this.buffer = tBuffer;
        this.InitBuffer()
    }

    get AsArray(): Float32Array {
        let f = new Float32Array(GLOBAL_SETTINGS_LENGTH + OBJECT_SETTINGS_LENGTH + LIGHT_SETTINGS_LENGTH);
        f.set(this.globals.AsArray, 0);
        f.set(this.objects.AsArray, GLOBAL_SETTINGS_LENGTH);
        f.set(this.lights.AsArray, GLOBAL_SETTINGS_LENGTH + OBJECT_SETTINGS_LENGTH);

        return f
    }

    /**
     * Initializes uniform buffer
     */
    private InitBuffer() {
        this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, this.buffer);
        this._gl.bufferData(this._gl.UNIFORM_BUFFER, this.AsArray, this._gl.DYNAMIC_DRAW);
        this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, null);
        this._gl.bindBufferBase(this._gl.UNIFORM_BUFFER, DEFAULT_UNIFORM_BLOCK_LOCATION, this.buffer)
    }

    /**
     * Updates the data within the UBO
     */
    public UpdateBuffer() {
        this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, this.buffer)
        this._gl.bufferData(this._gl.UNIFORM_BUFFER, this.AsArray, this._gl.DYNAMIC_DRAW)
        this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, null);
        this._gl.bindBufferBase(this._gl.UNIFORM_BUFFER, DEFAULT_UNIFORM_BLOCK_LOCATION, this.buffer);
    }

    /**
     * Writes UBO to current shader program
     * @param {ShaderProgram} program The shaderprogram to write to
     */
    public UseBuffer(program: Readonly<ShaderProgram>) {
        this._gl.uniformBlockBinding(
            program.Program,
            program.DefaultUBI,
            DEFAULT_UNIFORM_BLOCK_LOCATION
        )
    }
}

/**
 * Represents a section of Uniform Buffer
 * @category Rendering
 */
interface ISettings {
    get AsArray(): Float32Array
    get Length(): Number;
}

const GLOBAL_SETTINGS_LENGTH = MAT4_LENGTH;
/**
 * Represents settings that are relatively constant
 * @implements {ISettings}
 * @category Rendering
 */
export class GlobalSettings implements ISettings {
    private cameraMatrix: mat4;
    private cameraMatrixUpdated = true;

    private array: Float32Array = new Float32Array(GLOBAL_SETTINGS_LENGTH);

    get CameraMatrix() { return this.cameraMatrix }
    set CameraMatrix(v) {
        this.cameraMatrixUpdated = true;
        this.cameraMatrix = v
    }

    /**
     * @param cameraMatrix The Camera Matrix, represents the position and projection of the camera
     * @implements {ISettings}
     * @category Rendering
     */
    constructor(cameraMatrix: mat4) {
        this.cameraMatrix = cameraMatrix;
    }

    public get AsArray(): Float32Array {
        this.RecomputeArray();
        return this.array;
    }
    private RecomputeArray() {
        if (this.cameraMatrixUpdated) {
            this.array.set(this.cameraMatrix, 0);
        }
    }

    public get Length(): Number {
        return GLOBAL_SETTINGS_LENGTH;
    }
}

const OBJECT_SETTINGS_LENGTH = MAT4_LENGTH + FLOAT_LENGTH;
/**
 * Represents settings that change on a per-object basis
 * @implements {ISettings}
 * @category Rendering
*/
export class ObjectSettings implements ISettings {
    private transformMatrix: mat4;
    private transformMatrixUpdated = true;

    private materialIndex: number;
    private materialIndexUpdated = true;

    get TransformMatrix() { return this.transformMatrix }
    set TransformMatrix(v) {
        this.transformMatrixUpdated = true;
        this.transformMatrix = v
    }

    get MaterialIndex() { return this.materialIndex }
    set MaterialIndex(v) {
        this.materialIndexUpdated = true;
        this.materialIndex = v
    }

    private array: Float32Array = new Float32Array(OBJECT_SETTINGS_LENGTH)
    /**
     * 
     * @param transform mat4, the objects tranformation matrix
     * @param materialIndex uint, the objects material index on GPU
     */
    constructor(transform: mat4, materialIndex: number) {
        this.transformMatrix = transform;
        this.materialIndex = materialIndex;
    }
    get AsArray(): Float32Array {
        this.RecomputeArray();
        return this.array;
    }
    private RecomputeArray() {
        if (this.transformMatrixUpdated) {
            this.array.set(this.transformMatrix, 0);
            this.transformMatrixUpdated = false;
        }
        if (this.materialIndexUpdated) {
            this.array[MAT4_LENGTH] = this.materialIndex;
            this.materialIndexUpdated = false;
        }

    }

    get Length(): Number {
        return OBJECT_SETTINGS_LENGTH;
    }
}


const LIGHT_SETTINGS_LENGTH = VECTOR_LENGTH * 2 + FLOAT_LENGTH + VECTOR_LENGTH
/**
 * Represents settings to do with lighting, expect this to change often
 * @implements {ISettings}
 * @category Rendering 
*/
export class LightSettings implements ISettings {
    private lightPosition: vec4;
    private lightPositionUpdated = true;

    private lightColour: vec4;
    private lightColourUpdated = true;

    private lightIntensity: number;
    private lightIntensityUpdated = true;

    private lightDirection: vec4;
    private lightDirectionUpdated = true;

    get LightPosition() { return this.lightPosition }
    set LightPosition(v) {
        this.lightPositionUpdated = true;
        this.lightPosition = v
    }
    get LightColour() { return this.lightColour }
    set LightColour(v) {
        this.lightColourUpdated = true;
        this.lightColour = v
    }
    get LightIntensity() { return this.lightIntensity }
    set LightIntensity(v) {
        this.lightIntensityUpdated = true;
        this.lightIntensity = v
    }
    get LightDirection() { return this.lightDirection }
    set LightDirection(v) {
        this.lightDirectionUpdated = true;
        this.lightDirection = v
    }

    private array: Float32Array = new Float32Array(LIGHT_SETTINGS_LENGTH);

    /**
     * 
     * @param position vec4, the position of the ligth
     * @param colour vec4, the colour of the light
     * @param intensity float32, the intensity/brightness of the light
     * @param direction vec4, the direction the light is facing
     */
    constructor(position: vec4, colour: vec4, intensity: number, direction: vec4) {
        this.lightPosition = position;
        this.lightColour = colour;
        this.lightIntensity = intensity;
        this.lightDirection = direction;
    }

    get AsArray(): Float32Array {
        this.RecomputeArray();
        return this.array;
    }
    private RecomputeArray() {
        if (this.lightPositionUpdated) {
            this.array.set(this.lightPosition, 0);
            this.lightPositionUpdated = false;
        }
        if (this.lightColourUpdated) {
            this.array.set(this.lightColour, VECTOR_LENGTH);
            this.lightColourUpdated = false
        }
        if (this.lightIntensityUpdated) {
            this.array[VECTOR_LENGTH * 2] = this.lightIntensity;
            this.lightIntensityUpdated = false;
        }
        if (this.lightDirectionUpdated) {
            this.array.set(this.lightDirection, VECTOR_LENGTH * 2 + FLOAT_LENGTH);
            this.lightDirectionUpdated = false;
        }
    }

    get Length(): Number {
        return LIGHT_SETTINGS_LENGTH;
    }

}