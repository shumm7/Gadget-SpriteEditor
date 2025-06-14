namespace vector {
    export interface Vector2<T = number> {
        x: T
        y: T
    }

    export function some<T>(list: Array<Vector2<T>>, value: Vector2<T>) {
        return list.some((e) => e.x === value.x && e.y === value.y)
    }
}

export default vector
