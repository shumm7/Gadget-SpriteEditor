namespace math {
    /**
     * Limit the given number `n` by the minimum and maximum values.
     * @param n Given number
     * @param min Minimum
     * @param max Maximum
     * @returns The value of `n`. If `n` is less than `min`, `min` will be returned. If `n` is greater than `max` also, `max` will be returned.
     */
    export function range(n: number, min?: number, max?: number): number {
        if (min !== undefined && max !== undefined && min > max) {
            return n
        }
        if (min !== undefined && min > n) {
            n = min
        }
        if (max !== undefined && max < n) {
            n = max
        }
        return n
    }

    /**
     * Checks whether the given number `n` is within the range of the minimum and maximum values, and returns undefined if it is out of range.
     * @param n Given number
     * @param min Minimum
     * @param max Maximum
     * @returns The value of `n`. If the value is outside the specified minimum or maximum range, it returns undefined.
     */
    export function limit(n: number, min?: number, max?: number): number | undefined {
        if (min !== undefined && max !== undefined && min > max) {
            return undefined
        }
        if (min !== undefined && min > n) {
            return undefined
        }
        if (max !== undefined && max < n) {
            return undefined
        }
        return n
    }

    /**
     * Get the square root of the sum of squares.
     * @param x First given number
     * @param y Second and subsequent given numbers
     * @returns Square root of sum of squares
     */
    export function hypot(x: number, ...y: number[]) {
        let sum: number = x * x
        for (let n of y) sum += n * n
        return Math.sqrt(sum)
    }
}

export default math
