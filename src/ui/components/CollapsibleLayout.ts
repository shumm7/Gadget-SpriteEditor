interface CollapsibleLayoutConfig {
    label?: OO.ui.HtmlSnippet | JQuery<HTMLElement> | OO.ui.Deferrable<string>
    help?: string | OO.ui.HtmlSnippet
    expand?: boolean

    id?: string
    classes?: string[]
}

export class CollapsibleLayout extends OO.ui.FieldLayout<OO.ui.Widget> {
    content: OO.ui.Widget
    label: OO.ui.LabelWidget
    private $content: JQuery<Element>
    private $iconExpand: JQuery<Element>
    private $iconCollapse: JQuery<Element>
    private expandedState: boolean = false

    constructor(content: OO.ui.Widget, config?: CollapsibleLayoutConfig) {
        if (!config) config = {}
        if (config.classes === undefined) config.classes = []

        const expandedState = config.expand ? true : false

        // constructor
        super(content, {
            align: "top",
            help: config.help,
            id: config.id,
            classes: ["mjw-sprite-editor--component-collapsible"]
                .concat(
                    expandedState
                        ? ["mjw-sprite-editor--component-collapsible--expanded"]
                        : ["mjw-sprite-editor--component-collapsible--collapsed"]
                )
                .concat(config.classes),
        })

        const $this = this
        this.content = content
        this.$content = content.$element
        this.expandedState = expandedState

        // content
        if (!this.expandedState) this.content.$element.hide()

        // icon
        this.$iconExpand = new OO.ui.IconWidget({
            icon: "expand",
            classes: [
                "mjw-sprite-editor--component-collapsible--icon",
                "mjw-sprite-editor--component-collapsible--icon-expand",
            ],
        }).$element
        this.$iconCollapse = new OO.ui.IconWidget({
            icon: "collapse",
            classes: [
                "mjw-sprite-editor--component-collapsible--icon",
                "mjw-sprite-editor--component-collapsible--icon-collapse",
            ],
        }).$element
        this.expandedState ? this.$iconExpand.hide() : this.$iconCollapse.hide()

        // label
        this.label = new OO.ui.LabelWidget({
            label: config.label,
            classes: ["mjw-sprite-editor--component-collapsible--label"],
        })
        this.label.$element.attr({
            tabindex: 0,
            role: "button",
            "aria-controls": this.content.getElementId(),
            "aria-expanded": this.expandedState,
            "aria-pressed": this.expandedState,
        })
        this.label.$label.prepend(this.$iconExpand)
        this.label.$label.prepend(this.$iconCollapse)
        this.label.$element.on("click", function () {
            $this.expand = !$this.expand
        })
        this.label.$element.on("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                $this.expand = !$this.expand
            }
        })

        // panel
        this.$label.append(this.label.$element)
    }

    // Getter / Setter Parameters
    get data() {
        return this.getData()
    }
    set data(value: any) {
        this.setData(value)
    }

    set expand(state: boolean) {
        this.expandedState = state
        this.label.$element.attr({ "aria-expanded": state, "aria-pressed": state })
        this.$content.attr({ "aria-hidden": !state })
        this.$content.prop({ "hidden": !state })

        if (state) {
            this.$element.removeClass("mjw-sprite-editor--component-collapsible--collapsed")
            this.$element.addClass("mjw-sprite-editor--component-collapsible--expanded")

            this.$iconCollapse.show()
            this.$iconExpand.hide()
            this.$content.show()
        } else {
            this.$element.removeClass("mjw-sprite-editor--component-collapsible--expanded")
            this.$element.addClass("mjw-sprite-editor--component-collapsible--collapsed")

            this.$iconExpand.show()
            this.$iconCollapse.hide()
            this.$content.hide()
        }
    }

    get expand() {
        return this.expandedState
    }
}
