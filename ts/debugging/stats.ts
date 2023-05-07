/**
 * This type holds all the debugging stats
 */
export type Stats = {
    indexCount: number,
    rendererCount: number,
    startFrameTime: number,
    meshDrawCalls: number
}

/**
 * Resets the Stats context
 * @see {stats}
 */
export function ResetStats() {
    stats = {
        indexCount: 0,
        rendererCount: 0,
        startFrameTime: performance.now(),
        meshDrawCalls: 0,
    }
}


/**
 * The "context" for debugging
 */
export let stats: Stats;
ResetStats()