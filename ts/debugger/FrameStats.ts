/**
 * Class that represents the stats within the frame
 * @category Debugging
 */
export class FrameStats {
    RendererCount = 0;
    IndexCount = 0;
    RenderStartTime = 0;
    RenderEndTime = 0;
    CustomAttribCount = 0;
    /**
     * Closes a FrameStats, fills in remaining fields and returns a frozen copy, the zeros the instance it is called on
     * @returns {Readonly<FrameStats>}
     */
    End = (): Readonly<FrameStats> => {
        this.RenderEndTime = performance.now();
        const ret: Readonly<FrameStats> = Object.freeze({ ...this });

        this.Zero()

        return ret
    }
    /**
     * Zeros a FrameStats so it can be used in a next fromae
     */
    Zero = () => {
        this.RendererCount = 0;
        this.IndexCount = 0;
        this.CustomAttribCount = 0;
        this.RenderStartTime = performance.now();
        this.RenderEndTime = 0;
    }
}