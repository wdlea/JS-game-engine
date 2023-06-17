import { mat4, vec3, vec4 } from "gl-matrix";
import { stats } from "../../debugging";
import { CameraMatrix } from "./gl/cameraMatrix";
import { IRenderer } from "./iRenderer";
import { MeshInstance } from "./meshInstance";
import { GlobalSettings, LightSettings, ObjectSettings, RendererSettings } from "./uniforms";
import { Cursor } from "../../cursor"


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

    public cursor: Cursor;


    private cameraMatrix: CameraMatrix;
    set CameraMatrix(v: CameraMatrix) {
        this.cameraMatrix = v
        this.uniforms.globals.CameraMatrix = this.cameraMatrix.ProjectionMatrix;
        this.uniforms.globals.ViewMatrix = this.cameraMatrix.ViewMatrix;
    }
    get CameraMatrix() {
        return this.cameraMatrix
    }

    /**
     * Makes a new Camera
     * @param {WebGL2RenderingContext} gl The Rendering context
     */
    constructor(gl: WebGL2RenderingContext) {
        this._gl = gl;

        this.cameraMatrix = new CameraMatrix(gl)

        this.InitializeUniforms();

        window.onresize = (ev: UIEvent): any => {
            this.CameraMatrix = new CameraMatrix(gl)
        }
        this.cursor = new Cursor(this)
    }
    /**
     * Creates an new RenderSettings object, and fills it with some settings
     */
    private InitializeUniforms() {
        const globals = new GlobalSettings(this.cameraMatrix.ProjectionMatrix, this.cameraMatrix.ViewMatrix);
        const object = new ObjectSettings(mat4.create(), 0);
        const lighting = new LightSettings(vec4.create(), vec4.create(), 0, vec4.create());

        this.uniforms = new RendererSettings(this._gl, globals, object, lighting);
        this.uniforms.UpdateBuffer()
    }

    /**
     * Makes the screen ready for drawing
     */
    BeginDraw() {
        this._gl.clear(this._gl.DEPTH_BUFFER_BIT | this._gl.COLOR_BUFFER_BIT)
        this.uniforms.globals.CameraMatrix = this.cameraMatrix.ProjectionMatrix;
        this.uniforms.globals.ViewMatrix = this.cameraMatrix.ViewMatrix;
    }

    /**
     * Draws a mesh to screen, using Depth Buffer
     * @param {MeshInstance} m The mesh to render
     */
    DrawMesh(m: MeshInstance, settings: ObjectSettings) {
        stats.meshDrawCalls++
        stats.indexCount += m.mesh.indexCount;

        m.shader.Use(this._gl);
        this.uniforms.objects = settings;
        this.uniforms.UpdateBuffer();
        this.uniforms.UseBuffer(m.shader);


        //set custom attributes
        m.shader.customAttributes.forEach((a) => {
            stats.attribCalls++;
            a.Apply(this._gl, m.shader)
        })

        //set default attributes
        if (m.shader.Locations.Position != null) {
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, m.mesh.vertexBuffer)
            this._gl.vertexAttribPointer(
                m.shader.Locations.Position,
                4,
                this._gl.FLOAT,
                false,
                0,
                0
            )
            this._gl.enableVertexAttribArray(VERTEX_ATTRIB_LOCATION)
        }

        if (m.shader.Locations.Texture != null) {
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, m.mesh.UVBuffer)
            this._gl.vertexAttribPointer(
                m.shader.Locations.Texture,
                3,
                this._gl.FLOAT,
                false,
                0,
                0
            )
            this._gl.enableVertexAttribArray(UV_ATTRIB_LOCATION)
        }

        if (m.shader.Locations.Normal != null) {
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, m.mesh.NormalBuffer)
            this._gl.vertexAttribPointer(
                m.shader.Locations.Normal,
                3,
                this._gl.FLOAT,
                true,//normalize normals
                0,
                0
            )
            this._gl.enableVertexAttribArray(NORMAL_ATTRIB_LOCATION)
        }


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


