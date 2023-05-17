import { stats } from "./stats";

/**
 * Converts the current stats to a string
 * @returns {string} Wonder what this is?
 */
export function StringifyStats(): string {
    return `Took ${performance.now() - stats.startFrameTime}ms, ${stats.rendererCount} renderer(s), ${stats.indexCount} total indice(s), ${stats.meshDrawCalls} total draw call(s), ${stats.attribCalls} attribute calls`.toString()
}
/**
 * Displays the stats on an element
 * @param {HTMLElement} e The target element
 */
export function DisplayStringified(e: HTMLElement) {
    e.textContent = StringifyStats()
}