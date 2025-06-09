export namespace math {
    export function range(n: number, min?: number, max?: number) {
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

    export function limit(n: number, min?: number, max?: number) {
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

    export function hypot(x: number, y: number) {
        return Math.sqrt(x * x + y * y)
    }
}

export namespace vector {
    export interface Vector2<T = number> {
        x: T
        y: T
    }

    export function some<T>(list: Array<Vector2<T>>, value: Vector2<T>) {
        return list.some((e) => e.x === value.x && e.y === value.y)
    }
}
