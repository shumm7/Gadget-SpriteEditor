import { pageInfo } from "@/utils/io"
import { getBody, setTitle } from "../utils/html"
import { Message } from "../utils/message"
import { getSearchParams, getTitle } from "../utils/page"
import SpriteIntroduction from "../ui/SpriteSelector"
import SpriteEditor from "../ui/SpriteEditor"

export function init() {
    const params = getSearchParams()
    setDOM(params.get("data"))
}

function setDOM(page: string | null) {
    // Doc Title
    document.title = `${Message.get("title")} - ${mw.config.get("wgSiteName")}`

    // Header
    setTitle(Message.get("title"))

    // Body
    const contentBody = getBody()

    if (mw.config.get("wgAction") == "view") {
        expandElement(contentBody, page)
    }
}

function expandElement(body: JQuery<HTMLElement>, title: string | null) {
    if (title && title.length > 0) {
        pageInfo(title).then((page) => {
            const pageid = page.pageid === undefined ? -1 : page.pageid
            const exist = pageid >= 0
            const nsId = page.ns || 0
            const contentModel: string | undefined = page.contentmodel
            const titleObj = getTitle(title)
            const ext = titleObj.getExtension()

            var error: string | OO.ui.HtmlSnippet | undefined
            if (nsId === 8 /* MediaWiki */) {
                if (ext === "json") {
                    if ((contentModel === "json" && exist) || !exist) {
                        showEditor(body, title, exist)
                        return
                    } else {
                        error = Message.getObj(
                            "selector-contentmodel-error",
                            title,
                            contentModel || "Unknown",
                            "json"
                        ).parseDom()
                    }
                } else {
                    if (ext && ext.length > 0) {
                        error = Message.getObj("selector-extension-error", title, ext).parseDom()
                    } else {
                        error = Message.getObj("selector-noextension-error", title, ext).parseDom()
                    }
                }
            } else if (nsId === 828) {
                if (!exist || (exist && contentModel === "Scribunto")) {
                    showEditor(body, title, exist)
                    return
                } else {
                    error = Message.getObj(
                        "selector-contentmodel-error",
                        title,
                        contentModel || "Unknown",
                        "Scribunto"
                    ).parseDom()
                }
            } else {
                error = Message.getObj("selector-namespace-error", title).parseDom()
            }
            showSelector(body, title, error)
        })
    } else {
        showSelector(body, title)
    }
}

function showSelector(
    body: JQuery<HTMLElement>,
    title: string | null,
    error?: string | OO.ui.HtmlSnippet
) {
    new SpriteIntroduction(body, title, error)
}

function showEditor(body: JQuery<HTMLElement>, title: string, exists: boolean) {
    new SpriteEditor(body, title, exists)
}
