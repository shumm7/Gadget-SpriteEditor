import lang_ja from "@/lang/ja"
import lang_en from "@/lang/en"

export const CONSTANT = {
    defaultLanguage: "en",
    path: mw.config.get("wgScriptPath") + "/index.php?",
    specialPage: "SpriteEditor",
    messagePrefix: "sprite-editor-",
}

const Messages: Record<string, Record<string, string>> = {
    ja: lang_ja,
    en: lang_en,
}

const SystemMessages = ["edit"]

export function setAllMessages(): JQuery.Promise<boolean> {
    return new mw.Api()
        .getMessages(
            Object.keys(Messages[CONSTANT.defaultLanguage])
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
            if (lang in Messages && lang !== CONSTANT.defaultLanguage) {
                for (const [k, v] of Object.entries(Messages[lang])) {
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
