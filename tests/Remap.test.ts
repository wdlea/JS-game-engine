import { Remap } from "../ts/math"

describe(
    "Remap function",
    () => {
        test(
            "Remaps properly",
            () => {
                expect(
                    Remap(
                        5,
                        0,
                        10,
                        0,
                        1
                    )
                ).toBe(0.5)

                expect(
                    Remap(
                        -10,
                        -12,
                        -8,
                        0,
                        10
                    )
                ).toBe(5)
            }
        ); test(
            "Errors out on invalid inputs",
            () => {
                expect(
                    () => {
                        Remap(
                            0,
                            1,
                            2,
                            0,
                            1
                        )
                    }
                ).toThrow()
                expect(
                    () => {
                        Remap(
                            0,
                            2,
                            1,
                            0,
                            1
                        )
                    }
                ).toThrow()
                expect(
                    () => {
                        Remap(
                            1,
                            1,
                            2,
                            3,
                            2
                        )
                    }
                ).toThrow()
            }
        )
    }
)