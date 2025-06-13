import { deepClone, getImageinfo, loadJson, loadLua } from "@/utils/io"
import Message, { Constant } from "@/utils/message"
import { getPageTitle, setSearchParams } from "@/utils/page"
import Hooks from "@/utils/hooks"
import VerticalTabLayout from "@/ui/components/VerticalTabLayout"
import VerticalTabLayoutItem from "@/ui/components/VerticalTabLayoutItem"
import SpriteCanvas from "@/ui/specialPages/editor/SpriteCanvas"
import SpriteSettings from "@/ui/specialPages/editor/SpriteSettings"
import { vector } from "@/utils/math"
import { checkSpriteData } from "@/utils/spriteData"

export default class EditSpritePage extends VerticalTabLayout {
    private $body: JQuery<HTMLElement>
    private pageTitle: string = ""
    private exists: boolean | undefined

    // sprite data
    private _data: Record<string, any>
    private _image: HTMLImageElement

    // pages
    private editorContents: Record<string, VerticalTabLayoutItem> = {}
    private editorComponentIds: SpriteCanvas
    private editorComponentSettings: SpriteSettings

    constructor(body: JQuery<HTMLElement>, title: string, exists: boolean | undefined) {
        if (!(title.length && body.length)) setSearchParams("data")

        // constructor
        super({
            id: "mjw-sprite-editor",
            classes: ["mjw-sprite-editor", "mjw-sprite-editor--container"],
        })

        // arguments
        this.$body = body
        this.exists = exists
        this.pageTitle = title
        this._image = new Image()
        this._image.crossOrigin = "Anonymous"
        this._data = checkSpriteData({})

        // page components
        const $this = this
        this.editorComponentIds = new SpriteCanvas(deepClone(this._image), deepClone(this._data), {
            parentClass: $this,
            setParentSpriteData: $this.setSpriteData,
            setParentSpriteImage: $this.setSpriteImage,
        })
        this.editorComponentSettings = new SpriteSettings(deepClone(this._data), {
            parentClass: $this,
            setParentSpriteData: $this.setSpriteData,
        })

        // pages
        this.editorContents = {
            ids: this.pageIds(),
            sections: this.pageSections(),
            settings: this.pageSettings(),
            export: this.pageExport(),
        }
        this.addPages(
            [
                this.editorContents.ids,
                this.editorContents.sections,
                this.editorContents.settings,
                this.editorContents.export,
            ],
            0
        )

        // initialize
        this.$body.empty()
        this.$body.append(this.$element)
        window.addEventListener("beforeunload", (e) => {
            e.preventDefault()
        })

        // load content
        this.loadSpriteData(this.pageTitle)
            .then((spriteData) => {
                this.setSpriteData(spriteData)
                return spriteData
            })
            .then((spriteData) => {
                if ("settings" in spriteData) {
                    const image = spriteData.settings["image"]
                    if (typeof image === "string") {
                        const $this = this
                        this.loadSpriteImage(image).then((e) => {
                            console.log("An image has loaded successfully", e)
                            $this.setSpriteImage($this._image)
                        })
                    }
                }
            })
    }

    // load data
    private loadSpriteData(title: string): Promise<Record<string, any>> {
        const t = getPageTitle(this.pageTitle)
        if (t.getNamespaceId() === 8 && t.getExtension() === "json") {
            const path = `${Constant.path}title=${encodeURIComponent(
                title
            )}&action=raw&ctype=${encodeURIComponent("application/json")}`

            return loadJson(path)
                .then(function (data) {
                    if (typeof data === "object" && data !== null) {
                        var d = checkSpriteData(data)
                        mw.hook(Hooks.loadedJSONData).fire(d, true)
                        return d
                    }
                    throw new Error("Cannot load sprite data.")
                })
                .catch((e) => {
                    console.warn(e)
                    var data = checkSpriteData({})
                    mw.hook(Hooks.loadedData).fire(data, false)
                    return data
                })
        } else if (t.getNamespaceId() === 828) {
            const path = `${Constant.path}title=${encodeURIComponent(title)}&action=raw`
            return loadLua(path)
                .then(function (data) {
                    if (typeof data === "object" && data !== null) {
                        var d = checkSpriteData(data)
                        mw.hook(Hooks.loadedJSONData).fire(d, true)
                        return d
                    }
                    throw new Error("Cannot load sprite data.")
                })
                .catch((e) => {
                    console.warn(e)
                    var data = checkSpriteData({})
                    mw.hook(Hooks.loadedData).fire(data, false)
                    return data
                })
        } else {
            return new Promise<Record<string, any>>(() => {
                throw new Error("Invalid sprite file.")
            }).catch((e) => {
                console.warn(e)
                var data = checkSpriteData({})
                mw.hook(Hooks.loadedData).fire(data, false)
                return data
            })
        }
    }

    private loadSpriteImage(text: string): Promise<Record<string, any> | string> {
        if (URL.canParse(text)) {
            this._image.src = text
            return this._image.decode().then((e) => {
                mw.hook(Hooks.changedImage).fire(text)
                return text
            })
        } else {
            const $this = this
            return new Promise(
                (resolve) =>
                    getImageinfo(text).then((imageinfo) => {
                        text = imageinfo.url
                        $this._image.src = text
                        return $this._image.decode().then((e) => {
                            mw.hook(Hooks.changedImage).fire(text)
                            return imageinfo
                        })
                    })
                //todo
            )
        }
    }

    // page components
    private pageIds() {
        let containerIds = new VerticalTabLayoutItem("ids", {
            label: Message.get("editor-ids-title"),
            items: [],
        })
        containerIds.addItems([this.editorComponentIds])
        return containerIds
    }
    private pageSections() {
        return new VerticalTabLayoutItem("sections", {
            label: Message.get("editor-sections-title"),
        })
    }
    private pageSettings() {
        let containerSettings = new VerticalTabLayoutItem("settings", {
            label: Message.get("editor-settings-title"),
        })
        containerSettings.addItems([this.editorComponentSettings])
        return containerSettings
    }
    private pageExport() {
        return new VerticalTabLayoutItem("export", {
            label: Message.get("editor-export-title"),
        })
    }

    // getter / setter
    setSpriteData(value: Record<string, any>) {
        var data = checkSpriteData(value)
        console.log(data)
        this.editorComponentIds.setSpriteData(deepClone(data))
        this.editorComponentSettings.setSpriteData(deepClone(data))

        if (this._data.settings.image !== data.settings.image) {
            const $this = this
            this.loadSpriteImage(data.settings.image).then((e) => {
                console.log("An image has loaded successfully", e)
                $this.setSpriteImage($this._image)
            })
        }

        this._data = deepClone(data)
    }
    getSpriteData() {
        return this._data
    }
    setSpriteImage(value: HTMLImageElement) {
        console.log(value)
        this.editorComponentIds.setSpriteImage(deepClone(value))
        this._image = deepClone(value)
    }
    getSpriteImage() {
        return this._image
    }
}
