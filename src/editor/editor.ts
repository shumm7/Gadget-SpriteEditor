import { loadJson, loadLua } from "@/utils/io"
import { CONSTANT, Message } from "@/utils/message"
import { getTitle, setSearchParams } from "@/utils/page"
import { HOOKS } from "@/utils/hooks"
import { VerticalTab } from "@/ui/components/VerticalTabLayout"
import { SpriteCanvas } from "@/ui/editor/SpriteCanvas"
import { LabelField } from "@/ui/components/LabelField"
import { SpriteSettings } from "@/ui/editor/SpriteSettings"

export class SpriteEditor {
    private title: string = ""
    private exists: boolean | undefined
    private _data: Record<string, any> = {}
    private image: HTMLImageElement

    private $body: JQuery<HTMLElement>
    private panel: VerticalTab.Layout
    private pages: Record<string, VerticalTab.LayoutItem> = {}

    // ids
    private canvas: SpriteCanvas.Layout

    // settings
    private settings: SpriteSettings.Layout

    constructor(body: JQuery<HTMLElement>, title: string, exists: boolean | undefined) {
        if (!(title.length > 0 && body)) setSearchParams("data")
        this.$body = body
        this.exists = exists
        this.title = title
        this.image = new Image()

        // window event
        window.addEventListener("beforeunload", (e) => {
            e.preventDefault()
        })

        // initialize dom
        body.empty()
        const container = $(`<div class="mjw-sprite-editor--container" id="mjw-sprite-editor"/>`)

        // ids
        this.canvas = new SpriteCanvas.Layout(this.image, this.data, {})

        // settings
        this.settings = new SpriteSettings.Layout(this.data)

        // pages
        this.pages.ids = this.pageIds()
        this.pages.sections = this.pageSections()
        this.pages.settings = this.pageSettings()
        this.pages.export = this.pageExport()

        this.panel = new VerticalTab.Layout({
            items: [this.pages.ids, this.pages.sections, this.pages.settings, this.pages.export],
        })
        container.append(this.panel.$element)
        body.append(container)

        // load content
        this.loadData(title)
    }

    private loadData(title: string) {
        const t = getTitle(this.title)
        const $this = this
        if (t.getNamespaceId() === 8 && t.getExtension() === "json") {
            loadJson(
                CONSTANT.path +
                    "title=" +
                    encodeURIComponent(title) +
                    "&" +
                    "action=raw&" +
                    "ctype=" +
                    encodeURIComponent("application/json")
            )
                .then(function (data) {
                    if (typeof data === "object" && data !== null) {
                        $this.data = data
                        mw.hook(HOOKS.loadedJSONData).fire(data, true)
                    }
                })
                .catch((e) => {
                    console.warn(e)
                    mw.hook(HOOKS.loadedData).fire({}, false)
                })
        } else if (t.getNamespaceId() === 828) {
            loadLua(CONSTANT.path + "title=" + encodeURIComponent(title) + "&" + "action=raw")
                .then(function (data) {
                    if (typeof data === "object" && data !== null) {
                        $this.data = data
                        mw.hook(HOOKS.loadedJSONData).fire(data, true)
                    }
                })
                .catch((e) => {
                    console.warn(e)
                    mw.hook(HOOKS.loadedData).fire({}, false)
                })
        }
    }

    private pageIds() {
        let containerIds = new VerticalTab.LayoutItem("ids", {
            label: Message.get("editor-ids-title"),
        })
        containerIds.addItems([this.canvas.layout])
        return containerIds
    }
    private pageSections() {
        return new VerticalTab.LayoutItem("sections", {
            label: Message.get("editor-sections-title"),
        })
    }
    private pageSettings() {
        let containerSettings = new VerticalTab.LayoutItem("settings", {
            label: Message.get("editor-settings-title"),
        })
        containerSettings.addItems([this.settings.panel])
        return containerSettings
    }
    private pageExport() {
        return new VerticalTab.LayoutItem("export", {
            label: Message.get("editor-export-title"),
        })
    }

    // getter / setter
    get data() {
        return this._data
    }
    set data(value: Record<string, any>) {
        this._data = value
        this.canvas.data = value
        this.settings.data = value
    }
}
