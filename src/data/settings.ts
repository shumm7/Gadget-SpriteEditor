export const SettingsValue: Record<
    string,
    { id: string; type: "string" | "number" | "boolean"; default: string | number | boolean }
> = {
    name: {
        id: "name",
        type: "string",
        default: "",
    },
    image: {
        id: "image",
        type: "string",
        default: "",
    },
    scale: {
        id: "scale",
        type: "number",
        default: 1,
    },
    pos: {
        id: "pos",
        type: "number",
        default: 1,
    },
    size: {
        id: "size",
        type: "number",
        default: 16,
    },
    width: {
        id: "width",
        type: "number",
        default: 16,
    },
    height: {
        id: "height",
        type: "number",
        default: 16,
    },
    sheetsize: {
        id: "sheetsize",
        type: "number",
        default: 0,
    },
    "sheet-width": {
        id: "sheet-width",
        type: "number",
        default: 0,
    },
    "sheet-height": {
        id: "sheet-height",
        type: "number",
        default: 0,
    },
    notip: {
        id: "notip",
        type: "number",
        default: 1,
    },
    classname: {
        id: "classname",
        type: "string",
        default: "",
    },
    class: {
        id: "class",
        type: "string",
        default: "",
    },
}
