export namespace ComboBoxAction {
    export interface Config {
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

    export class Layout {
        layout: OO.ui.ActionFieldLayout
        field: OO.ui.ComboBoxInputWidget
        button: OO.ui.ButtonWidget

        constructor(config?: Config) {
            if (!config) config = {}
            if (!config.classes) config.classes = []

            // field
            this.field = new OO.ui.ComboBoxInputWidget({
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
            this.button = new OO.ui.ButtonWidget({
                label: config.buttonLabel,
                flags: ["primary", "progressive"],
                framed: true,
                icon: config.buttonIcon,
                classes: ["mjw-sprite-editor--component-combobox-action--button"],
                disabled: config.disabled,
            })

            // layout
            this.layout = new OO.ui.ActionFieldLayout(this.field, this.button, {
                id: config.id,
                classes: ["mjw-sprite-editor--component-combobox-action"].concat(config.classes),
            })
        }

        get $element() {
            return this.layout.$element
        }
        set $element(value: JQuery<HTMLElement>) {
            this.layout.$element = value
        }
        get $field() {
            return this.field.$element
        }
        set $field(value: JQuery<HTMLElement>) {
            this.field.$element = value
        }
        get $button() {
            return this.button.$element
        }
        set $button(value: JQuery<HTMLElement>) {
            this.button.$element = value
        }
    }
}
