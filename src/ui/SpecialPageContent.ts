import Message from "@/utils/message"
import { pageInfo } from "@/utils/io"
import { getSearchParams, getPageTitle } from "@/utils/page"
import IntroductionFormContent from "./specialPages/IntroductionFormContent"
import SpriteEditorContent from "./specialPages/SpriteEditorContent"

export default class SpecialPageContent {
    private $body: JQuery<HTMLElement>
    private targetPageName: string | null

    constructor() {
        const params = getSearchParams()
        this.targetPageName = params.get("data")

        // Set document title
        document.title = `${Message.get("title")} - ${mw.config.get("wgSiteName")}`
        SpecialPageContent.setPageTitleText(Message.get("title"))

        // body
        this.$body = SpecialPageContent.getContentElement()

        if (mw.config.get("wgAction") == "view") {
            this.expandElement()
        }
    }

    expandElement() {
        const target = this.targetPageName

        if (target && target.length > 0) {
            pageInfo(target).then((page) => {
                const pageid = page.pageid === undefined ? -1 : page.pageid
                const exist = pageid >= 0
                const nsId = page.ns || 0
                const contentModel: string | undefined = page.contentmodel
                const titleObj = getPageTitle(target)
                const ext = titleObj.getExtension()

                var error: string | OO.ui.HtmlSnippet | undefined
                if (nsId === 8 /* MediaWiki */) {
                    if (ext === "json") {
                        if ((contentModel === "json" && exist) || !exist) {
                            this.showEditor(target, exist)
                            return
                        } else {
                            error = Message.getObj(
                                "selector-contentmodel-error",
                                target,
                                contentModel || "Unknown",
                                "json"
                            ).parseDom()
                        }
                    } else {
                        if (ext && ext.length > 0) {
                            error = Message.getObj(
                                "selector-extension-error",
                                target,
                                ext
                            ).parseDom()
                        } else {
                            error = Message.getObj(
                                "selector-noextension-error",
                                target,
                                ext
                            ).parseDom()
                        }
                    }
                } else if (nsId === 828) {
                    if (!exist || (exist && contentModel === "Scribunto")) {
                        this.showEditor(target, exist)
                        return
                    } else {
                        error = Message.getObj(
                            "selector-contentmodel-error",
                            target,
                            contentModel || "Unknown",
                            "Scribunto"
                        ).parseDom()
                    }
                } else {
                    error = Message.getObj("selector-namespace-error", target).parseDom()
                }
                this.showIntroductionForm(target, error)
            })
        } else {
            this.showIntroductionForm(target)
        }
    }

    private static setPageTitleText(text: string) {
        // const skin = mw.config.get("skin")
        $("#firstHeading").text(text)
    }

    private static getContentElement() {
        return $("#mw-content-text")
    }

    private showIntroductionForm(
        targetPageName: string | null,
        error?: string | OO.ui.HtmlSnippet
    ) {
        new IntroductionFormContent(this.$body, targetPageName, error)
    }

    private showEditor(targetPageName: string, exists: boolean) {
        new SpriteEditorContent(this.$body, targetPageName, exists)
    }
}
