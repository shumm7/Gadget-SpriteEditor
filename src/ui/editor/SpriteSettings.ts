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
        panel: OO.ui.Layout
        stack: OO.ui.StackLayout
        private select: OO.ui.RadioSelectInputWidget
        private input: ComboBoxAction.Layout

        private _data: Record<string, any>
        private items: Record<
            string,
            { index: number; element: LabelField.Text | LabelField.Numeric | LabelField.Checkbox }
        > = {}

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
                if (value && !(value in $this.items)) {
                    this.newSettingsValue(value)
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

        // value
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

        private newSettingsValue(key: string) {
            if (key.length > 0) {
                let data = this.checkSpriteData()
                let defValue = SettingsValue[key] || {}
                let type = defValue.type || this.select.getValue()

                if (type === "string") {
                    data.settings[key] = defValue.default || ""
                } else if (type === "number") {
                    data.settings[key] = defValue.default || 0
                } else if (type === "boolean") {
                    data.settings[key] = defValue.default || false
                } else {
                    return
                }
                this.data = data
            }
        }

        // fields
        private pushField(key: string, value: any, index?: number) {
            if (typeof value === "string") {
                var t = this.getTextField(key, value)
                this.stack.addItems([t.layout], index)
                this.items[key] = {
                    index: Object.keys(this.items).length,
                    element: t,
                }
            } else if (typeof value === "number") {
                var n = this.getNumberField(key, value)
                this.stack.addItems([n.layout], index)
                this.items[key] = {
                    index: Object.keys(this.items).length,
                    element: n,
                }
            } else if (typeof value === "boolean") {
                var c = this.getCheckbox(key, value)
                this.stack.addItems([c.layout], index)
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
            this.input.field.setOptions(this.getSelectOptions())
        }

        private resetFields(value?: Record<string, any>) {
            const data = this.checkSpriteData(value)

            // 既存のフィールドの値を変更 or 新規フィールドを生成
            let ignore: Array<string> = []
            for (const key in data.settings) {
                if (key in this.items) {
                    this.setFieldValue(key, data.settings[key])
                } else {
                    this.pushField(key, data.settings[key])
                }
                ignore.push(key)
            }

            // 不要なフィールドを削除
            let keys = Object.keys(this.items).filter((s) => !ignore.includes(s))
            for (const k of keys) {
                let allitem = this.stack.findItemsFromData(k)
                allitem.map((item) => {
                    item.$element.remove()
                })
                delete this.items[k]
            }

            // オプションリストを更新
            this.input.field.setOptions(this.getSelectOptions())
        }

        // sprite data
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

        // dom
        private getTextField(key: string, value?: any) {
            const $this = this
            if (typeof value !== "string" && SettingsValue[value])
                value = SettingsValue[value].default
            if (typeof value !== "string") value = ""

            let field = new LabelField.Text({
                label: this.getFieldLabel(key),
                help: this.getFieldDescription(key),
                value: value,
                key: key,
                sublabel: key,
            })
            field.field.on("change", (value) => {
                let d = $this.checkSpriteData()
                d.settings[key] = value
                this.data = d
            })

            return field
        }
        private getNumberField(key: string, value?: any) {
            const $this = this
            if (typeof value !== "number" && SettingsValue[value])
                value = SettingsValue[value].default
            if (typeof value !== "number") value = 0

            let field = new LabelField.Numeric({
                label: this.getFieldLabel(key),
                help: this.getFieldDescription(key),
                value: value,
                key: key,
                sublabel: key,
                min: 0,
            })

            field.field.$input.on("change", (e) => {
                let v = Number(field.field.getValue())
                let d = $this.checkSpriteData()
                if (isFinite(v)) {
                    d.settings[key] = v
                    this.data = d
                } else {
                    if (SettingsValue[key] && typeof SettingsValue[key].default === "number")
                        d.settings[key] = SettingsValue[key]
                    else d.settings[key] = 0
                    this.data = d
                }
            })

            return field
        }
        private getCheckbox(key: string, value?: any) {
            const $this = this
            if (typeof value !== "boolean" && SettingsValue[value])
                value = SettingsValue[value].default
            if (typeof value !== "boolean") value = false

            let field = new LabelField.Checkbox({
                label: this.getFieldLabel(key),
                help: this.getFieldDescription(key),
                value: value,
                key: key,
                sublabel: key,
            })

            field.field.on("change", (value) => {
                if (typeof value === "boolean") {
                    let d = $this.checkSpriteData()
                    d.settings[key] = value
                    this.data = d
                }
            })

            return field
        }

        private getFieldLabel(key: string) {
            const obj = Message.getObj(`settings-${key}`)
            if (obj.exists()) {
                return obj.text()
            } else {
                return Message.getObj("settings-unknown-value", key).parseDom()
            }
        }
        private getFieldDescription(key: string) {
            const obj = Message.getObj(`settings-${key}-description`)
            if (obj.exists()) {
                return new OO.ui.HtmlSnippet(obj.parse())
            } else {
                return undefined
            }
        }

        private getSelectOptions() {
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
