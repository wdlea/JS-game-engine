import { mat4 } from "gl-matrix";
import { FrameStats } from "../../debugger";
import { Camera } from "./camera";
import { EngineMesh } from "./mesh";
import { ShaderProgram } from "./shaderProgram";
import { ObjectSettings } from "./uniforms";

/**
 * Class that represents a mesh that can be rendered
 * @category Rendering
 */
export class MeshInstance {
    public mesh: Readonly<EngineMesh>;
    public shader: Readonly<ShaderProgram>;

    public settings: ObjectSettings;

    /**
     * 
     * @param {Readonly<EngineMesh>} mesh The mesh to make an instance of
     * @param {Readonly<ShaderProgram>} shader The shader program to use when rendering 
     */
    constructor(mesh: Readonly<EngineMesh>, shader: Readonly<ShaderProgram>) {
        this.mesh = mesh;
        this.shader = shader;
        this.settings = new ObjectSettings(mat4.create(), 0)
    }

    /**
     * Draws mesh on camera
     * @param {Camera} camera The camera to draw on
     * @deprecated Use {@link Camera}.DrawMesh() instead
     */
    Draw(camera: Camera, frameStats: FrameStats) {
        camera.DrawMesh(this, frameStats);
    }
}