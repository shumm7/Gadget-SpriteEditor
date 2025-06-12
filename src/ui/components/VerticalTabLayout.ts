import VerticalTabLayoutItem from "./VerticalTabLayoutItem"

interface VerticalTabLayoutConfig {
    framed?: boolean
    menuPosition?: OO.ui.MenuLayout.Position
    items?:
        | (OO.ui.PageLayout | VerticalTabLayoutItem)
        | (OO.ui.PageLayout | VerticalTabLayoutItem)[]
    id?: string
    classes?: string[]
}

class VerticalTabLayout extends OO.ui.PanelLayout {
    private booklet: OO.ui.BookletLayout

    constructor(config?: VerticalTabLayoutConfig) {
        if (!config) config = {}
        if (config.classes === undefined) config.classes = []
        if (config.menuPosition === undefined) config.menuPosition = "before"

        // booklet layout
        const booklet = new OO.ui.BookletLayout({
            expanded: false,
            outlined: true,
            autoFocus: false,
            menuPosition: config.menuPosition,
            classes: ["mjw-sprite-editor--component-vertical-tab-layout--booklet"],
        })

        // constructor
        super({
            expanded: false,
            framed: config.framed,
            padded: false,
            content: [booklet],
            id: config.id,
            classes: ["mjw-sprite-editor--component-vertical-tab-layout"].concat(config.classes),
        })

        // arguments
        this.booklet = booklet
        if (config.items !== undefined) this.addPages(config.items, 0)
        this.booklet.selectFirstSelectablePage()
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
    addPages(pages: OO.ui.PageLayout | OO.ui.PageLayout[], index: number) {
        if (Array.isArray(pages)) {
            this.booklet.addPages(pages, index)
        } else {
            this.booklet.addPages([pages], index)
        }
    }
    clearPages() {
        this.booklet.clearPages()
    }
    removePages(pages: OO.ui.PageLayout | OO.ui.PageLayout[]) {
        if (Array.isArray(pages)) {
            this.booklet.removePages(pages)
        } else {
            this.booklet.removePages([pages])
        }
    }

    // Getter / Setter Parameters
    set id(value: string) {
        this.setElementId(value)
    }
    get id() {
        return this.getElementId()
    }
}

export default VerticalTabLayout
