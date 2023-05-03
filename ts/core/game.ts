/**
 * This file contains the base "Game" class,
 */

import { Transform } from "../components";

import { IComponent } from "./component";
import { Scene } from "./scene";

const MAX_UPDATE_HZ = 50;


const GL_CANVAS_SELECTOR = "canvas#render-canvas";

export let OnUpdate: { (): void } | null = null;


export const DEFAULT_PROGRAM_NAME = "default"

/**
 * Base class for a Game
 * @category Core
 */
export class Game {
    private Glcontext: WebGL2RenderingContext;
    private GLinitialized: boolean = false;

    private activeScene: Scene;


    /**Unloads current scene and replaces it with the new scene */
    set ActiveScene(newScene: Scene) {
        this.activeScene.Unload(this);//unload previous scene
        this.activeScene = newScene;//set new scene
    }

    /**Returns the active scene */
    get ActiveScene(): Scene {
        return this.activeScene;
    }

    constructor(startingScene: Scene, gl: WebGL2RenderingContext) {

        //load specified scene
        this.activeScene = startingScene;
        startingScene.Load(this);

        this.Glcontext = gl;
    }

    /**initializes WEBGL and begins render/update loop*/
    public DefaultStartup() {
        this.StartWEBGL();
        this.StartRender();
    }


    public StartWEBGL() {
        this.ConfigureWEBGL();

        //if no webgl context could be found, the function will error out, then this will not be set to true
        this.GLinitialized = true;

        setInterval(this.BoundUpdate, 1000 / MAX_UPDATE_HZ);
    }
    public StartRender() {
        if (!this.GLinitialized) {
            throw new Error("Tried to render before webgl was intialized");
        }

        requestAnimationFrame(this.BoundRecursivelyRender)//start rendering asyncronously
    }

    private BoundUpdate = this.Update.bind(this);
    Update() {
        this.activeScene.Update();//update constantly
        if (OnUpdate !== null) { OnUpdate() }//allow other scripts to use CPU ticks 
    }

    //returns an array of all components Entitys will have on them by defualt, such as Transform when i implement it
    public MakeDefaultComponents(): Array<IComponent> {
        return [new Transform()];
    }

    /**Configures WEBGl with some settings*/
    private ConfigureWEBGL() {
        this.Glcontext.enable(this.Glcontext.DEPTH_TEST);//enable depth testing

        this.Glcontext.clearColor(1, 0, 1, 1);//clear to magenta so i know its working
        this.Glcontext.clearDepth(1.0);//clear depth to 1 which is as far as possible from the camera

        this.Glcontext.clear(this.Glcontext.DEPTH_BUFFER_BIT | this.Glcontext.COLOR_BUFFER_BIT);//clear depth and colour buffers to specified values
    }

    private BoundRecursivelyRender = this.RecursivelyRender.bind(this);
    /**called every animation frame, only call once*/
    private RecursivelyRender() {
        this.Glcontext.clear(this.Glcontext.COLOR_BUFFER_BIT | this.Glcontext.DEPTH_BUFFER_BIT)

        this.ActiveScene.OnRender()

        //recursive part
        requestAnimationFrame(this.BoundRecursivelyRender)
    }
}