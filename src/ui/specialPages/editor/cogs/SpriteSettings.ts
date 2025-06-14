import Message from "@/utils/message"
import SettingsValue from "@/data/settings"
import ComboBoxActionLayout from "@/ui/components/ComboBoxActionLayout"
import TextInputLayout from "@/ui/components/TextInputLayout"
import NumberInputLayout from "@/ui/components/NumberInputLayout"
import CheckboxInputLayout from "@/ui/components/CheckboxInputLayout"
import { deepClone } from "@/utils/io"
import { checkSpriteData } from "@/utils/spriteData"
import EditSpritePage from "../SpriteEditorContent"

interface SpriteSettingsConfig {
    parentClass: EditSpritePage
    setParentSpriteData: (value: Record<string, any>) => void
}

export default class SpriteSettings extends OO.ui.PanelLayout {
    stack: OO.ui.StackLayout
    private select: OO.ui.RadioSelectInputWidget
    private input: ComboBoxActionLayout
    private parentClass: EditSpritePage
    private setParentSpriteData: (value: Record<string, any>) => void

    private _data: Record<string, any>
    private allFields: Record<
        string,
        { index: number; element: TextInputLayout | NumberInputLayout | CheckboxInputLayout }
    > = {}

    private static readonly settingsName = [
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

    constructor(spriteData: Record<string, any>, config: SpriteSettingsConfig) {
        // stack
        const stack = new OO.ui.StackLayout({
            classes: ["mjw-sprite-editor--component-sprite-settings--stack"],
            expanded: false,
            framed: false,
            padded: false,
            continuous: true,
        })

        // radiobox
        const select = new OO.ui.RadioSelectInputWidget({
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
        const input = new ComboBoxActionLayout({
            buttonLabel: Message.get("editor-settings-add"),
            classes: ["mjw-sprite-editor--component-sprite-settings--input"],
        })

        // constructor
        super({
            expanded: false,
            padded: false,
            framed: false,
            content: [stack, input, select],
            classes: ["mjw-sprite-editor--component-sprite-settings"],
        })

        // arguments
        this.stack = stack
        this.input = input
        this.select = select
        this.parentClass = config.parentClass
        this.setParentSpriteData = config.setParentSpriteData

        // input events
        const $this = this
        this.input.button.on("click", () => {
            let value = $this.input.field.getValue().trim()
            if (value && !(value in $this.allFields)) {
                $this.newSettingsValue(value)
            }
            $this.input.field.setValue("")
        })

        // data
        this._data = spriteData
        this.initFields(spriteData)
    }

    // getter
    get spriteData() {
        return this.getSpriteData()
    }
    set spriteData(value: Record<string, any>) {
        this.setSpriteData(value)
    }
    public setSpriteData(value: Record<string, any>) {
        value = checkSpriteData(value)
        this.resetFields(value)
        this._data = value
    }
    public getSpriteData() {
        return this._data
    }

    // value
    private setFieldValue(key: string, value: any) {
        if (key in this.allFields) {
            let item = this.allFields[key]
            if (typeof value === "string" && item.element instanceof TextInputLayout) {
                item.element.value = value
            } else if (typeof value === "number" && item.element instanceof NumberInputLayout) {
                item.element.value = value
            } else if (typeof value === "boolean" && item.element instanceof CheckboxInputLayout) {
                item.element.value = value
            }
        }
    }

    private getFieldValue(key: string): string | number | boolean | undefined {
        if (key in this.allFields) {
            let item = this.allFields[key]
            if (item.element instanceof TextInputLayout) {
                return item.element.value
            } else if (item.element instanceof NumberInputLayout) {
                return item.element.value
            } else if (item.element instanceof CheckboxInputLayout) {
                return item.element.value
            }
        }
    }

    private newSettingsValue(key: string) {
        if (key.length > 0) {
            let data = checkSpriteData(this.getSpriteData())
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
            this.updateSpriteData(data)
        }
    }

    private updateSpriteData(data: Record<string, any>) {
        this.setParentSpriteData.call(this.parentClass, data)
    }

    // fields
    private pushField(key: string, value: any, index?: number) {
        if (typeof value === "string") {
            var t = this.getTextField(key, value)
            this.stack.addItems([t], index)
            this.allFields[key] = {
                index: Object.keys(this.allFields).length,
                element: t,
            }
        } else if (typeof value === "number") {
            var n = this.getNumberField(key, value)
            this.stack.addItems([n], index)
            this.allFields[key] = {
                index: Object.keys(this.allFields).length,
                element: n,
            }
        } else if (typeof value === "boolean") {
            var c = this.getCheckbox(key, value)
            this.stack.addItems([c], index)
            this.allFields[key] = {
                index: Object.keys(this.allFields).length,
                element: c,
            }
        }
    }

    private initFields(value: Record<string, any>) {
        const data = checkSpriteData(value)
        for (const key in data.settings) {
            this.pushField(key, data.settings[key])
        }
        this.input.field.setOptions(this.getSelectOptions())
    }

    private resetFields(value: Record<string, any>) {
        const data = checkSpriteData(value)

        // 既存のフィールドの値を変更 or 新規フィールドを生成
        let ignore: Array<string> = []
        for (const key in data.settings) {
            if (key in this.allFields) {
                this.setFieldValue(key, data.settings[key])
            } else {
                this.pushField(key, data.settings[key])
            }
            ignore.push(key)
        }

        // 不要なフィールドを削除
        let keys = Object.keys(this.allFields).filter((s) => !ignore.includes(s))
        for (const k of keys) {
            let allitem = this.stack.findItemsFromData(k)
            allitem.map((item) => {
                item.$element.remove()
            })
            delete this.allFields[k]
        }

        // オプションリストを更新
        this.input.field.setOptions(this.getSelectOptions())
    }

    // dom
    private getTextField(key: string, value?: any) {
        const $this = this
        if (typeof value !== "string" && SettingsValue[value]) value = SettingsValue[value].default
        if (typeof value !== "string") value = ""

        let field = new TextInputLayout({
            label: this.getFieldLabel(key),
            help: this.getFieldDescription(key),
            value: value,
            key: key,
            sublabel: key,
        })
        field.input.$input.on("change", (e) => {
            let value = field.input.getValue()
            let d = checkSpriteData($this.getSpriteData())
            d.settings[key] = value
            this.updateSpriteData(d)
        })

        return field
    }
    private getNumberField(key: string, value?: any) {
        const $this = this
        if (typeof value !== "number" && SettingsValue[value]) value = SettingsValue[value].default
        if (typeof value !== "number") value = 0

        let field = new NumberInputLayout({
            label: $this.getFieldLabel(key),
            help: $this.getFieldDescription(key),
            value: value,
            key: key,
            sublabel: key,
            min: 0,
        })

        field.input.$input.on("change", (e) => {
            let str = field.input.getValue()
            let v = Number(str)
            let d = checkSpriteData(this.getSpriteData())

            if ((key === "sheet-height" || key === "sheet-width" || key === "sheetsize") && str.length === 0) {
                field.input.$input.attr("placeholder", Message.get("editor-settings-field-placeholder-autovalue"))
                d.settings[key] = ""
                this.updateSpriteData(d)
                return
            } else {
                field.input.$input.removeAttr("placeholder")
            }

            if (isFinite(v)) {
                d.settings[key] = v
            } else {
                if (SettingsValue[key] && typeof SettingsValue[key].default === "number")
                    d.settings[key] = SettingsValue[key]
                else d.settings[key] = 0
            }
            this.updateSpriteData(d)
        })

        return field
    }
    private getCheckbox(key: string, value?: any) {
        const $this = this
        if (typeof value !== "boolean" && SettingsValue[value]) value = SettingsValue[value].default
        if (typeof value !== "boolean") value = false

        let field = new CheckboxInputLayout({
            label: this.getFieldLabel(key),
            help: this.getFieldDescription(key),
            value: value,
            key: key,
            sublabel: key,
        })

        field.input.on("change", (value) => {
            if (typeof value === "boolean") {
                let d = checkSpriteData(this.getSpriteData())
                d.settings[key] = value
                this.updateSpriteData(d)
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
        return SpriteSettings.settingsName
            .filter((s) => !(s in $this.allFields))
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
