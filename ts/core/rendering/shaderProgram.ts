import { ShaderAttribute } from "./shaderAttribute";
import { DEFAULT_UNIFORM_BLOCK_NAME } from "./uniforms";

export type AttributeLookup = {
    name: string,
    size: number,
    type: number
}

export type ShaderOrder = {
    fsIndex: number,
    vsIndex: number,
    lookupsIndex: number | null
}
type maybeCompiledShader = {
    source: string,
    shader: WebGLShader | null,
    type: number
}
function CompileMaybeCompiled(gl: WebGL2RenderingContext, m: maybeCompiledShader): maybeCompiledShader {
    if (m.shader === null) {
        const tShader = gl.createShader(m.type);
        if (tShader === null)
            throw Error("Could not create shader");

        gl.shaderSource(tShader, m.source);
        gl.compileShader(tShader);
        if (!gl.getShaderParameter(tShader, gl.COMPILE_STATUS))
            throw Error("Could not compile shader: " + gl.getShaderInfoLog(tShader) + " with source :" + m.source);

        m.shader = tShader;
    }

    return m;
}

/**
 * Represents a shader program
 * @category Rendering
 */
export class ShaderProgram {
    private program: WebGLProgram;
    public customAttributes: Array<ShaderAttribute>;

    private defaultUBI: number = -1;
    /**
     * Default Uniform Buffer Index
     */
    get DefaultUBI(): number {
        return this.defaultUBI;
    }

    get Program(): WebGLProgram {
        return this.program;
    }

    constructor(program: WebGLProgram, defaultUBI: number, attributes: Array<ShaderAttribute> = []) {
        this.program = program;
        this.customAttributes = attributes;
        this.defaultUBI = defaultUBI;
    }

    /**
     * Links a shader program, note that this only links, if you dont want to clutter you workflow with compile look into ShaderProgram.BatchCompileAndLink
     * @param gl WebGL2RenderingContext, 
     * @param vs WebGLShader, **V**ertex **S**hader
     * @param fs WebGLShader, **F**ragment **S**hader
     * @param attributesLookup Array<AttributeLookup>, an array of all the attributes you want to acess in the program, looked up by name
     * @returns ShaderProgram, the linked program
     */
    static FromShaders(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader, attributesLookup: Array<AttributeLookup> = []): ShaderProgram {
        const program = gl.createProgram();
        if (program === null)
            throw Error("Could not create shader program")

        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.validateProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
            throw Error("Could not link program: " + gl.getProgramInfoLog(program));

        let attribs: Array<ShaderAttribute> = []

        for (let attributeIndex = 0; attributeIndex < attributesLookup.length; attributeIndex++) {
            const element = attributesLookup[attributeIndex];

            const buffer = gl.createBuffer();
            if (buffer === null)
                throw Error("Could not create buffer" + gl.getError());

            const loc = gl.getAttribLocation(program, element.name)
            if (loc === null)
                throw Error("Could not find shader attribute: " + element.name);

            let attrib: ShaderAttribute = new ShaderAttribute(
                loc,
                element.size,
                element.type,
                buffer
            );


            attribs.push(attrib);
        }


        const shader = new ShaderProgram(
            program,
            gl.getUniformBlockIndex(program, DEFAULT_UNIFORM_BLOCK_NAME),
            attribs
        )

        return shader
    }

    /**
     * Compiles shaders in series and links them into programs
     * @param {WebGL2RenderingContext} gl the webgl rendering context
     * @param {Array<string>} avss **A**rray of **V**ertex **S**hader **S**ources
     * @param {Array<string>} afss **A**rray of **F**ragment **S**hader **S**ources
     * @param {Array<Array<AttributeLookup>>} attributesLookups An array containing arrays of attributes to lookup on a per-program basis by name
     * @param {Array<ShaderOrder>} orders All the programs you want creates
     * @returns Array<ShaderProgram> All the compiled and linked programs
     */
    static BatchCompileAndLink(gl: WebGL2RenderingContext, avss: Array<string>, afss: Array<string>, attributesLookups: Array<Array<AttributeLookup>>, orders: Array<ShaderOrder>): Array<ShaderProgram> {
        let maybeCompiledVertexShaders = new Array<maybeCompiledShader>(avss.length);
        let maybeCompiledFragmentShaders = new Array<maybeCompiledShader>(afss.length);

        for (let currentVs = 0; currentVs < avss.length; currentVs++) {
            const vss = avss[currentVs];
            maybeCompiledVertexShaders[currentVs] = {
                source: vss,
                type: gl.VERTEX_SHADER,
                shader: null
            }
        }
        for (let currentFs = 0; currentFs < afss.length; currentFs++) {
            const fss = afss[currentFs];
            maybeCompiledFragmentShaders[currentFs] = {
                source: fss,
                type: gl.FRAGMENT_SHADER,
                shader: null
            }
        }

        let finishedOrders: Array<ShaderProgram> = new Array<ShaderProgram>(orders.length)

        for (let orderNumber = 0; orderNumber < orders.length; orderNumber++) {
            const order = orders[orderNumber];

            if (order.fsIndex >= afss.length)
                throw new Error(`Fragment shader index ${order.fsIndex} too large ${afss.length}`)
            else if (order.fsIndex < 0)
                throw new Error(`Fragment shader index ${order.fsIndex} cant be negative`)

            if (order.vsIndex >= avss.length)
                throw new Error(`Vertex shader index ${order.vsIndex} too large ${avss.length}`)
            else if (order.vsIndex < 0)
                throw new Error(`Vertex shader index ${order.vsIndex} cant be negative`)


            let fs = maybeCompiledFragmentShaders[order.fsIndex]
            let vs = maybeCompiledVertexShaders[order.vsIndex]

            if (fs === undefined || vs === undefined)
                throw new Error("fs or vs is undefined, unreachable behavior")

            if (fs.shader === undefined || fs.shader === null) {
                fs = CompileMaybeCompiled(gl, fs);
                maybeCompiledFragmentShaders[order.fsIndex] = fs
            }
            if (vs.shader === undefined || vs.shader === null) {
                vs = CompileMaybeCompiled(gl, vs);
                maybeCompiledVertexShaders[order.vsIndex] = vs
            }

            if (fs.shader === undefined || fs.shader === null)
                throw Error("Unable to compile fragment shader")
            if (vs.shader === undefined || vs.shader === null)
                throw Error("Unable to compile vertex shader")

            finishedOrders[orderNumber] = ShaderProgram.FromShaders(
                gl,
                vs.shader,
                fs.shader,
                order.lookupsIndex != null ? attributesLookups[order.lookupsIndex] : undefined
            )
        }

        return finishedOrders;
    }
    /**
     * 
     * @param gl makes the current program active
     */
    Use(gl: WebGL2RenderingContext) {
        gl.useProgram(this.program)
    }
}

