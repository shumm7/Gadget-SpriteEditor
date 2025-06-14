import Misc from "@/utils/misc"

namespace Wiki {
    export function pageExsits(title?: string) {
        if (title === undefined) {
            title = mw.config.get("wgPageName")
        }
        return new mw.Api()
            .get({ action: "query", titles: title })
            .then((data) => {
                if (data) {
                    var pageid = Number(Object.keys(data.query.pages)[0])
                    if (typeof pageid == "number" && pageid >= 0) {
                        return true
                    }
                }
                return false
            })
            .fail(function () {
                return undefined
            })
    }

    export function pageInfo(title?: string) {
        if (title === undefined) {
            title = mw.config.get("wgPageName")
        }
        return new mw.Api()
            .get({ action: "query", prop: "info", titles: title })
            .then((data) => {
                if (data) {
                    var pageid = Number(Object.keys(data.query.pages)[0])
                    if (typeof pageid == "number") {
                        if (pageid >= 0) {
                            return data.query.pages[pageid]
                        } else {
                            data.query.pages[pageid].pageid = pageid
                            return data.query.pages[pageid]
                        }
                    }
                }
                return undefined
            })
            .fail(function () {
                return undefined
            })
    }

    export function imageinfo(filename: string) {
        if (!filename) filename = mw.config.get("wgPageName")

        filename = filename.replaceAll(" ", "_")
        if (filename.indexOf("File:") != 0 && filename.indexOf("ファイル:") != 0) {
            filename = "File:" + filename
        }
        return Misc.retryableRequest(function () {
            return new mw.Api().get({ action: "query", prop: "imageinfo", titles: filename, iiprop: ["url", "size"] })
        })
            .then(function (data) {
                if (data) {
                    var pageid = Number(Object.keys(data.query.pages)[0])
                    if (typeof pageid == "number" && pageid >= 0) {
                        return data.query.pages[pageid].imageinfo[0]
                    }
                }
                return
            })
            .fail(function () {
                return
            })
    }
}

export default Wiki
