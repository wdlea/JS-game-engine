import { IComponent } from "./component";
import { Scene } from "./scene";


const GL_CANVAS_SELECTOR = "canvas#render-canvas";

export let OnUpdate: { (): void } | null = null;

export class Game {
    private Glcontext: WebGLRenderingContext;

    private activeScene: Scene;
    set ActiveScene(newScene: Scene) {
        if (this.activeScene != newScene) {
            this.activeScene.Unload(this);//unload previous scene
            this.activeScene = newScene;//set new scene
        }

    }
    get ActiveScene(): Scene {
        return this.activeScene;
    }

    constructor(startingScene: Scene) {
        this.Glcontext = new WebGLRenderingContext();//this value will never be used, but typescript seems to think it necessary so its here

        //load specified scene
        this.activeScene = startingScene;
        startingScene.Load(this);

        //get and configure WEBGL context
        this.InitWEBGL();
        this.ConfigureWEBGL();

        requestAnimationFrame(this.RecursivelyRender)//start rendering asyncronously

        while (1) {
            this.activeScene._Update();//update constantly
            if (OnUpdate !== null) { OnUpdate() }//allow other scripts to use CPU ticks 
        }
    }

    //returns an array of all components GameObjects will have on them by defualt, such as Transform when i implement it
    public MakeDefaultComponents(): Array<IComponent> {
        return [];
    }

    //gets webgl context
    private InitWEBGL() {
        const glCanvas: HTMLCanvasElement | null = document.querySelector(GL_CANVAS_SELECTOR);
        if (glCanvas === null) {
            throw new Error("Could not find HTML element " + GL_CANVAS_SELECTOR)
        }

        const gl = glCanvas.getContext("webgl")
        if (gl === null) {
            throw new Error("Could not obtain canvases WEBGL context, check that it is supported.");
        }
        this.Glcontext = gl;
    }

    //configures webgl
    private ConfigureWEBGL() {
        this.Glcontext.enable(this.Glcontext.DEPTH_TEST);//enable depth testing

        this.Glcontext.clearColor(0, 0, 0, 1);//clear to black
        this.Glcontext.clearDepth(1.0);//clear depth to 1 which is as far as possible from the camera

        this.Glcontext.clear(this.Glcontext.DEPTH_BUFFER_BIT | this.Glcontext.COLOR_BUFFER_BIT);//clear depth and colour buffers to specified values
    }


    //called every animation frame, only call once
    private RecursivelyRender() {
        this.Glcontext.clear(this.Glcontext.COLOR_BUFFER_BIT | this.Glcontext.DEPTH_BUFFER_BIT)

        this.ActiveScene._OnRender(this.Glcontext)

        //recursive part
        requestAnimationFrame(this.RecursivelyRender)
    }
}