import NamespaceIds from "./data/namespaceIds"
import SpecialPageContent from "./ui/SpecialPageContent"
import { initHooks } from "./utils/hooks"
import Message, { Constant, setAllMessages } from "./utils/message"

mw.hook("wikipage.content").add(function () {
    initHooks()
    setAllMessages().then(() => {
        const namespaceId = mw.config.get("wgNamespaceNumber")
        const pageTitle = mw.config.get("wgTitle")
        const contentModel = mw.config.get("wgPageContentModel")

        // Target Namespace
        if (namespaceId == NamespaceIds.special) {
            if (
                pageTitle === Constant.specialPage ||
                pageTitle === Message.get("canonical-pagename")
            ) {
                new SpecialPageContent()
            }
        } else if (namespaceId == NamespaceIds.file) {
        } else if (namespaceId == NamespaceIds.mediawiki) {
        } else if (namespaceId == NamespaceIds.module) {
        }
    })
})
