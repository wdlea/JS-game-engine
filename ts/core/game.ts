import { Transform } from "../components";

import { IComponent } from "./component";
import { Scene } from "./scene";

const MAX_UPDATE_HZ = 50;

/**
 * This is called after every update, if you want to do something then, use this!
 * @default null
 */
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
        console.log("Performing default startup")

        console.log("Starting webgl")
        this.StartWEBGL();

        console.log("Starting render loop")
        this.StartRender();

        console.log("Starting update cycle")
        setInterval(this.BoundUpdate, 1000 / MAX_UPDATE_HZ);

        console.log("Finished Startup")
    }

    /**
     * Starts webgl, gets it ready to draw
     */
    public StartWEBGL = () => {
        console.log("Starting WEBGL")
        this.ConfigureWEBGL();

        //if no webgl context could be found, the function will error out, then this will not be set to true
        this.GLinitialized = true;
    }
    /**
     * Starts render loop
     */
    public StartRender = () => {
        console.log("Starting render")
        if (!this.GLinitialized) {
            throw new Error("Tried to render before webgl was intialized");
        }

        console.log("actually begun rendering")
        requestAnimationFrame(this.RecursivelyRender)
    }

    /**
     * Update, but bound
     */
    private BoundUpdate = this.Update.bind(this);

    /**
     * Update all components in active scene
     */
    Update() {
        this.activeScene.Update();//update constantly
        if (OnUpdate !== null) { OnUpdate() }//allow other scripts to use CPU ticks 
    }

    /**
     * returns an array of all components Entitys will have on them by defualt, such as Transform.
     * You [the end user] can override this, look at the source.
     * @returns {Array<IComponent>} New instances of all the default components
    */
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

    /**
     * called every animation frame, only call once, it recurses, as the name suggests.
     */
    private RecursivelyRender = () => {

        this.Glcontext.clear(this.Glcontext.COLOR_BUFFER_BIT | this.Glcontext.DEPTH_BUFFER_BIT)

        //recursive part
        requestAnimationFrame(this.RecursivelyRender)
    }

}