/**
 * c
 */

/**
 * Remaps value between vLow and vHigh so its between rLow and rHigh
 * @param {number} value The value to remap
 * @param {number} vLow The lower boundary of the input range
 * @param {number} vHigh The upper boundary of the input range
 * @param {number} rLow The lower boundary of the output range
 * @param {number} rHigh The upper boundary of the output range
 * @returns {number} The remapped value
 * 
 * @memberof module:Math
 * @alias module:Math.Remap
 */
export function Remap(value: number, vLow: number, vHigh: number, rLow: number, rHigh: number): number {
    if (vHigh <= vLow)
        throw new Error(`Input range ${vLow}-${vHigh} invalid, vLow must be less that vHigh`)

    if (rHigh <= rLow)
        throw new Error(`Output range ${rLow}-${rHigh} invalid, rLow must be less that rHigh`)

    if (value > vHigh || value < vLow)
        throw new Error(`Value ${value} not in input range ${vLow}-${vHigh}.`)

    //normalize input value so its between 0 and 1
    const normValue = (value - vLow) / (vHigh - vLow)

    //map value so its between rLow and rHigh
    return (normValue * (rHigh - rLow)) + rLow
}