import { Model } from "obj-lib/lib/model";

export class LoadedMesh {
    public vertexBuffer: WebGLBuffer;
    public indexBuffer: WebGLBuffer;
    public normalBuffer: WebGLBuffer;
    public textureBuffer: WebGLBuffer;

    public indexCount: number = -1;

    constructor(gl: WebGLRenderingContext) {


        const tempVertexBuffer = gl.createBuffer();
        const tempTriangleBuffer = gl.createBuffer();
        const tempNormalBuffer = gl.createBuffer();
        const tempTextureBuffer = gl.createBuffer();

        if (tempTriangleBuffer === null || tempVertexBuffer === null || tempNormalBuffer === null || tempTextureBuffer === null) {
            throw Error("Could not create 1 or more buffers");
        }

        this.vertexBuffer = tempVertexBuffer;
        this.indexBuffer = tempTriangleBuffer;
        this.normalBuffer = tempNormalBuffer;
        this.textureBuffer = tempTextureBuffer;
    }

    /**
     * Returns a mesh object from a Model object
     * @param gl WebGLRenderingContext, the webgl rendering context
     * @param model Model the model to make into a mesh
     * @returns mesh, the constructed mesh object
     */
    static FromModel(gl: WebGLRenderingContext, model: Model): LoadedMesh {
        const loaded = new LoadedMesh(gl);



        //unpack all vertices
        let vertexArray = new Float32Array(model.vertices.length * 4);
        for (let vertex = 0; vertex < model.vertices.length; vertex++) {
            const element = model.vertices[vertex];
            vertexArray.set(element, vertex * 4);
        }

        //buffer vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, loaded.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);


        //cast indices to uint16array
        const indicesArray = new Uint16Array(model.indices);
        loaded.indexCount = model.indices.length;//set indexCount

        //buffer indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, loaded.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesArray, gl.STATIC_DRAW);

        //unpack normals
        let normalArray = new Float32Array(model.Normals.length * 3);
        for (let normal = 0; normal < model.Normals.length; normal++) {
            const element = model.Normals[normal];
            normalArray.set(element, normal * 3)
        }

        //set normals
        gl.bindBuffer(gl.ARRAY_BUFFER, loaded.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, normalArray, gl.STATIC_DRAW);

        //unpack texture coordinates
        let textureArray = new Float32Array(model.UVs.length * 3);
        for (let uv = 0; uv < model.UVs.length; uv++) {
            const element = model.UVs[uv];
            textureArray.set(element, uv * 3);
        }

        //set texture coords
        gl.bindBuffer(gl.ARRAY_BUFFER, loaded.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, textureArray, gl.STATIC_DRAW)

        return loaded
    }
}