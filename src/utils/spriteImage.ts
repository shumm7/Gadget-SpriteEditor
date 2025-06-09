import { vector } from "./math"

export function downloadImage(
    image: HTMLImageElement | HTMLCanvasElement,
    filename: string = "sprite"
) {
    if (image instanceof HTMLImageElement) {
        const canvas = document.createElement("canvas")
        canvas.width = image.width
        canvas.height = image.height
        const ctx = canvas.getContext("2d")
        if (!ctx) throw new Error("failed to getContext from canvas")
        ctx.drawImage(image, 0, 0, image.width, image.height)
        return downloadImage(canvas, filename)
    } else if (image instanceof HTMLCanvasElement) {
        const link = document.createElement("a")
        link.href = image.toDataURL("image/png")
        link.download = filename + ".png"
        link.click()
    }
}

export function cropSprite(
    image: HTMLImageElement,
    pos: vector.Vector2,
    spriteSize: vector.Vector2
): HTMLCanvasElement | null {
    const canvas = document.createElement("canvas")
    canvas.width = image.width
    canvas.height = image.height

    const ctx = canvas.getContext("2d")
    if (ctx == null) return null

    ctx.drawImage(image, -spriteSize.x * pos.x, -spriteSize.y * pos.y, image.width, image.height)
    return canvas
}
