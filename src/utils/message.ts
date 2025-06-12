import lang_ja from "@/lang/ja"
import lang_en from "@/lang/en"

export const Constant = {
    /** Default content language. */
    defaultLanguage: "en",
    /** API endpoint path. */
    path: mw.config.get("wgScriptPath") + "/index.php?",
    /** Canonical special page title (without namespace). */
    specialPage: "SpriteEditor",
    /** Prefix for system messages. */
    messagePrefix: "sprite-editor-",
} as const

/** Localized system messages. */
const Messages: Record<string, Record<string, string>> = {
    ja: lang_ja,
    en: lang_en,
} as const

/** MediaWiki built-in system messages to load. */
const SystemMessages = ["edit"]

export function setAllMessages(): JQuery.Promise<boolean> {
    return new mw.Api()
        .getMessages(
            Object.keys(Messages[Constant.defaultLanguage])
                .map((m) => Constant.messagePrefix + m)
                .concat(SystemMessages)
        )
        .then(function (msg) {
            for (const [k, v] of Object.entries(Messages[Constant.defaultLanguage])) {
                if (!(Constant.messagePrefix + k in msg) && typeof v == "string") {
                    msg[Constant.messagePrefix + k] = v
                }
            }
            return msg
        })
        .then(function (msg) {
            const lang = mw.config.get("wgContentLanguage")
            if (lang in Messages && lang !== Constant.defaultLanguage) {
                for (const [k, v] of Object.entries(Messages[lang])) {
                    if (Constant.messagePrefix + k in msg && typeof v == "string") {
                        msg[Constant.messagePrefix + k] = v
                    }
                }
            }
            return msg
        })
        .then(function (msg) {
            return mw.messages.set(msg)
        })
}

export default class Message {
    static getRaw(key: string, ...parameters: any[]): string {
        return mw.msg(key, ...parameters)
    }

    static get(key: string, ...parameters: any[]): string {
        return mw.msg(Constant.messagePrefix + key, ...parameters)
    }

    static getRawObj(key: string, ...parameters: any[]): mw.Message {
        return mw.message(key, ...parameters)
    }

    static getObj(key: string, ...parameters: any[]): mw.Message {
        return mw.message(Constant.messagePrefix + key, ...parameters)
    }

    static exists(key: string): boolean {
        return mw.message(Constant.messagePrefix + key).exists()
    }

    static existsRaw(key: string): boolean {
        return mw.message(key).exists()
    }
}
