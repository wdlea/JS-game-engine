import { mat4, vec3, vec4 } from "gl-matrix";
import { CameraMatrix } from "./gl/cameraMatrix";
import { GlobalSettings, LightSettings, ObjectSettings, RendererSettings as Uniforms } from "./uniforms";


export class Camera {
    public _gl: WebGL2RenderingContext;

    private uniformBuffer: WebGLBuffer;

    public uniforms: Uniforms;

    public cameraMatrix: CameraMatrix = new CameraMatrix();


    constructor(gl: WebGL2RenderingContext, uniforms: Uniforms) {
        this._gl = gl;

        const tempUniformBuffer = gl.createBuffer();
        if (tempUniformBuffer === null)
            throw Error("Could not create buffer")

        this.uniformBuffer = tempUniformBuffer;
        this.uniforms = uniforms;

        this.InitializeUniforms();
    }

    private InitializeUniforms() {
        const globals = new GlobalSettings(this.cameraMatrix.Matrix);
        const object = new ObjectSettings(mat4.create(), 0);
        const lighting = new LightSettings(vec4.create(), vec4.create(), 0, vec4.create());

        this.uniforms = new Uniforms(globals, object, lighting);
    }
}


