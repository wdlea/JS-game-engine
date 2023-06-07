import { constants, Ray, trash } from "../ts/math"
import { mat4, vec3, vec4 } from "gl-matrix"


describe(
    "Rays",
    () => {
        test(
            "Ray stores data properly",
            () => {
                const o = vec4.fromValues(0, 0, 0, 1);
                const d = vec4.fromValues(1, 1, 1, 1);

                let r = new Ray(
                    o,
                    d
                )

                const [origin, direction] = r.Values;

                expect(origin).toMatchObject(o)
                expect(direction).toMatchObject(d)
            }
        ); test(
            "Ray normalizes properly",
            () => {
                const o = vec4.fromValues(5, 5, 17, 1);

                const d = vec4.fromValues(17, -100, 0.5, 1);

                const normD = vec4.create()
                vec4.normalize(normD, d)

                let r = new Ray(
                    o,
                    d
                )

                r.Normalize()

                const [origin, direction] = r.Values;

                expect(origin).toMatchObject(o)
                expect(direction).toMatchObject(normD)
            }
        ); test(
            "Ray steps properly",
            () => {
                const o = constants.ORIGIN;
                const d = vec4.fromValues(1, 1, 1, 1);

                let r = new Ray(
                    o,
                    d
                )
                const stp = r.Step(1)
                console.log(stp)
                expect(stp).toMatchObject(d)
            }
        ); test(
            "Ray transforms properly",
            () => {
                let t = mat4.create()
                let tv = vec3.fromValues(
                    1, 2, 3
                )

                mat4.translate(t, t, tv)

                const o = constants.ORIGIN;
                const d = vec4.fromValues(1, 1, 1, 1);

                let ray = new Ray(
                    o, d
                )

                ray.Transform(t)

                const tv4 = vec4.fromValues(
                    tv[0],
                    tv[1],
                    tv[2],
                    0
                )


                expect(ray.Origin).toMatchObject(
                    vec4.add(trash.vec4, o, tv4)
                )

                expect(ray.Direction).toMatchObject(
                    vec4.add(trash.vec4, d, tv4)
                )
            }
        )
    }
)