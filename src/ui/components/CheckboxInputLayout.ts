import { InputLayoutConfigPrototype, InputLayoutPrototype } from "./TextInputLayout"

interface CheckboxInputLayoutConfig extends InputLayoutConfigPrototype {
    value?: boolean
}

class CheckboxInputLayout extends InputLayoutPrototype {
    input: OO.ui.CheckboxInputWidget

    constructor(config?: CheckboxInputLayoutConfig) {
        if (!config) config = {}
        if (!config.classes) config.classes = []
        if (!config.align) config.align = "left"

        // input
        const input = new OO.ui.CheckboxInputWidget({
            selected: config.value,
            disabled: config.disabled,
            classes: [
                "mjw-sprite-editor--component-label-field--input",
                "mjw-sprite-editor--component-label-field-checkbox--input",
            ],
        })

        // constructor
        super(input, {
            label: config.label,
            help: config.help,
            helpInline: config.helpInline,
            align: config.align,
            id: config.id,
            classes: [
                "mjw-sprite-editor--component-label-field",
                "mjw-sprite-editor--component-label-field-checkbox",
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
                        "mjw-sprite-editor--component-label-field-checkbox--sublabel",
                    ],
                }).$element
            )
        }

        this.input = input
    }

    // getter / setter
    get value() {
        return this.input.isSelected()
    }
    set value(value: boolean) {
        this.input.setSelected(value)
    }
}

export default CheckboxInputLayout
