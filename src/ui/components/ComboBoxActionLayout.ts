interface ComboBoxActionLayoutConfig {
    value?: string
    label?: OO.ui.Deferrable<string> | JQuery<HTMLElement> | OO.ui.HtmlSnippet
    icon?: OO.ui.Icon | Record<string, OO.ui.Icon>
    validate?: string | RegExp | ((value: string) => boolean | JQuery.Promise<boolean>)
    options?: {
        data: string
        label?: string
    }[]
    placeholder?: string

    autofocus?: boolean
    maxLength?: number
    minLength?: number
    indicator?: OO.ui.Indicator
    spellcheck?: boolean

    buttonLabel?: OO.ui.Deferrable<string> | JQuery<HTMLElement> | OO.ui.HtmlSnippet
    buttonIcon?: OO.ui.Icon | Record<string, OO.ui.Icon>

    disabled?: boolean
    id?: string
    classes?: string[]
}

class ComboBoxActionLayout extends OO.ui.ActionFieldLayout<OO.ui.Widget> {
    field: OO.ui.ComboBoxInputWidget
    button: OO.ui.ButtonWidget
    $field: JQuery<HTMLElement>
    $button: JQuery<HTMLElement>

    constructor(config?: ComboBoxActionLayoutConfig) {
        if (!config) config = {}
        if (!config.classes) config.classes = []

        // field
        const field = new OO.ui.ComboBoxInputWidget({
            label: config.label,
            value: config.value,
            validate: config.validate,
            icon: config.icon,
            placeholder: config.placeholder,

            options: config.options,

            disabled: config.disabled,
            maxLength: config.maxLength,
            minLength: config.minLength,
            autofocus: config.autofocus,
            indicator: config.indicator,
            spellcheck: config.spellcheck,

            classes: ["mjw-sprite-editor--component-combobox-action--field"],
        })

        // button
        const button = new OO.ui.ButtonWidget({
            label: config.buttonLabel,
            flags: ["primary", "progressive"],
            framed: true,
            icon: config.buttonIcon,
            classes: ["mjw-sprite-editor--component-combobox-action--button"],
            disabled: config.disabled,
        })

        // constrcutor
        super(field, button, {
            id: config.id,
            classes: ["mjw-sprite-editor--component-combobox-action"].concat(config.classes),
        })

        // member
        this.field = field
        this.button = button
        this.$field = field.$element
        this.$button = button.$element
    }
}

export default ComboBoxActionLayout
