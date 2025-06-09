import { pageExsits } from "@/utils/io"
import { Message } from "../utils/message"
import { setSearchParams } from "@/utils/page"
import { SpriteSelector } from "@/ui/selector/SpriteSelector"

export class SpriteIntroduction {
    private title: string = ""
    private $body: JQuery<HTMLElement>
    private selector?: SpriteSelector.Layout

    constructor(
        body: JQuery<HTMLElement>,
        title: string | null,
        error?: string | OO.ui.HtmlSnippet
    ) {
        this.$body = body
        if (title) this.title = title

        // initialize
        this.$body.empty()
        const $this = this

        // description
        const text = $("<p>").text(Message.get("description"))
        this.$body.append(text)

        this.selector = new SpriteSelector.Layout({
            label: Message.get("selector-label"),
            value: this.title,
            buttonLabel: Message.getRaw("edit"),
            description: Message.get("selector-instructions"),
            error: error,
        })
        this.selector.on("submit", () => {
            const inputValue = $this.value
            $this.title = inputValue
            setSearchParams("data", $this.title)
        })

        // container
        const container = $(
            `<div class="mjw-sprite-editor--container" id="mjw-sprite-editor"/>`
        ).append(this.selector.$element)
        this.$body.append(container)
    }

    get value() {
        if (this.selector) {
            return this.selector.value
        }
        return ""
    }
}
