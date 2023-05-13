import { mat4, vec3, vec4 } from "gl-matrix";
import { stats } from "../../debugging";
import { CameraMatrix } from "./gl/cameraMatrix";
import { IRenderer } from "./iRenderer";
import { MeshInstance } from "./meshInstance";
import { GlobalSettings, LightSettings, ObjectSettings, RendererSettings } from "./uniforms";


const VERTEX_ATTRIB_LOCATION = 0
const UV_ATTRIB_LOCATION = 1
const NORMAL_ATTRIB_LOCATION = 2
/**
 * Class that represents a camera in 3D space
 * @category Rendering
 */
export class Camera {
    public _gl: WebGL2RenderingContext;

    public uniforms!: RendererSettings;


    private cameraMatrix: CameraMatrix;//todo see if cameramatrix has changed
    set CameraMatrix(v: CameraMatrix) {
        v.RecomputeProjectionMatrix(this._gl)

        this.cameraMatrix = v

        this.uniforms.globals.CameraMatrix = this.cameraMatrix.Matrix;
    }

    /**
     * Makes a new Camera
     * @param {WebGL2RenderingContext} gl The Rendering context
     */
    constructor(gl: WebGL2RenderingContext) {
        this._gl = gl;

        this.cameraMatrix = new CameraMatrix(gl)

        this.InitializeUniforms();
    }
    /**
     * Creates an new RenderSettings object, and fills it with some settings
     */
    private InitializeUniforms() {
        const globals = new GlobalSettings(this.cameraMatrix.Matrix);
        const object = new ObjectSettings(mat4.create(), 0);
        const lighting = new LightSettings(vec4.create(), vec4.create(), 0, vec4.create());

        this.uniforms = new RendererSettings(this._gl, globals, object, lighting);
    }

    /**
     * Makes the screen ready for drawing
     */
    BeginDraw() {
        this._gl.clear(this._gl.DEPTH_BUFFER_BIT | this._gl.COLOR_BUFFER_BIT)
        this.uniforms.globals.CameraMatrix = this.cameraMatrix.Matrix;
    }

    /**
     * Draws a mesh to screen, using Depth Buffer
     * @param {MeshInstance} m The mesh to render
     */
    DrawMesh(m: MeshInstance) {
        stats.meshDrawCalls++
        stats.indexCount += m.mesh.indexCount;

        m.shader.Use(this._gl);
        this.uniforms.objects = m.settings;
        this.uniforms.UseBuffer(m.shader)

        //set custom attributes
        m.shader.customAttributes.forEach((a) => {
            a.Apply(this._gl, m.shader)
        })

        //set default attributes
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, m.mesh.vertexBuffer)
        this._gl.vertexAttribPointer(
            VERTEX_ATTRIB_LOCATION,
            4,
            this._gl.FLOAT,
            false,
            0,
            0
        )
        this._gl.enableVertexAttribArray(VERTEX_ATTRIB_LOCATION)

        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, m.mesh.UVBuffer)
        this._gl.vertexAttribPointer(
            UV_ATTRIB_LOCATION,
            3,
            this._gl.FLOAT,
            false,
            0,
            0
        )
        this._gl.enableVertexAttribArray(UV_ATTRIB_LOCATION)

        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, m.mesh.NormalBuffer)
        this._gl.vertexAttribPointer(
            NORMAL_ATTRIB_LOCATION,
            3,
            this._gl.FLOAT,
            true,//normalize normals
            0,
            0
        )
        this._gl.enableVertexAttribArray(NORMAL_ATTRIB_LOCATION)

        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, m.mesh.indexBuffer)
        this._gl.drawElements(
            this._gl.TRIANGLES,
            m.mesh.indexCount,
            this._gl.UNSIGNED_SHORT,
            0
        );
    }

    /**
     * Renders multiple objects
     * @param {Array<IRenderer>} objects, an array of the objects to be rendered
     */
    RenderObjects(objects: Array<IRenderer>) {
        this.BeginDraw()
        objects.forEach(
            (renderer) => {
                renderer.OnRender(this);
            }
        )
    }
}


