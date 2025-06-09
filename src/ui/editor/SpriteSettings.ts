import { Message } from "@/utils/message"
import { LabelField } from "../components/LabelField"
import { ComboBoxAction } from "../components/ComboBoxAction"
import { SettingsValue } from "@/data/settings"

export namespace SpriteSettings {
    const settings = [
        "name",
        "image",
        "scale",
        "pos",
        "size",
        "width",
        "height",
        "sheetsize",
        "sheet-height",
        "notip",
        "classname",
        "class",
    ]

    export interface LayoutConfig {}

    export class Layout {
        private _data: Record<string, any>
        panel: OO.ui.Layout
        stack: OO.ui.StackLayout
        private select: OO.ui.RadioSelectInputWidget
        private input: ComboBoxAction.Layout

        private items: Record<
            string,
            { index: number; element: LabelField.Text | LabelField.Numeric | LabelField.Checkbox }
        > = {}

        private readonly defaultValue: Record<string, string | number | boolean> = {}

        constructor(data: Record<string, any>, config?: LayoutConfig) {
            const $this = this
            if (!config) config = {}

            // stack
            this.stack = new OO.ui.StackLayout({
                classes: ["mjw-sprite-editor--component-sprite-settings--stack"],
                expanded: false,
                framed: false,
                padded: false,
                continuous: true,
            })

            // radiobox
            this.select = new OO.ui.RadioSelectInputWidget({
                classes: ["mjw-sprite-editor--component-sprite-settings--select"],
                options: [
                    {
                        data: "string",
                        label: Message.get("editor-settings-type-string"),
                    },
                    {
                        data: "number",
                        label: Message.get("editor-settings-type-number"),
                    },
                    {
                        data: "boolean",
                        label: Message.get("editor-settings-type-boolean"),
                    },
                ],
            })

            // input
            this.input = new ComboBoxAction.Layout({
                buttonLabel: Message.get("editor-settings-add"),
                classes: ["mjw-sprite-editor--component-sprite-settings--input"],
            })
            this.input.button.on("click", () => {
                let value = $this.input.field.getValue().trim()
                if (value && value.length > 0 && !(value in $this.items)) {
                    let data = $this.data
                    let defValue = SettingsValue[value] || {}
                    let type = defValue.type || this.select.getValue()

                    if (type === "string") {
                        data.settings[value] = defValue.default || ""
                        $this.data = data
                    } else if (type === "number") {
                        data.settings[value] = defValue.default || 0
                        $this.data = data
                    } else if (type === "boolean") {
                        data.settings[value] = defValue.default || false
                        $this.data = data
                    }
                }
                $this.input.field.setValue("")
            })

            // panel
            this.panel = new OO.ui.Layout({
                content: [this.stack, this.input.layout, this.select],
                classes: ["mjw-sprite-editor--component-sprite-settings"],
            })

            // data
            this._data = data
            this.initFields(data)
        }

        // getter / setter
        set data(value: Record<string, any>) {
            value = this.checkSpriteData(value)
            this.resetFields(value)
            this._data = value
        }
        get data() {
            return this._data
        }
        get $element() {
            return this.panel.$element
        }
        set $element(value: JQuery<HTMLElement>) {
            this.panel.$element = value
        }

        // methods
        private setFieldValue(key: string, value: any) {
            if (key in this.items) {
                let item = this.items[key]
                if (typeof value === "string" && item.element instanceof LabelField.Text) {
                    item.element.value = value
                } else if (
                    typeof value === "number" &&
                    item.element instanceof LabelField.Numeric
                ) {
                    item.element.value = value
                } else if (
                    typeof value === "boolean" &&
                    item.element instanceof LabelField.Checkbox
                ) {
                    item.element.value = value
                }
            }
        }

        private getFieldValue(key: string): string | number | boolean | undefined {
            if (key in this.items) {
                let item = this.items[key]
                if (item.element instanceof LabelField.Text) {
                    return item.element.value
                } else if (item.element instanceof LabelField.Numeric) {
                    return item.element.value
                } else if (item.element instanceof LabelField.Checkbox) {
                    return item.element.value
                }
            }
        }

        private pushField(key: string, value: any) {
            if (typeof value === "string") {
                var t = this.getTextField(key, value)
                this.stack.addItems([t.layout])
                this.items[key] = {
                    index: Object.keys(this.items).length,
                    element: t,
                }
            } else if (typeof value === "number") {
                var n = this.getNumberField(key, value)
                this.stack.addItems([n.layout])
                this.items[key] = {
                    index: Object.keys(this.items).length,
                    element: n,
                }
            } else if (typeof value === "boolean") {
                var c = this.getCheckbox(key, value)
                this.stack.addItems([c.layout])
                this.items[key] = {
                    index: Object.keys(this.items).length,
                    element: c,
                }
            }
        }

        private initFields(value?: Record<string, any>) {
            const data = this.checkSpriteData(value)
            for (const key in data.settings) {
                this.pushField(key, data.settings[key])
            }
            this.input.field.setOptions(this.getOptions())
        }

        private resetFields(value?: Record<string, any>) {
            const data = this.checkSpriteData(value)
            if (this.stack.getItemCount() > 0) {
                this.stack.clearItems()
                this.items = {}
            }
            for (const key in data.settings) {
                if (key in this.items) {
                    this.setFieldValue(key, data.settings[key])
                } else {
                    this.pushField(key, data.settings[key])
                }
            }
            this.input.field.setOptions(this.getOptions())
        }

        private checkSpriteData(value?: Record<string, any>): Record<string, any> {
            let data = value || this._data
            if (typeof data === "object" && data !== null) {
                if (!("sections" in data)) data.sections = {}
                if (!("settings" in data)) data.settings = {}
                if (!("ids" in data)) data.ids = {}
            } else {
                data = {
                    settings: {},
                    sections: {},
                    ids: {},
                }
            }
            return data
        }

        private getTextField(key: string, value?: any) {
            if (typeof value !== "string") value = this.defaultValue[key]
            if (typeof value !== "string") value = ""

            return new LabelField.Text({
                label: this.getLabel(key),
                help: this.getDescription(key),
                value: value,
                key: key,
                sublabel: key,
            })
        }
        private getNumberField(key: string, value?: any) {
            if (typeof value !== "number") value = this.defaultValue[key]
            if (typeof value !== "number") value = 0

            return new LabelField.Numeric({
                label: this.getLabel(key),
                help: this.getDescription(key),
                value: value,
                key: key,
                sublabel: key,
                min: 0,
            })
        }
        private getCheckbox(key: string, value?: any) {
            if (typeof value !== "boolean") value = this.defaultValue[key]
            if (typeof value !== "boolean") value = false

            return new LabelField.Checkbox({
                label: this.getLabel(key),
                help: this.getDescription(key),
                value: value,
                key: key,
                sublabel: key,
            })
        }

        private getLabel(key: string) {
            const obj = Message.getObj(`settings-${key}`)
            if (obj.exists()) {
                return obj.text()
            } else {
                return Message.getObj("settings-unknown-value", key).parseDom()
            }
        }
        private getDescription(key: string) {
            const obj = Message.getObj(`settings-${key}-description`)
            if (obj.exists()) {
                return new OO.ui.HtmlSnippet(obj.parse())
            } else {
                return undefined
            }
        }

        private getOptions() {
            const $this = this
            return settings
                .filter((s) => !(s in $this.items))
                .map((s) => {
                    const m = Message.getObj(`settings-${s}`)
                    if (m.exists()) {
                        return {
                            data: s,
                            label: Message.get("editor-settings-value-options", m.text(), s),
                        }
                    } else {
                        return {
                            data: s,
                            label: s,
                        }
                    }
                })
        }
    }
}
