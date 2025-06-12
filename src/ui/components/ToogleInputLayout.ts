import { InputLayoutConfigPrototype, InputLayoutPrototype } from "./TextInputLayout"

interface ToggleInputLayoutConfig extends InputLayoutConfigPrototype {
    value?: boolean
}

class ToggleInputLayout extends InputLayoutPrototype {
    input: OO.ui.ToggleSwitchWidget

    constructor(config?: ToggleInputLayoutConfig) {
        if (!config) config = {}
        if (!config.classes) config.classes = []
        if (!config.align) config.align = "left"

        // input
        const input = new OO.ui.ToggleSwitchWidget({
            value: config.value,
            disabled: config.disabled,
            classes: [
                "mjw-sprite-editor--component-label-field-toggle--input",
                "mjw-sprite-editor--component-label-field--input",
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
                "mjw-sprite-editor--component-label-field-toggle",
                "mjw-sprite-editor--component-label-field",
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
                        "mjw-sprite-editor--component-label-field-toggle--sublabel",
                    ],
                }).$element
            )
        }

        this.input = input
    }
}

export default ToggleInputLayout
