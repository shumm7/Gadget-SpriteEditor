export namespace Collapsible {
    export interface LayoutConfig {
        label?: OO.ui.HtmlSnippet | JQuery<HTMLElement> | OO.ui.Deferrable<string>
        help?: string | OO.ui.HtmlSnippet
        expand?: boolean

        id?: string
        classes?: string[]
    }

    export class Layout {
        private panel: OO.ui.FieldLayout
        private content: OO.ui.Widget
        private label: OO.ui.LabelWidget
        private $content: JQuery<Element>
        private $iconExpand: JQuery<Element>
        private $iconCollapse: JQuery<Element>
        private expandedState: boolean = false

        constructor(content: OO.ui.Widget, config?: LayoutConfig) {
            if (!config) config = {}
            if (config.classes === undefined) config.classes = []

            const $this = this
            this.expandedState = config.expand ? true : false

            // content
            this.content = content
            this.$content = this.content.$element
            if (!this.expandedState) this.$content.hide()

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
                $this.toggle()
            })
            this.label.$element.on("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    $this.toggle()
                }
            })

            // panel
            const initialClass = this.expandedState
                ? ["mjw-sprite-editor--component-collapsible--expanded"]
                : ["mjw-sprite-editor--component-collapsible--collapsed"]
            this.panel = new OO.ui.FieldLayout(this.content, {
                align: "top",
                help: config.help,
                id: config.id,
                classes: ["mjw-sprite-editor--component-collapsible"]
                    .concat(initialClass)
                    .concat(config.classes),
            })
            this.panel.$label.append(this.label.$element)
        }

        // Getter / Setter Parameters
        get data() {
            return this.panel.getData()
        }
        set data(value: any) {
            this.panel.setData(value)
        }

        get $element() {
            return this.panel.$element
        }
        set $element(value: JQuery<HTMLElement>) {
            this.panel.$element = value
        }

        toggle() {
            this.expand = !this.expandedState
        }

        set expand(state: boolean) {
            this.expandedState = state
            this.label.$element.attr({ "aria-expanded": state, "aria-pressed": state })
            this.$content.attr({ "aria-hidden": !state })
            this.$content.prop({ "hidden": !state })

            if (state) {
                this.panel.$element.removeClass(
                    "mjw-sprite-editor--component-collapsible--collapsed"
                )
                this.panel.$element.addClass("mjw-sprite-editor--component-collapsible--expanded")

                this.$iconCollapse.show()
                this.$iconExpand.hide()
                this.$content.show()
            } else {
                this.panel.$element.removeClass(
                    "mjw-sprite-editor--component-collapsible--expanded"
                )
                this.panel.$element.addClass("mjw-sprite-editor--component-collapsible--collapsed")

                this.$iconExpand.show()
                this.$iconCollapse.hide()
                this.$content.hide()
            }
        }

        get expand() {
            return this.expandedState
        }
    }
}
