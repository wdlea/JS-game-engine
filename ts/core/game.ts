/**
 * This file contains the base "Game" class,
 */

import { mat4 } from "gl-matrix";
import { Transform } from "../components";
import { FetchProgram } from "../fetch";
import { IComponent } from "./component";
import { Scene } from "./scene";


const GL_CANVAS_SELECTOR = "canvas#render-canvas";

export let OnUpdate: { (): void } | null = null;


export const DEFAULT_PROGRAM_NAME = "default"

/**Base class for a game */
export class Game {
    //@ts-expect-error
    private Glcontext: WebGL2RenderingContext;
    private GLinitialized: boolean = false;

    private activeScene: Scene;


    /**Unloads current scene and replaces it with the new scene */
    set ActiveScene(newScene: Scene) {
        if (this.activeScene != newScene) {
            this.activeScene.Unload(this);//unload previous scene
            this.activeScene = newScene;//set new scene
        }

    }

    /**Returns the active scene */
    get ActiveScene(): Scene {
        return this.activeScene;
    }

    constructor(startingScene: Scene) {

        //load specified scene
        this.activeScene = startingScene;
        startingScene.Load(this);
    }

    /**initializes WEBGL and begins render/update loop*/
    public DefaultStartup() {
        this.StartWEBGL();
        this.StartRender();
    }


    public StartWEBGL() {
        this.InitWEBGL();
        this.ConfigureWEBGL();

        //if no webgl context could be found, the function will error out, then this will not be set to true
        this.GLinitialized = true;
    }
    public StartRender() {
        if (!this.GLinitialized) {
            throw new Error("Tried to render before webgl was intialized");
        }

        requestAnimationFrame(this.RecursivelyRender)//start rendering asyncronously

        while (1) {
            this.activeScene._Update();//update constantly
            if (OnUpdate !== null) { OnUpdate() }//allow other scripts to use CPU ticks 
        }
    }

    //returns an array of all components Entitys will have on them by defualt, such as Transform when i implement it
    public MakeDefaultComponents(): Array<IComponent> {
        return [new Transform()];
    }

    /**Finds WEBGL context as per GL_CANVAS_SELECTOR*/
    private InitWEBGL() {
        const glCanvas: HTMLCanvasElement | null = document.querySelector(GL_CANVAS_SELECTOR);
        if (glCanvas === null) {
            throw new Error("Could not find HTML element " + GL_CANVAS_SELECTOR)
        }

        const gl = glCanvas.getContext("webgl2")
        if (gl === null) {
            throw new Error("Could not obtain canvases WEBGL context, check that it is supported.");
        }
        this.Glcontext = gl;
    }

    /**Configures WEBGl with some settings*/
    private ConfigureWEBGL() {
        this.Glcontext.enable(this.Glcontext.DEPTH_TEST);//enable depth testing

        this.Glcontext.clearColor(0, 0, 0, 1);//clear to black
        this.Glcontext.clearDepth(1.0);//clear depth to 1 which is as far as possible from the camera

        this.Glcontext.clear(this.Glcontext.DEPTH_BUFFER_BIT | this.Glcontext.COLOR_BUFFER_BIT);//clear depth and colour buffers to specified values
    }


    /**called every animation frame, only call once*/
    private RecursivelyRender() {
        this.Glcontext.clear(this.Glcontext.COLOR_BUFFER_BIT | this.Glcontext.DEPTH_BUFFER_BIT)

        this.ActiveScene._OnRender()

        //recursive part
        requestAnimationFrame(this.RecursivelyRender)
    }
}