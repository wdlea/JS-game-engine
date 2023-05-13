import { stats, ResetStats } from "../ts/debugging/stats"

describe(
    "Debugging stats",
    () => {
        test(
            "Stats writes properly",
            () => {
                ResetStats();
                stats.indexCount = 69420

                expect(stats.indexCount).toBe(69420)
            }
        ); test(
            "Stats clears properly",
            () => {
                ResetStats();
                stats.indexCount = 666;
                ResetStats()
                expect(stats.indexCount).toBe(0)
            }
        )
    }
)