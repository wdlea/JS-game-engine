import { mat4, vec3 } from "gl-matrix";
import { Entity, IComponent } from "../";
import { trash } from "../math";

export const TRANSFORM_IDENTIFIER: string = "TRANSFORM"

const LOG_MATRIX: boolean = true;

/**
 * Component that represents an objects tranformations in 3D space
 * @implements {IComponent}
 * 
 * @memberof module:Components
 */
export class Transform implements IComponent {

    public enabled = true;

    private position = vec3.fromValues(0, 0, 0);
    private rotationRAD = vec3.fromValues(0, 0, 0);
    private scale = vec3.fromValues(1, 1, 1);

    //Whether the position, rotation or scale respectively have been recomputed
    private scaleRecomputed = false;
    private rotationRecomputed = false;
    private positionRecomputed = false;

    //Matrices at each stage of computation
    private scaledMatrix: mat4 = mat4.create();
    private rotatedMatrix: mat4 = mat4.create()
    private movedMatrix: mat4 = mat4.create();

    public get ModelMatrix() {
        this.RecomputeAll();

        if (LOG_MATRIX)
            console.log(this.movedMatrix)

        return this.movedMatrix;
    }

    /**
     * Recomputes model view matrix scale, its position
     *  will remain at origin if cascade is not set to true
     * @param cascade whether to recursively call functions to recompute rotation and transformation
     */
    private RecomputeScale(cascade: boolean = true) {
        mat4.scale(this.scaledMatrix, mat4.create(), this.scale);
        this.scaleRecomputed = true;
        if (cascade) this.RecomputeRotation(cascade = true)
    }

    /**
     * Recomputes model view matrix rotation, 
     * this is in XYZ order, its position will remain at 
     * origin if cascade is not set to true
     * @param cascade whether to recursively call functions to recompute transformation
     */
    private RecomputeRotation(cascade: boolean = true) {
        if (!this.scaleRecomputed) {
            this.RecomputeScale(true)
        }
        this.rotationRecomputed = true;

        mat4.rotateX(this.rotatedMatrix, this.scaledMatrix, this.rotationRAD[0])
        mat4.rotateY(this.rotatedMatrix, this.scaledMatrix, this.rotationRAD[1])
        mat4.rotateZ(this.rotatedMatrix, this.scaledMatrix, this.rotationRAD[2])
        if (cascade) this.RecomputePosition();
    }

    /**
     * Recomputes modelMatrixes position
     */
    private RecomputePosition() {

        //check if other parts of matrix have been recomputed
        if (!this.scaleRecomputed) {
            this.RecomputeScale(true)
        }
        else if (!this.rotationRecomputed) {
            this.RecomputeRotation(true)
        }
        this.positionRecomputed = true;


        mat4.translate(this.movedMatrix, this.rotatedMatrix, this.position)
    }

    /**
     * Recomputes all values, if they need to be,
     * in scale, rotation(X->Y->Z)(RADS), position order
     */
    private RecomputeAll() {
        if (!this.positionRecomputed || !this.rotationRecomputed || !this.scaleRecomputed) {
            this.RecomputePosition();
        }
    }


    get Position() { return this.position }
    get RotationRAD() { return this.rotationRAD }
    get RotationDEG() { return vec3.scale(trash.vec3, this.rotationRAD, 180 / Math.PI) }
    get Scale() { return this.scale }

    set Position(v: vec3) {
        this.positionRecomputed = false;
        this.position = v
    }
    set RotationRAD(v: vec3) {
        this.rotationRecomputed = false;
        this.rotationRAD = v
    }
    set RotationDEG(v: vec3) {
        this.rotationRAD = vec3.scale(trash.vec3, v, Math.PI / 180)
    }
    set Scale(v: vec3) {
        this.scaleRecomputed = false;
        this.scale = v
    }

    IsCompatable(object: Entity): boolean { return true }
    OnAttach(): void { }
    Start(): void { }
    Update(): void { }
    get WhoAmI(): string { return TRANSFORM_IDENTIFIER; }
}