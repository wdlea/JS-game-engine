import { Ray } from "../ts/math/ray"
import { vec4 } from "gl-matrix"


describe(
    "Rays",
    () => {
        test(
            "Ray stores data properly",
            () => {
                const o = vec4.fromValues(0, 0, 0, 0);
                const d = vec4.fromValues(1, 1, 1, 1);

                let r = new Ray(
                    o,
                    d
                )

                const [origin, direction] = r.Values;

                expect(origin).toStrictEqual(o)
                expect(direction).toStrictEqual(d)
            }
        ); test(
            "Ray normalizes properly",
            () => {
                const o = vec4.fromValues(5, 5, 17, 0);

                const d = vec4.fromValues(17, -100, 0.5, 0);

                const normD = vec4.create()
                vec4.normalize(normD, d)

                let r = new Ray(
                    o,
                    d
                )

                r.Normalize()

                const [origin, direction] = r.Values;

                expect(origin).toStrictEqual(o)
                expect(direction).toStrictEqual(normD)
            }
        ); test(
            "Ray steps properly",
            () => {
                const o = vec4.fromValues(0, 0, 0, 0);
                const d = vec4.fromValues(1, 1, 1, 1);

                let r = new Ray(
                    o,
                    d
                )

                expect(r.Step(1)).toStrictEqual(d)
            }
        )
    }
)