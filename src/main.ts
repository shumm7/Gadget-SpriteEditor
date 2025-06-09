import { init as specialPageInit } from "./editor/_main"
import { initHooks } from "./utils/hooks"
import { CONSTANT, Message, setAllMessages } from "./utils/message"

let debug = true

mw.hook("wikipage.content").add(function () {
    initHooks()
    setAllMessages().then(() => {
        const namespaceId = mw.config.get("wgNamespaceNumber")
        const pageTitle = mw.config.get("wgTitle")
        const contentModel = mw.config.get("wgPageContentModel")

        // Target Namespace
        if (namespaceId == -1 /* Special */) {
            if (
                pageTitle === CONSTANT.specialPage ||
                pageTitle === Message.get("canonical-pagename")
            ) {
                specialPageInit()
            }
        } else if (namespaceId == 6 /* File */) {
        } else if (namespaceId == 8 /* MediaWiki */) {
        } else if (namespaceId == 828 /* Module */) {
        }
    })
})
