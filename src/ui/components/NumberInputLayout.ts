import { InputLayoutConfigPrototype, InputLayoutPrototype } from "./TextInputLayout"

interface NumberInputLayoutConfig extends InputLayoutConfigPrototype {
    value?: number
    min?: number
    max?: number

    icon?: OO.ui.Icon | Record<string, OO.ui.Icon>
    placeholder?: string
    indicator?: OO.ui.Indicator

    autofocus?: boolean
    spellcheck?: boolean
    readOnly?: boolean
}

class NumberInputLayout extends InputLayoutPrototype {
    input: OO.ui.TextInputWidget

    constructor(config?: NumberInputLayoutConfig) {
        if (!config) config = {}
        if (!config.classes) config.classes = []
        if (!config.align) config.align = "left"

        // input
        const input = new OO.ui.TextInputWidget({
            value: config.value as any,
            placeholder: config.placeholder,
            disabled: config.disabled,
            autofocus: config.autofocus,
            spellcheck: false,
            indicator: config.indicator,
            readOnly: config.readOnly,
            type: "number",
            icon: config.icon,
            classes: [
                "mjw-sprite-editor--component-label-field-number--input",
                "mjw-sprite-editor--component-label-field--input",
            ],
            validate: (v) => {
                let num = Number(v)
                if (isFinite(num)) {
                    if (config.min !== undefined && config.min > num) {
                        return false
                    }
                    if (config.max !== undefined && config.max < num) {
                        return false
                    }
                    return true
                }
                return false
            },
        })

        // constructor
        super(
            new OO.ui.Widget({
                content: [input],
                classes: [
                    "mjw-sprite-editor--component-label-field--container",
                    "mjw-sprite-editor--component-label-field-number--container",
                ],
            }),
            {
                label: config.label,
                help: config.help,
                helpInline: config.helpInline,
                id: config.id,
                align: config.align,
                classes: [
                    "mjw-sprite-editor--component-label-field",
                    "mjw-sprite-editor--component-label-field-number",
                ].concat(config.classes),
                data: config.key,
            }
        )

        // sublabel
        if (config.sublabel) {
            this.$label.append(
                new OO.ui.LabelWidget({
                    label: config.sublabel,
                    classes: [
                        "mjw-sprite-editor--component-sublabel",
                        "mjw-sprite-editor--component-label-field--sublabel",
                        "mjw-sprite-editor--component-label-field-number--sublabel",
                    ],
                }).$element
            )
        }

        this.input = input
    }

    // getter / setter
    get value() {
        return Number(this.input.getValue())
    }
    set value(value: number) {
        this.input.setValue(String(value))
    }
}

export default NumberInputLayout
