import { ContentPageLayout } from "./ContentPageLayout"

export namespace VerticalTab {
    export interface LayoutConfig {
        framed?: boolean
        menuPosition?: OO.ui.MenuLayout.Position
        items?: (OO.ui.PageLayout | LayoutItem) | (OO.ui.PageLayout | LayoutItem)[]
        id?: string
        classes?: string[]
    }

    export class Layout {
        private panel: OO.ui.PanelLayout
        private booklet: OO.ui.BookletLayout

        constructor(config?: LayoutConfig) {
            if (!config) config = {}
            if (config.classes === undefined) config.classes = []
            if (config.menuPosition === undefined) config.menuPosition = "before"

            // booklet layout
            this.booklet = new OO.ui.BookletLayout({
                expanded: false,
                outlined: true,
                autoFocus: false,
                menuPosition: config.menuPosition,
                classes: ["mjw-sprite-editor--component-vertical-tab-layout--booklet"],
            })
            if (config.items !== undefined) this.addPages(config.items, 0)
            this.booklet.selectFirstSelectablePage()

            // panel
            this.panel = new OO.ui.PanelLayout({
                expanded: false,
                framed: config.framed,
                padded: false,
                content: [this.booklet],
                id: config.id,
                classes: ["mjw-sprite-editor--component-vertical-tab-layout"].concat(
                    config.classes
                ),
            })
        }

        getCurrentPage() {
            return this.booklet.getCurrentPageName()
        }
        setCurrentPage(value?: string) {
            if (value) {
                this.booklet.setPage(value)
            } else {
                this.booklet.selectFirstSelectablePage()
            }
        }

        getPage(name?: string) {
            if (name === undefined) {
                return this.booklet.getCurrentPage()
            } else {
                return this.booklet.getPage(name)
            }
        }
        addPages(
            pages: (OO.ui.PageLayout | LayoutItem) | (OO.ui.PageLayout | LayoutItem)[],
            index: number
        ) {
            if (Array.isArray(pages)) {
                this.booklet.addPages(
                    pages.map((p) => {
                        if (p instanceof LayoutItem) {
                            return p.pageLayout
                        }
                        return p
                    }),
                    index
                )
            } else {
                if (pages instanceof LayoutItem) {
                    this.booklet.addPages([pages.pageLayout], index)
                } else {
                    this.booklet.addPages([pages], index)
                }
            }
        }
        clearPages() {
            this.booklet.clearPages()
        }
        removePages(pages: (OO.ui.PageLayout | LayoutItem) | (OO.ui.PageLayout | LayoutItem)[]) {
            if (Array.isArray(pages)) {
                this.booklet.removePages(
                    pages.map((p) => {
                        if (p instanceof LayoutItem) {
                            return p.pageLayout
                        }
                        return p
                    })
                )
            } else {
                if (pages instanceof LayoutItem) {
                    this.booklet.removePages([pages.pageLayout])
                } else {
                    this.booklet.removePages([pages])
                }
            }
        }

        // Getter / Setter Parameters
        set id(value: string) {
            this.panel.setElementId(value)
        }
        get id() {
            return this.panel.getElementId()
        }

        get $element() {
            return this.panel.$element
        }
        set $element(value: JQuery<HTMLElement>) {
            this.panel.$element = value
        }
    }

    export interface LayoutItemConfig {
        label?: OO.ui.HtmlSnippet | JQuery<HTMLElement> | OO.ui.Deferrable<string>
        help?: string | OO.ui.HtmlSnippet
        inlineHelp?: boolean

        items?: OO.ui.FieldLayout<OO.ui.Widget>[]

        id?: string
        classes?: string[]
    }

    export class LayoutItem {
        private fieldset: OO.ui.FieldsetLayout
        pageLayout: any

        constructor(name: string, config?: LayoutItemConfig) {
            if (!config) config = {}
            if (config.classes === undefined) config.classes = []

            // fieldset
            this.fieldset = new OO.ui.FieldsetLayout({
                label: config.label,
                help: config.help,
                helpInline: config.inlineHelp,
                classes: ["mjw-sprite-editor--component-vertical-tab-item--fieldset"],
                items: config.items,
            })

            // page layout
            this.pageLayout = ContentPageLayout(
                name,
                {
                    content: [this.fieldset],
                    data: name,
                    expanded: false,
                    id: config.id,
                    classes: ["mjw-sprite-editor--component-vertical-tab-item"].concat(
                        config.classes
                    ),
                },
                config.label || name
            )
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
            this.pageLayout.setElementId(value)
        }
        get id() {
            return this.pageLayout.getElementId()
        }

        get name() {
            return this.pageLayout.getName()
        }

        get $element() {
            return this.pageLayout.$element
        }
        set $element(value: JQuery<HTMLElement>) {
            this.pageLayout.$element = value
        }
    }
}
