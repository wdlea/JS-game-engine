/**
 * This file is the entry point of the package, and serves no purpouse but to make everything visible
 */

import { IComponent } from "./component";
import { Entity } from "./entity";
import { Game } from "./game";
import { IsRenderer, IRenderer } from "./renderer";
import { Scene } from "./scene";


//exports grouped by file
export {
    //component.ts
    IComponent,

    //renderer.ts
    IRenderer,
    IsRenderer,

    //game.ts
    Game,

    //scene.ts
    Scene,

    //entity.ts
    Entity,
}