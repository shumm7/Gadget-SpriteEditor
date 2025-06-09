export namespace LabelField {
    export class Prototype {
        layout: OO.ui.FieldLayout

        constructor(widget: OO.ui.Widget, config?: OO.ui.FieldLayout.ConfigOptions) {
            this.layout = new OO.ui.FieldLayout(widget, config)
        }

        // getter / setter
        get $element() {
            return this.layout.$element
        }
        set $element(value: JQuery<HTMLElement>) {
            this.layout.$element = value
        }
        get id() {
            return this.layout.getElementId()
        }
        set id(value: string) {
            this.layout.setElementId(value)
        }

        // methods
        setError(msg?: null | string | OO.ui.HtmlSnippet | Array<string | OO.ui.HtmlSnippet>) {
            if (typeof msg === "string") {
                this.layout.setErrors([msg])
            } else if (msg instanceof OO.ui.HtmlSnippet) {
                this.layout.setErrors([msg])
            } else if (msg === undefined || msg === null) {
                this.layout.setErrors([])
            } else {
                this.layout.setErrors(msg)
            }
        }
        setWarning(msg?: null | string | OO.ui.HtmlSnippet | Array<string | OO.ui.HtmlSnippet>) {
            if (typeof msg === "string") {
                this.layout.setWarnings([msg])
            } else if (msg instanceof OO.ui.HtmlSnippet) {
                this.layout.setWarnings([msg])
            } else if (msg === undefined || msg === null) {
                this.layout.setWarnings([])
            } else {
                this.layout.setWarnings(msg)
            }
        }
        setNotice(msg?: null | string | OO.ui.HtmlSnippet | Array<string | OO.ui.HtmlSnippet>) {
            if (typeof msg === "string") {
                this.layout.setNotices([msg])
            } else if (msg instanceof OO.ui.HtmlSnippet) {
                this.layout.setNotices([msg])
            } else if (msg === undefined || msg === null) {
                this.layout.setNotices([])
            } else {
                this.layout.setNotices(msg)
            }
        }
    }

    interface ConfigPrototype {
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

    export interface TextConfig extends ConfigPrototype {
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

    export class Text extends Prototype {
        private field: OO.ui.TextInputWidget

        constructor(config?: TextConfig) {
            if (!config) config = {}
            if (!config.classes) config.classes = []
            if (!config.align) config.align = "left"

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

            if (config.sublabel) {
                this.layout.$label.append(
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

            this.field = input
        }

        // getter / setter
        get value() {
            return this.field.getValue()
        }
        set value(value: string) {
            this.field.setValue(value)
        }

        // events
        on(
            event: "change" | "disable" | "enter",
            method: (this: null) => void,
            args?: [] | undefined,
            context?: null | undefined
        ) {
            if (event === "change") {
                this.field.on("change", method, args, context)
            } else if (event === "disable") {
                this.field.on("disable", method, args, context)
            } else if (event === "enter") {
                this.field.on("enter", method, args, context)
            }
        }
        off(
            event: "change" | "disable" | "enter",
            method: (this: null) => void,
            context?: null | undefined
        ) {
            if (event === "change") {
                this.field.off("change", method, context)
            } else if (event === "disable") {
                this.field.off("disable", method, context)
            } else if (event === "enter") {
                this.field.off("enter", method, context)
            }
        }
        change(parameters?: any[] | JQuery.PlainObject | string | number | boolean) {
            this.field.$element.trigger("change", parameters)
        }

        // methods
        async isValid() {
            return await this.field.getValidity()
        }
    }

    export interface NumericConfig extends ConfigPrototype {
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

    export class Numeric extends Prototype {
        private field: OO.ui.TextInputWidget

        constructor(config?: NumericConfig) {
            if (!config) config = {}
            if (!config.classes) config.classes = []
            if (!config.align) config.align = "left"

            const field = new OO.ui.TextInputWidget({
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

            super(
                new OO.ui.Widget({
                    content: [field],
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

            if (config.sublabel) {
                this.layout.$label.append(
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

            this.field = field
        }

        // getter / setter
        get value() {
            return Number(this.field.getValue())
        }
        set value(value: number) {
            this.field.setValue(String(value))
        }

        // events
        on(
            event: "change" | "disable" | "enter",
            method: (this: null) => void,
            args?: [] | undefined,
            context?: null | undefined
        ) {
            if (event === "change") {
                this.field.on("change", method, args, context)
            } else if (event === "disable") {
                this.field.on("disable", method, args, context)
            } else if (event === "enter") {
                this.field.on("enter", method, args, context)
            }
        }
        off(
            event: "change" | "disable" | "enter",
            method: (this: null) => void,
            context?: null | undefined
        ) {
            if (event === "change") {
                this.field.off("change", method, context)
            } else if (event === "disable") {
                this.field.off("disable", method, context)
            } else if (event === "enter") {
                this.field.off("enter", method, context)
            }
        }
        change(parameters?: any[] | JQuery.PlainObject | string | number | boolean) {
            this.field.$element.trigger("change", parameters)
        }
    }

    export interface ToggleConfig extends ConfigPrototype {
        value?: boolean
    }

    export class Toggle extends Prototype {
        private field: OO.ui.ToggleSwitchWidget

        constructor(config?: ToggleConfig) {
            if (!config) config = {}
            if (!config.classes) config.classes = []
            if (!config.align) config.align = "left"

            const field = new OO.ui.ToggleSwitchWidget({
                value: config.value,
                disabled: config.disabled,
                classes: [
                    "mjw-sprite-editor--component-label-field-toggle--input",
                    "mjw-sprite-editor--component-label-field--input",
                ],
            })

            super(field, {
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

            if (config.sublabel) {
                this.layout.$label.append(
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

            this.field = field
        }

        // getter / setter
        get value() {
            return this.field.getValue()
        }
        set value(value: boolean) {
            this.field.setValue(value)
        }

        // events
        on(
            event: "change" | "disable" | "toggle",
            method: (this: null) => void,
            args?: [] | undefined,
            context?: null | undefined
        ) {
            if (event === "change") {
                this.field.on("change", method, args, context)
            } else if (event === "disable") {
                this.field.on("disable", method, args, context)
            } else if (event === "toggle") {
                this.field.on("toggle", method, args, context)
            }
        }
        off(
            event: "change" | "disable" | "toggle",
            method: (this: null) => void,
            context?: null | undefined
        ) {
            if (event === "change") {
                this.field.off("change", method, context)
            } else if (event === "disable") {
                this.field.off("disable", method, context)
            } else if (event === "toggle") {
                this.field.off("toggle", method, context)
            }
        }
        change(parameters?: any[] | JQuery.PlainObject | string | number | boolean) {
            this.field.$element.trigger("change", parameters)
        }
    }

    export interface CheckboxConfig extends ConfigPrototype {
        value?: boolean
    }

    export class Checkbox extends Prototype {
        private field: OO.ui.CheckboxInputWidget

        constructor(config?: CheckboxConfig) {
            if (!config) config = {}
            if (!config.classes) config.classes = []
            if (!config.align) config.align = "left"

            const field = new OO.ui.CheckboxInputWidget({
                selected: config.value,
                disabled: config.disabled,
                classes: [
                    "mjw-sprite-editor--component-label-field--input",
                    "mjw-sprite-editor--component-label-field-checkbox--input",
                ],
            })

            super(field, {
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

            if (config.sublabel) {
                this.layout.$label.append(
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

            this.field = field
        }

        // getter / setter
        get value() {
            return this.field.isSelected()
        }
        set value(value: boolean) {
            this.field.setSelected(value)
        }

        // events
        on(
            event: "change" | "disable" | "toggle",
            method: (this: null) => void,
            args?: [] | undefined,
            context?: null | undefined
        ) {
            if (event === "change") {
                this.field.on("change", method, args, context)
            } else if (event === "disable") {
                this.field.on("disable", method, args, context)
            } else if (event === "toggle") {
                this.field.on("toggle", method, args, context)
            }
        }
        off(
            event: "change" | "disable" | "toggle",
            method: (this: null) => void,
            context?: null | undefined
        ) {
            if (event === "change") {
                this.field.off("change", method, context)
            } else if (event === "disable") {
                this.field.off("disable", method, context)
            } else if (event === "toggle") {
                this.field.off("toggle", method, context)
            }
        }
        change(parameters?: any[] | JQuery.PlainObject | string | number | boolean) {
            this.field.$element.trigger("change", parameters)
        }
    }
}
