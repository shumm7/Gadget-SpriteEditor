interface IntroductionFormLayoutConfig {
    label?: OO.ui.Deferrable<string> | JQuery<HTMLElement> | OO.ui.HtmlSnippet
    description?: OO.ui.Deferrable<string> | JQuery<HTMLElement> | OO.ui.HtmlSnippet
    help?: string | OO.ui.HtmlSnippet
    error?: string | OO.ui.HtmlSnippet
    disabled?: boolean

    value?: string
    placeholder?: string
    icon?: OO.ui.Icon | Record<string, OO.ui.Icon>
    autofocus?: boolean
    validate?: string | RegExp | ((value: string) => boolean | JQuery.Promise<boolean>)
    indicator?: OO.ui.Indicator
    maxLength?: number
    minLength?: number

    buttonLabel?: OO.ui.Deferrable<string> | JQuery<HTMLElement> | OO.ui.HtmlSnippet
    buttonIcon?: OO.ui.Icon | Record<string, OO.ui.Icon>

    id?: string
    classes?: string[]
}

export default class IntroductionFormLayout extends OO.ui.PanelLayout {
    // Element
    form: OO.ui.FormLayout
    private field: OO.ui.FieldLayout
    private input: OO.ui.TextInputWidget
    private button: OO.ui.InputWidget
    private fieldset: OO.ui.FieldsetLayout

    // Constructor
    constructor(config?: IntroductionFormLayoutConfig) {
        if (!config) config = {}
        if (config.classes === undefined) config.classes = []
        if (config.autofocus === undefined) config.autofocus = true
        if (config.disabled === undefined) config.disabled = false

        let errors: (string | OO.ui.HtmlSnippet)[] | undefined
        if (typeof config.error === "string") {
            if (config.error.length > 0) errors = [config.error]
        } else if (config.error !== undefined) {
            errors = [config.error]
        }

        // input
        const input = new OO.ui.TextInputWidget({
            value: config.value,
            validate: config.validate,
            placeholder: config.placeholder,
            icon: config.icon,
            autofocus: config.autofocus,
            disabled: config.disabled,
            maxLength: config.maxLength,
            minLength: config.minLength,
            classes: ["mjw-sprite-editor--component-sprite-selector--input"],
        })

        // button
        const button = new OO.ui.ButtonInputWidget({
            type: "submit",
            framed: true,
            label: config.buttonLabel,
            flags: ["primary", "progressive"],
            icon: config.buttonIcon,
            disabled: config.disabled,
            indicator: config.indicator,
            classes: ["mjw-sprite-editor--component-sprite-selector--input"],
        })

        // Fieldset
        const field = new OO.ui.FieldLayout(input, {
            classes: ["mjw-sprite-editor--component-sprite-selector--field-input"],
            label: config.description,
            help: config.help,
            errors: errors,
            align: "top",
        })

        const fieldset = new OO.ui.FieldsetLayout({
            label: config.label,
            items: [
                field,
                new OO.ui.FieldLayout(button, {
                    classes: ["mjw-sprite-editor--component-sprite-selector--field-button"],
                    align: "top",
                }),
            ],
            classes: ["mjw-sprite-editor--component-sprite-selector--fields"],
        })

        // form
        const form = new OO.ui.FormLayout({
            classes: ["mjw-sprite-editor--component-sprite-selector--form"],
            items: [fieldset],
        })

        // panel
        super({
            padded: true,
            expanded: false,
            framed: true,
            id: config.id,
            classes: ["mjw-sprite-editor--component-sprite-selector"].concat(config.classes),
            content: [form],
        })

        // UI arguments
        this.input = input
        this.button = button
        this.field = field
        this.fieldset = fieldset
        this.form = form
    }

    // Getter / Setter Parameters
    set value(value: string) {
        this.input.setValue(value)
    }
    get value() {
        return this.input.getValue()
    }

    error(message?: string | OO.ui.HtmlSnippet) {
        if (message) {
            this.field.setErrors([message])
        } else {
            this.field.setErrors([])
        }
    }
}
