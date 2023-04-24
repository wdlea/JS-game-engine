import { mat4 } from "gl-matrix";
import { Camera } from "./camera";
import { EngineMesh } from "./mesh";
import { ShaderProgram } from "./shaderProgram";
import { ObjectSettings } from "./uniforms";

export class MeshInstance {
    public mesh: Readonly<EngineMesh>;
    public shader: Readonly<ShaderProgram>;

    public settings: ObjectSettings;

    constructor(mesh: Readonly<EngineMesh>, shader: Readonly<ShaderProgram>) {
        this.mesh = mesh;
        this.shader = shader;
        this.settings = new ObjectSettings(mat4.create(), 0)
    }

    Draw(camera: Camera) {
        camera.DrawMesh(this);
    }
}