/**
 * Contains the transform component
 */

import { mat4, vec3 } from "gl-matrix";
import { IComponent } from "../component";
import { Entity } from "../entity";

export const TRANSFORM_IDENTIFIER: string = "TRANSFORM"

//this vector is here so i can set things to this and not worry about consequences, DO NOT read from it
let it_recieves = vec3.create();

/**
 * Component that represents an objects tranformations in 3D space
 */
export class Transform implements IComponent {

    public enabled = true;

    private position = vec3.create();
    private rotationRAD = vec3.create();
    private scale = vec3.create();

    //Whether the position, rotation or scale respectively have changed since recomputation
    private scaleUpdated = false;
    private rotationUpdated = false;
    private positionUpdated = false;

    //Matrices at each stage of computation
    private scaledMatrix: mat4 = mat4.create();
    private rotatedMatrix: mat4 = mat4.create()
    private movedMatrix: mat4 = mat4.create();

    public get ModelMatrix() {
        this.RecomputeAll();
        return this.movedMatrix;
    }

    /**
     * Recomputes model view matrix scale, its position
     *  will remain at origin if callnext is not set to true
     * @param callnext whether to recursively call functions to recompute rotation and transformation
     */
    private RecomputeScale(callnext: boolean = true) {
        mat4.scale(this.scaledMatrix, mat4.create(), this.scale);
        this.scaleUpdated = true;
        if (callnext) this.RecomputeRotation(callnext = true)
    }

    /**
     * Recomputes model view matrix rotation, 
     * this is in XYZ order, its position will remain at 
     * origin if callnext is not set to true
     * @param callnext whether to recursively call functions to recompute transformation
     */
    private RecomputeRotation(callnext: boolean = true) {
        if (!this.scaleUpdated) {
            this.RecomputeScale(true)
        }
        this.rotationUpdated = true;

        mat4.rotateX(this.rotatedMatrix, this.scaledMatrix, this.rotationRAD[0])
        mat4.rotateY(this.rotatedMatrix, this.scaledMatrix, this.rotationRAD[1])
        mat4.rotateZ(this.rotatedMatrix, this.scaledMatrix, this.rotationRAD[2])
        if (callnext) this.RecomputePosition();
    }

    /**
     * Recomputes modelMatrixes position
     */
    private RecomputePosition() {

        //check if other parts of matrix have been recomputed
        if (!this.scaleUpdated) {
            this.RecomputeScale(true)
        }
        if (!this.rotationUpdated) {
            this.RecomputeRotation(true)
        }
        this.positionUpdated = true;


        mat4.translate(this.movedMatrix, this.rotatedMatrix, this.position)
    }

    /**
     * Recomputes all values, if they need to be,
     * in scale, rotation(X->Y->Z)(RADS), position order
     */
    private RecomputeAll() {
        if (this.positionUpdated || this.rotationUpdated || this.scaleUpdated) {
            this.RecomputePosition();
        }
    }


    get Position() { return this.position }
    get RotationRAD() { return this.rotationRAD }
    get RotationDEG() { return vec3.scale(it_recieves, this.rotationRAD, 180 / Math.PI) }
    get Scale() { return this.scale }

    set Position(v: vec3) {
        this.positionUpdated = true;
        this.position = v
    }
    set RotationRAD(v: vec3) {
        this.rotationUpdated = true;
        this.rotationRAD = v
    }
    set RotationDEG(v: vec3) {
        this.rotationRAD = vec3.scale(it_recieves, v, Math.PI / 180)
    }
    set Scale(v: vec3) {
        this.scaleUpdated = true;
        this.scale = v
    }

    IsCompatable(object: Entity): boolean { return true }
    OnAttach(): void { }
    Start(): void { }
    Update(): void { }
    get WhoAmI(): string { return TRANSFORM_IDENTIFIER; }
}