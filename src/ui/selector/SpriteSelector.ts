export namespace SpriteSelector {
    export interface LayoutConfig {
        padded?: boolean
        framed?: boolean
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
        required?: boolean
        spellcheck?: boolean
        autocomplete?: string | boolean
        maxLength?: number
        minLength?: number

        buttonLabel?: OO.ui.Deferrable<string> | JQuery<HTMLElement> | OO.ui.HtmlSnippet
        buttonIcon?: OO.ui.Icon | Record<string, OO.ui.Icon>

        id?: string
        classes?: string[]
    }

    export class Layout {
        // Element
        private panel: OO.ui.PanelLayout
        private form: OO.ui.FormLayout
        private field: OO.ui.FieldLayout
        private input: OO.ui.TextInputWidget
        private button: OO.ui.InputWidget
        private fieldset: OO.ui.FieldsetLayout

        // Constructor
        constructor(config?: LayoutConfig) {
            if (!config) config = {}
            if (config.framed === undefined) config.framed = true
            if (config.padded === undefined) config.padded = true
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
            this.input = new OO.ui.TextInputWidget({
                value: config.value,
                validate: config.validate,
                placeholder: config.placeholder,
                icon: config.icon,
                autofocus: config.autofocus,
                disabled: config.disabled,
                required: config.required,
                spellcheck: config.spellcheck,
                maxLength: config.maxLength,
                minLength: config.minLength,
                autocomplete: config.autocomplete,
                classes: ["mjw-sprite-editor--component-sprite-selector--input"],
            })

            // button
            this.button = new OO.ui.ButtonInputWidget({
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
            this.field = new OO.ui.FieldLayout(this.input, {
                classes: ["mjw-sprite-editor--component-sprite-selector--field-input"],
                label: config.description,
                help: config.help,
                errors: errors,
                align: "top",
            })

            this.fieldset = new OO.ui.FieldsetLayout({
                label: config.label,
                items: [
                    this.field,
                    new OO.ui.FieldLayout(this.button, {
                        classes: ["mjw-sprite-editor--component-sprite-selector--field-button"],
                        align: "top",
                    }),
                ],
                classes: ["mjw-sprite-editor--component-sprite-selector--fields"],
            })

            // form
            this.form = new OO.ui.FormLayout({
                classes: ["mjw-sprite-editor--component-sprite-selector--form"],
                items: [this.fieldset],
            })

            // panel
            this.panel = new OO.ui.PanelLayout({
                padded: config.padded,
                expanded: false,
                framed: config.framed,
                id: config.id,
                classes: ["mjw-sprite-editor--component-sprite-selector"].concat(config.classes),
                content: [this.form],
            })
        }

        // Getter / Setter Parameters
        set id(value: string) {
            this.panel.setElementId(value)
        }
        get id() {
            return this.panel.getElementId()
        }

        set value(value: string) {
            this.input.setValue(value)
        }
        get value() {
            return this.input.getValue()
        }

        set disabled(value: boolean) {
            this.button.setDisabled(value)
        }
        get disabled() {
            return this.button.isDisabled()
        }

        get data() {
            return this.panel.getData()
        }
        set data(value: any) {
            this.panel.setData(value)
        }

        get $element() {
            return this.panel.$element
        }
        set $element(value: JQuery<HTMLElement>) {
            this.panel.$element = value
        }

        on(
            event: "change" | "submit" | "disable" | "enter",
            method: (this: null) => void,
            args?: [] | undefined,
            context?: null | undefined
        ) {
            if (event === "submit") {
                this.form.on("submit", method, args, context)
            } else if (event === "change") {
                this.input.on("change", method, args, context)
            } else if (event === "disable") {
                this.input.on("disable", method, args, context)
            } else if (event === "enter") {
                this.input.on("disable", method, args, context)
            }
        }

        off(
            event: "change" | "submit" | "disable" | "enter",
            method?: (this: null) => void,
            context?: null | undefined
        ) {
            if (event === "submit") {
                this.form.off("submit", method, context)
            } else if (event === "change") {
                this.input.off("change", method, context)
            } else if (event === "disable") {
                this.input.off("disable", method, context)
            } else if (event === "enter") {
                this.input.off("disable", method, context)
            }
        }

        submit(parameters?: any[] | JQuery.PlainObject | string | number | boolean) {
            this.form.$element.trigger("submit", parameters)
        }
        change(parameters?: any[] | JQuery.PlainObject | string | number | boolean) {
            this.input.$element.trigger("change", parameters)
        }

        async isValid() {
            return await this.input.getValidity()
        }

        error(message?: string | OO.ui.HtmlSnippet) {
            if (message) {
                this.field.setErrors([message])
            } else {
                this.field.setErrors([])
            }
        }
    }
}
