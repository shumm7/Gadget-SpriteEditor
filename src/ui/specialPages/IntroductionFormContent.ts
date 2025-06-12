import Message from "../../utils/message"
import { setSearchParams } from "@/utils/page"
import IntroductionFormLayout from "@/ui/specialPages/introduction/IntroductionFormLayout"

export default class SpriteIntroduction extends OO.ui.PanelLayout {
    private title: string
    private $body: JQuery<HTMLElement>
    private selector: IntroductionFormLayout
    private label: OO.ui.LabelWidget

    constructor(
        body: JQuery<HTMLElement>,
        title: string | null,
        error?: string | OO.ui.HtmlSnippet
    ) {
        title = title || ""

        // description
        const label = new OO.ui.LabelWidget({
            label: Message.get("description"),
            classes: ["mjw-sprite-editor--description"],
        })

        // form
        const selector = new IntroductionFormLayout({
            label: Message.get("selector-label"),
            value: title,
            buttonLabel: Message.getRaw("edit"),
            description: Message.get("selector-instructions"),
            error: error,
        })

        // constructor
        super({
            padded: false,
            expanded: false,
            framed: false,
            id: "mjw-sprite-editor",
            classes: ["mjw-sprite-editor", "mjw-sprite-editor--container"],
            content: [label, selector],
        })

        // arguments
        this.$body = body
        this.title = title
        this.label = label
        this.selector = selector

        // form event
        const $this = this
        this.selector.form.on("submit", () => {
            const inputValue = $this.value
            $this.title = inputValue
            setSearchParams("data", $this.title)
        })

        // initialize
        this.$body.empty()
        this.$body.append(this.$element)
    }

    get value() {
        if (this.selector) {
            return this.selector.value
        }
        return ""
    }
}
