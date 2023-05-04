import { FrameStats } from "../ts/debugger";

describe("FrameStats", () => {
    test("Clears data properly", () => {
        let f = new FrameStats()
        f.IndexCount = 6969

        f.End()

        expect(f.IndexCount).toBe(0);
    }), test("Copy is immutable and cant be changed by changing a non-Readonly copy", () => {
        let f = new FrameStats()
        f.IndexCount = 6969

        let copy = f.End()

        f.IndexCount = 10101

        expect(copy.IndexCount).toBe(6969);
        expect(f.IndexCount).toBe(10101)
    })
})