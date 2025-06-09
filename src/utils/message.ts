export const CONSTANT = {
    path: mw.config.get("wgScriptPath") + "/index.php?",
    specialPage: "SpriteEditor",
    messagePrefix: "sprite-editor-",
}

const SystemMessages = ["edit"]
const Messages: Record<string, string | null> = {
    "canonical-pagename": CONSTANT.specialPage,
    title: "Sprite Editor",
    description: "The Sprite Editor allows you to edit the data on the sprite sheet.",
    "selector-label": "Edit Sprite Sheet",
    "selector-instructions": "Enter the title of the page you wish to edit:",
    "selector-extension-error": "The extension must be <var>.json</var>, but <var>.$2</var>: $1",
    "selector-noextension-error": "The extension must be <var>.json</var>: $1",
    "selector-contentmodel-error": "Content model must be <var>$3</var>, but <var>$2</var>: $1",
    "selector-namespace-error": "Namespace must be <var>Module</var> or <var>MediaWiki</var>: $1",
    "editor-ids-title": "Sprite Data",
    "editor-sections-title": "Sections",
    "editor-settings-title": "Sheet Settings",
    "editor-export-title": "Export",
    "settings-unknown-value": "<var>$1</var>",
    "settings-name": "Name",
    "settings-image": "Image",
    "settings-scale": "Scale",
    "settings-pos": "Sprite Position",
    "settings-size": "Sprite Size (px)",
    "settings-width": "Sprite Width (px)",
    "settings-height": "Sprite Height (px)",
    "settings-sheetsize": "Image Width (px)",
    "settings-sheet-width": "Image Width (px)",
    "settings-sheet-height": "Image Height (px)",
    "settings-notip": "Hide Tooltip",
    "settings-classname": "Class Name",
    "settings-class": "Class",
    "settings-stylesheet": "Stylesheet",
    "settings-image-description":
        "Specify the image to be used as a sprite sheet by URL or file name (namespace <var>File:</var> is unnecessary).",
    "settings-size-description":
        "Specifies the height and width of each sprite. This value is overridden by <var>width</var> and <var>height</var>.",
    "settings-width-description":
        "Specifies the width of each sprite. This value overrides <var>size</var>.",
    "settings-height-description":
        "Specifies the height of each sprite. This value overrides <var>size</var>.",
    "settings-classname-description":
        "Specifies an HTML class that is common to all sprites; e.g. <code>inv-sprite</code>.",
    "settings-stylesheet-description": "Make a separate clone of the current default settings.",
    "editor-settings-add": "Add",
    "editor-settings-value-options": "$2: $1",
    "editor-settings-type-string": "String",
    "editor-settings-type-number": "Number",
    "editor-settings-type-boolean": "Boolean",
    "editor-canvas-scale": "Scale: <b>$1%</b>",
    "editor-canvas-selected": "Selected: <b>$1</b> ($2, $3)",
    "editor-canvas-selected-multiple": "Selected: <b>$1</b>",
}
const i18n: Record<string, Record<string, string | null>> = {
    ja: {
        "canonical-pagename": "スプライトエディタ",
        title: "スプライトエディタ",
        description: "スプライトエディタを使用して、スプライトシート上のデータを編集します。",
        "selector-label": "スプライトシートを編集",
        "selector-instructions": "編集したいページの名前を入力:",
        "selector-extension-error":
            "拡張子は <var>.json</var> である必要があります（<var>.$2</var>）: $1",
        "selector-noextension-error": "拡張子は <var>.json</var> である必要があります: $1",
        "selector-contentmodel-error":
            "コンテンツモデルは <var>$3</var> である必要があります（<var>$2</var>）: $1",
        "selector-namespace-error":
            "名前空間は <var>Module</var> か <var>MediaWiki</var> である必要があります: $1",
        "editor-ids-title": "スプライトデータ",
        "editor-sections-title": "セクション",
        "editor-settings-title": "シート設定",
        "editor-export-title": "エクスポート",
        "settings-unknown-value": "<var>$1</var>",
        "settings-name": "名前",
        "settings-image": "画像",
        "settings-scale": "拡大率",
        "settings-pos": "スプライト位置",
        "settings-size": "スプライトの大きさ (px)",
        "settings-width": "スプライト幅 (px)",
        "settings-height": "スプライト高さ (px)",
        "settings-sheetsize": "画像の横幅 (px)",
        "settings-sheet-width": "画像の横幅 (px)",
        "settings-sheet-height": "画像の高さ (px)",
        "settings-notip": "ツールチップを非表示",
        "settings-classname": "クラス名",
        "settings-class": "追加クラス",
        "settings-image-description":
            "スプライトシートとして利用する画像を、URLかファイル名で指定する（名前空間 <var>File:</var> は不要）。",
        "settings-size-description":
            "各スプライトの高さと横幅を指定します。この値は <var>width</var> と <var>height</var> により上書きされます。",
        "settings-width-description":
            "各スプライトの横幅を指定します。この値は <var>size</var> を上書きします。",
        "settings-height-description":
            "各スプライトの高さを指定します。この値は <var>size</var> を上書きします。",
        "settings-classname-description":
            "スプライトに共通で設定されるHTMLクラスを指定します（例: <code>inv-sprite</code>）。",
        "editor-settings-add": "追加",
        "editor-settings-value-options": "$2：$1",
        "editor-settings-type-string": "文字列",
        "editor-settings-type-number": "数値",
        "editor-settings-type-boolean": "真偽値",
        "editor-canvas-scale": "ズーム倍率: <b>$1%</b>",
        "editor-canvas-selected": "選択中: <b>$1個</b> ($2, $3)",
        "editor-canvas-selected-multiple": "選択中: <b>$1</b>",
    },
}

export function setAllMessages(): JQuery.Promise<boolean> {
    return new mw.Api()
        .getMessages(
            Object.keys(Messages)
                .map((m) => CONSTANT.messagePrefix + m)
                .concat(SystemMessages)
        )
        .then(function (msg) {
            for (const [k, v] of Object.entries(Messages)) {
                if (!(CONSTANT.messagePrefix + k in msg) && typeof v == "string") {
                    msg[CONSTANT.messagePrefix + k] = v
                }
            }
            return msg
        })
        .then(function (msg) {
            const lang = mw.config.get("wgContentLanguage")
            if (lang in i18n) {
                for (const [k, v] of Object.entries(i18n[lang])) {
                    if (CONSTANT.messagePrefix + k in msg && typeof v == "string") {
                        msg[CONSTANT.messagePrefix + k] = v
                    }
                }
            }
            return msg
        })
        .then(function (msg) {
            return mw.messages.set(msg)
        })
}

export namespace Message {
    export function getRaw(key: string, ...parameters: any[]): string {
        return mw.msg(key, ...parameters)
    }

    export function get(key: string, ...parameters: any[]): string {
        return mw.msg(CONSTANT.messagePrefix + key, ...parameters)
    }

    export function getRawObj(key: string, ...parameters: any[]): mw.Message {
        return mw.message(key, ...parameters)
    }

    export function getObj(key: string, ...parameters: any[]): mw.Message {
        return mw.message(CONSTANT.messagePrefix + key, ...parameters)
    }

    export function exists(key: string): boolean {
        return mw.message(CONSTANT.messagePrefix + key).exists()
    }

    export function existsRaw(key: string): boolean {
        return mw.message(key).exists()
    }
}
