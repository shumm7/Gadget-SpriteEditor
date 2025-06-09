import { HOOKS } from "@/utils/hooks"
import { getImageinfo } from "@/utils/io"
import { math, vector } from "@/utils/math"
import { Message } from "@/utils/message"

export namespace SpriteCanvas {
    export interface LayoutConfig {}

    export class Layout {
        // dom
        layout: OO.ui.Layout
        private $canvasContainer: JQuery<HTMLElement>
        private $canvas: JQuery<HTMLCanvasElement>
        private _canvas: HTMLCanvasElement | null = null
        private _canvasContainer: HTMLElement | null = null
        private _ctx: CanvasRenderingContext2D | null = null

        // sprite data
        private _data: Record<string, any> = {}

        // image
        private image: HTMLImageElement
        private imageSize: vector.Vector2 = { x: 0, y: 0 }

        // canvas
        private scale: number = 1
        multiSelect: boolean = false
        private selected: Array<vector.Vector2> = []
        private location: vector.Vector2 = { x: 0.5, y: 0.5 }
        private spriteSize: vector.Vector2 = { x: 32, y: 32 }

        private canvasOption = {
            grid: true,
            backgroundColor: "black",
            gridLineColor: "rgba(0, 255, 0, 0.6)",
            gridCenterLineColor: "rgba(255, 0, 0, 0.6)",
            gridLineWidth: 1,
            highlightColor: "rgba(255,0,0,0.6)",
            selectionColor: "rgba(0,0,255,0.3)",
        }

        // parameters

        private parameters: OO.ui.HorizontalLayout
        private parameterScale: OO.ui.LabelWidget
        private parameterSelected: OO.ui.LabelWidget

        // canvas inside value
        private prevLocationLeft: vector.Vector2 | null = null
        private prevLocationRight: vector.Vector2 | null = null
        private mouseLeftClickPos: vector.Vector2 | null = null
        private mouseRightClickPos: vector.Vector2 | null = null

        constructor(image: HTMLImageElement, data: Record<string, any>, config?: LayoutConfig) {
            if (!config) config = {}

            // image
            this.image = image
            this.image.crossOrigin = "Anonymous"

            // data
            this.data = data

            // element
            this.$canvas = $(
                `<canvas id="mjw-sprite-editor-canvas" class="mjw-sprite-editor--component-canvas" height="300" width="300"/>`
            )
            this.$canvasContainer = $(
                `<div id="mjw-sprite-editor-canvas-container" class="mjw-sprite-editor--component-canvas--container"></div>`
            ).append(this.$canvas)

            // canvas indicators
            this.parameterScale = new OO.ui.LabelWidget()
            this.parameterSelected = new OO.ui.LabelWidget()
            this.parameters = new OO.ui.HorizontalLayout({
                items: [this.parameterScale, this.parameterSelected],
            })

            this.layout = new OO.ui.Layout({ content: [this.$canvasContainer, this.parameters] })
            this.initCanvas()
        }

        loadImage(text: string) {
            if (URL.canParse(text)) {
                this.image.src = text
                this.image.decode().then((e) => {
                    this.imageSize.x = this.image.width
                    this.imageSize.y = this.image.height
                    mw.hook(HOOKS.changedImage).fire(text)
                    this.resetCanvas()
                })
            } else {
                const $this = this
                getImageinfo(text).then(function (imageinfo) {
                    text = imageinfo.url
                    $this.image.src = text
                    $this.image.decode().then((e) => {
                        $this.imageSize.x = imageinfo.width
                        $this.imageSize.y = imageinfo.currentHeight
                        mw.hook(HOOKS.changedImage).fire(text)
                        $this.resetCanvas()
                    })
                })
            }
        }

        // canvas draw
        private initCanvas() {
            const canvas = this.canvas
            const canvasContainer = this.canvasContainer
            if (canvas == null) return
            if (canvasContainer == null) return

            const ctx = this.ctx
            if (ctx == null) return

            /* リサイズ検知 */
            const observer = new ResizeObserver((entries) => {
                var entry = entries[0]
                if (!canvas) return

                const directionIsHorizontal =
                    getComputedStyle(canvas).writingMode.startsWith("horizontal")

                //const size = entry.devicePixelContentBoxSize[0]
                const size = entry.contentBoxSize[0]
                canvas.height = directionIsHorizontal ? size.blockSize : size.inlineSize
                canvas.width = directionIsHorizontal ? size.inlineSize : size.blockSize
                draw()
            })
            observer.observe(canvasContainer, { box: "device-pixel-content-box" })

            /* 描画処理 */
            const draw = () => this.resetCanvas()
            draw()

            /* MouseDown イベントハンドラー */
            const mouseDown = (e: MouseEvent) => {
                const canvasRect = canvas.getBoundingClientRect()
                const x = e.clientX - canvasRect.left
                const y = e.clientY - canvasRect.top

                if (e.button === 0) {
                    this.prevLocationLeft = { x, y }
                    this.mouseLeftClickPos = { x, y }
                } else if (e.button === 2) {
                    this.prevLocationRight = { x, y }
                    this.mouseRightClickPos = { x, y }
                }
            }

            /* MouseMove イベントハンドラー */
            const mouseMove = (e: MouseEvent) => {
                const canvasRect = canvas.getBoundingClientRect()
                const pos = {
                    x: e.clientX - canvasRect.left,
                    y: e.clientY - canvasRect.top,
                }

                if (this.prevLocationLeft != null) {
                    if (
                        this.mouseLeftClickPos !== null &&
                        math.hypot(
                            this.mouseLeftClickPos.x - pos.x,
                            this.mouseLeftClickPos.y - pos.y
                        ) > 10
                    ) {
                        this.mouseLeftClickPos = null
                    }

                    const dx = pos.x - this.prevLocationLeft.x
                    const dy = pos.y - this.prevLocationLeft.y
                    this.location = {
                        x: math.range(
                            this.location.x + dx / canvas.width,
                            -3 * this.scale,
                            3 * this.scale
                        ),
                        y: math.range(
                            this.location.y + dy / canvas.height,
                            -3 * this.scale,
                            3 * this.scale
                        ),
                    }
                    this.prevLocationLeft = { x: pos.x, y: pos.y }
                }
                if (this.prevLocationRight != null) {
                    this.prevLocationRight = { x: pos.x, y: pos.y }
                }
                draw()
            }

            /* MouseUp イベントハンドラー */
            const mouseUp = (e: MouseEvent) => {
                const canvasRect = canvas.getBoundingClientRect()
                const pos = {
                    x: e.clientX - canvasRect.left,
                    y: e.clientY - canvasRect.top,
                }

                if (e.button === 0) {
                    /* 左クリック（スプライトを選択） */
                    this.prevLocationLeft = null

                    if (
                        this.mouseLeftClickPos !== null &&
                        math.hypot(
                            this.mouseLeftClickPos.x - pos.x,
                            this.mouseLeftClickPos.y - pos.y
                        ) < 10
                    ) {
                        const loc = this.getSpriteLocation(canvas, pos)

                        if (loc.x !== undefined && loc.y !== undefined) {
                            if (this.multiSelect) {
                                if (vector.some(this.selected, loc)) {
                                    this.selectedSprite = this.selected.filter((e) => {
                                        return !(e.x === loc.x && e.y === loc.y)
                                    })
                                } else {
                                    if (loc.x !== undefined && loc.y !== undefined) {
                                        this.selectedSprite.push({ x: loc.x, y: loc.y })
                                    }
                                }
                            } else {
                                if (loc.x !== undefined && loc.y !== undefined) {
                                    this.selectedSprite = [{ x: loc.x, y: loc.y }]
                                }
                            }
                            draw()
                        }
                    }
                } else if (e.button === 2) {
                    /* 右クリック（範囲選択） */
                    if (this.prevLocationRight !== null && this.mouseRightClickPos !== null) {
                        const locStart = this.getSpriteLocationRange(
                            canvas,
                            this.mouseRightClickPos
                        )
                        const locEnd = this.getSpriteLocationRange(canvas, pos)
                        let ret = []
                        for (
                            let x = Math.min(locStart.x, locEnd.x);
                            x <= Math.max(locStart.x, locEnd.x);
                            x++
                        ) {
                            for (
                                let y = Math.min(locStart.y, locEnd.y);
                                y <= Math.max(locStart.y, locEnd.y);
                                y++
                            ) {
                                ret.push({ x, y })
                            }
                        }
                        this.selectedSprite = ret
                    }
                    this.prevLocationRight = null
                    draw()
                }
            }

            /* MouseWheel イベントハンドラー */
            const mouseWheel = (e: WheelEvent) => {
                e.preventDefault()

                // キャンバスの拡大縮小
                const newScale = math.range(this.scale + e.deltaY * -0.001, 0.1, 5.0)
                const dx = (this.location.x - 0.5) / this.scale
                const dy = (this.location.y - 0.5) / this.scale

                this.location = {
                    x: dx * newScale + 0.5,
                    y: dy * newScale + 0.5,
                }
                this.canvasScale = newScale
            }

            /* MouseLeave イベントハンドラー */
            const mouseLeave = (e: MouseEvent) => {
                this.prevLocationLeft = null
            }

            canvas.addEventListener("mousedown", mouseDown)
            canvas.addEventListener("mousemove", mouseMove)
            canvas.addEventListener("mouseup", mouseUp)
            canvas.addEventListener("wheel", mouseWheel)
            canvas.addEventListener("mouseleave", mouseLeave)
            canvas.oncontextmenu = () => false
        }

        private resetCanvas() {
            const canvas = this.canvas
            const ctx = this.ctx
            this.resetParameters()

            if (canvas !== null && ctx !== null) {
                // Canvasのサイズ取得
                const whiteboardLeftTop = this.getWhiteboardLeftTop(canvas)
                const gridStep: vector.Vector2 = { x: this.spriteSize.x, y: this.spriteSize.y }

                // 背景色描画
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.fillStyle = this.canvasOption.backgroundColor
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                // スプライトシートを描画
                ctx.drawImage(
                    this.image,
                    whiteboardLeftTop.x,
                    whiteboardLeftTop.y,
                    this.imageSize.x * this.scale,
                    this.imageSize.y * this.scale
                )

                // グリッド描画
                if (this.canvasOption.grid) {
                    const lineWidth = this.canvasOption.gridLineWidth
                    const gridStart = {
                        x: whiteboardLeftTop.x % (gridStep.x * this.scale),
                        y: whiteboardLeftTop.y % (gridStep.y * this.scale),
                    }

                    for (let x = 0; x <= canvas.width / (gridStep.x * this.scale) + 1; x++) {
                        ctx.fillStyle = this.canvasOption.gridLineColor
                        ctx.fillRect(
                            x * gridStep.x * this.scale + gridStart.x + -lineWidth / 2,
                            0,
                            lineWidth,
                            canvas.height
                        )
                    }
                    for (let y = 0; y <= canvas.height / (gridStep.y * this.scale) + 1; y++) {
                        ctx.fillStyle = this.canvasOption.gridLineColor
                        ctx.fillRect(
                            0,
                            y * gridStep.y * this.scale + gridStart.y + -lineWidth / 2,
                            canvas.width,
                            lineWidth
                        )
                    }
                }

                // 選択中のスプライトハイライト
                const sprite = {
                    x: this.spriteSize.x * this.scale,
                    y: this.spriteSize.y * this.scale,
                }
                this.selected.map((l) => {
                    ctx.fillStyle = this.canvasOption.highlightColor
                    ctx.fillRect(
                        whiteboardLeftTop.x + sprite.x * l.x,
                        whiteboardLeftTop.y + sprite.y * l.y,
                        this.spriteSize.x * this.scale,
                        this.spriteSize.y * this.scale
                    )
                })

                // 範囲選択
                if (this.mouseRightClickPos !== null && this.prevLocationRight !== null) {
                    ctx.fillStyle = this.canvasOption.selectionColor
                    ctx.fillRect(
                        this.mouseRightClickPos.x,
                        this.mouseRightClickPos.y,
                        this.prevLocationRight.x - this.mouseRightClickPos.x,
                        this.prevLocationRight.y - this.mouseRightClickPos.y
                    )
                }
            }
        }

        private resetParameters() {
            this.parameterScale.setLabel(
                Message.getObj("editor-canvas-scale", Math.floor(this.canvasScale * 100)).parseDom()
            )

            if (this.selectedSprite.length === 1) {
                this.parameterSelected.setLabel(
                    Message.getObj(
                        "editor-canvas-selected",
                        this.selectedSprite.length,
                        this.selectedSprite[0].x,
                        this.selectedSprite[0].y
                    ).parseDom()
                )
            } else {
                this.parameterSelected.setLabel(
                    Message.getObj(
                        "editor-canvas-selected-multiple",
                        this.selectedSprite.length
                    ).parseDom()
                )
            }
        }

        // inside functions
        private getWhiteboardLeftTop(canvas: HTMLCanvasElement): vector.Vector2 {
            const currentWidth = this.imageSize.x * this.scale
            const currentHeight = this.imageSize.y * this.scale
            const vec: vector.Vector2 = {
                x: (this.location.x - 0.5) * canvas.width,
                y: (this.location.y - 0.5) * canvas.height,
            }

            return {
                x: -currentWidth / 2 + canvas.width / 2 + vec.x,
                y: -currentHeight / 2 + canvas.height / 2 + vec.y,
            }
        }

        private getSpriteLocation(
            canvas: HTMLCanvasElement,
            mousePos: vector.Vector2
        ): vector.Vector2<number | undefined> {
            const vec = this.getWhiteboardLeftTop(canvas)
            const pos: vector.Vector2 = {
                x: Math.floor((mousePos.x - vec.x) / this.spriteSize.x / this.scale),
                y: Math.floor((mousePos.y - vec.y) / this.spriteSize.y / this.scale),
            }

            return {
                x: math.limit(pos.x, 0, Math.ceil(this.imageSize.x / this.spriteSize.x) - 1),
                y: math.limit(pos.y, 0, Math.ceil(this.imageSize.y / this.spriteSize.y) - 1),
            }
        }

        private getSpriteLocationRange = (
            canvas: HTMLCanvasElement,
            mousePos: vector.Vector2
        ): vector.Vector2 => {
            const vec = this.getWhiteboardLeftTop(canvas)
            const pos: vector.Vector2 = {
                x: Math.floor((mousePos.x - vec.x) / this.spriteSize.x / this.scale),
                y: Math.floor((mousePos.y - vec.y) / this.spriteSize.y / this.scale),
            }

            return {
                x: math.range(pos.x, 0, Math.ceil(this.imageSize.x / this.spriteSize.x) - 1),
                y: math.range(pos.y, 0, Math.ceil(this.imageSize.y / this.spriteSize.y) - 1),
            }
        }

        // getter / setter
        get $element() {
            return this.layout.$element
        }
        set $element(value: JQuery<HTMLElement>) {
            this.layout.$element = value
        }

        get id() {
            return this.layout.getElementId()
        }
        set id(value: string) {
            this.layout.setElementId(value)
        }

        get data() {
            return this._data
        }
        set data(value: Record<string, any>) {
            if (typeof value === "object" && value !== null) {
                if ("settings" in value) {
                    const spriteSizeX = Number(
                        value.settings["width"] || value.settings["size"] || 32
                    )
                    const spriteSizeY = Number(
                        value.settings["height"] || value.settings["size"] || 32
                    )
                    if (isFinite(spriteSizeX) && isFinite(spriteSizeY)) {
                        this.spriteSize.x = Math.floor(spriteSizeX)
                        this.spriteSize.y = Math.floor(spriteSizeY)
                    }
                    this.loadImage(value.settings["image"])
                }
            }

            this._data = value
        }

        get canvasScale() {
            return this.scale
        }
        set canvasScale(value: number) {
            if (isFinite(value)) {
                this.scale = math.range(value, 0.1, 5.0)
            } else {
                this.scale = 1
            }
            this.resetCanvas()
        }

        get selectedSprite() {
            return this.selected.concat()
        }
        set selectedSprite(value: vector.Vector2<number>[]) {
            this.selected = value
            mw.hook(HOOKS.selected).fire(this.selected)
            this.resetCanvas()
        }

        get canvasLocation() {
            return this.location
        }

        private get canvasContainer(): HTMLElement | null {
            if (this._canvasContainer === null) {
                return this.$canvasContainer.get(0) || null
            } else {
                return this._canvasContainer
            }
        }
        private get canvas(): HTMLCanvasElement | null {
            if (this._canvas === null) {
                return this.$canvas.get(0) || null
            } else {
                return this._canvas
            }
        }
        private get ctx() {
            if (this._ctx === null) {
                const canvas = this.canvas
                if (canvas !== null) {
                    const ctx = canvas.getContext("2d")
                    if (ctx !== null) {
                        ctx.imageSmoothingEnabled = false
                        ctx.imageSmoothingQuality = "high"
                    }
                    return ctx
                } else {
                    return null
                }
            } else {
                return this._ctx
            }
        }
    }
}
