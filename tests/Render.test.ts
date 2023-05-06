import { MeshRenderer, Transform } from "../ts/components"
import { IsRenderer } from "../ts/core/rendering"

describe("Renderer Interface",
    () => {
        test("MeshRenderer is considered as IRenderer", () => {
            let m = new MeshRenderer()
            expect(IsRenderer(m)).toBe(true)
        }), test("Transform isnt considered as IRenderer", () => {
            let t = new Transform()
            expect(IsRenderer(t)).toBe(false)
        })
    }
)