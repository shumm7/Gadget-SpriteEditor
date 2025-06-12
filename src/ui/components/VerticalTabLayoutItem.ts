interface VerticalTabLayoutItemConfig {
    label?: OO.ui.HtmlSnippet | JQuery<HTMLElement> | OO.ui.Deferrable<string>
    help?: string | OO.ui.HtmlSnippet
    inlineHelp?: boolean

    items?: OO.ui.FieldLayout<OO.ui.Widget>[]

    id?: string
    classes?: string[]
}

class VerticalTabLayoutItem extends OO.ui.PageLayout {
    private fieldset: OO.ui.FieldsetLayout

    constructor(name: string, config?: VerticalTabLayoutItemConfig) {
        if (!config) config = {}
        if (config.classes === undefined) config.classes = []

        // fieldset
        const fieldset = new OO.ui.FieldsetLayout({
            label: config.label,
            help: config.help,
            helpInline: config.inlineHelp,
            classes: ["mjw-sprite-editor--component-vertical-tab-item--fieldset"],
            items: config.items,
        })

        // constructor
        super(name, {
            content: [fieldset],
            data: name,
            expanded: false,
            id: config.id,
            classes: ["mjw-sprite-editor--component-vertical-tab-item"].concat(config.classes),
        })
        this.setOutlineItem(new OO.ui.OutlineOptionWidget({ label: config.label || name }))

        // arguments
        this.fieldset = fieldset
    }

    addItems(items: OO.ui.Element | OO.ui.Element[], index?: number) {
        if (!Array.isArray(items)) items = [items]
        this.fieldset.addItems(items, index)
    }

    removeItems(items: OO.ui.Element[]) {
        this.fieldset.removeItems(items)
    }

    // Getter / Setter Parameters
    set id(value: string) {
        this.setElementId(value)
    }
    get id() {
        return this.getElementId()
    }

    get name() {
        return this.getName()
    }
}

export default VerticalTabLayoutItem
