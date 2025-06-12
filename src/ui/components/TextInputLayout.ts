export interface InputLayoutConfigPrototype {
    label?: OO.ui.Deferrable<string> | JQuery<HTMLElement> | OO.ui.HtmlSnippet
    sublabel?: OO.ui.Deferrable<string> | JQuery<HTMLElement> | OO.ui.HtmlSnippet
    key?: string

    help?: string | OO.ui.HtmlSnippet
    helpInline?: boolean

    disabled?: boolean
    align?: "left" | "right" | "top" | "inline"

    id?: string
    classes?: string[]
}

export class InputLayoutPrototype extends OO.ui.FieldLayout<OO.ui.Widget> {
    constructor(widget: OO.ui.Widget, config?: OO.ui.FieldLayout.ConfigOptions) {
        super(widget, config)
    }

    // getter / setter
    get id() {
        return this.getElementId()
    }
    set id(value: string) {
        this.setElementId(value)
    }

    // methods
    setError(msg?: null | string | OO.ui.HtmlSnippet | Array<string | OO.ui.HtmlSnippet>) {
        this.setErrors(this.ConvertToArrayString(msg))
    }
    setWarning(msg?: null | string | OO.ui.HtmlSnippet | Array<string | OO.ui.HtmlSnippet>) {
        this.setWarnings(this.ConvertToArrayString(msg))
    }
    setNotice(msg?: null | string | OO.ui.HtmlSnippet | Array<string | OO.ui.HtmlSnippet>) {
        this.setNotices(this.ConvertToArrayString(msg))
    }

    private ConvertToArrayString(
        msg?: null | string | OO.ui.HtmlSnippet | Array<string | OO.ui.HtmlSnippet>
    ): Array<string | OO.ui.HtmlSnippet> {
        if (typeof msg === "string") {
            return [msg]
        } else if (msg instanceof OO.ui.HtmlSnippet) {
            return [msg]
        } else if (msg === undefined || msg === null) {
            return []
        } else {
            return msg
        }
    }
}

interface TextInputLayoutConfig extends InputLayoutConfigPrototype {
    value?: string
    icon?: OO.ui.Icon | Record<string, OO.ui.Icon>
    placeholder?: string
    validate?: string | RegExp | ((value: string) => boolean | JQuery.Promise<boolean>)
    indicator?: OO.ui.Indicator
    maxLength?: number
    minLength?: number

    autofocus?: boolean
    spellcheck?: boolean
    readOnly?: boolean
}

class TextInputLayout extends InputLayoutPrototype {
    input: OO.ui.TextInputWidget

    constructor(config?: TextInputLayoutConfig) {
        if (!config) config = {}
        if (!config.classes) config.classes = []
        if (!config.align) config.align = "left"

        // input widget
        const input = new OO.ui.TextInputWidget({
            value: config.value,
            placeholder: config.placeholder,
            validate: config.validate,
            disabled: config.disabled,
            autofocus: config.autofocus,
            spellcheck: config.spellcheck,
            indicator: config.indicator,
            readOnly: config.readOnly,
            type: "text",
            maxLength: config.maxLength,
            minLength: config.minLength,
            icon: config.icon,
            classes: [
                "mjw-sprite-editor--component-label-field--input",
                "mjw-sprite-editor--component-label-field-text--input",
            ],
        })

        // constructor
        super(input, {
            label: config.label,
            help: config.help,
            helpInline: config.helpInline,
            id: config.id,
            align: config.align,
            classes: [
                "mjw-sprite-editor--component-label-field",
                "mjw-sprite-editor--component-label-field-text",
            ].concat(config.classes),
            data: config.key,
        })

        // sublabel
        if (config.sublabel) {
            this.$label.append(
                new OO.ui.LabelWidget({
                    label: config.sublabel,
                    classes: [
                        "mjw-sprite-editor--component-sublabel",
                        "mjw-sprite-editor--component-label-field--sublabel",
                        "mjw-sprite-editor--component-label-field-text--sublabel",
                    ],
                }).$element
            )
        }

        this.input = input
    }

    // getter / setter
    get value() {
        return this.input.getValue()
    }
    set value(value: string) {
        this.input.setValue(value)
    }

    // methods
    async isValid() {
        return await this.input.getValidity()
    }
}

export default TextInputLayout
