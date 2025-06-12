import { convertLua } from "./lua"

export function getImageinfo(filename: string) {
    if (!filename) filename = mw.config.get("wgPageName")

    filename = filename.replaceAll(" ", "_")
    if (filename.indexOf("File:") != 0 && filename.indexOf("ファイル:") != 0) {
        filename = "File:" + filename
    }
    return new mw.Api()
        .get({
            action: "query",
            prop: "imageinfo",
            titles: filename,
            iiprop: ["url", "size"],
        })
        .then((data) => {
            if (data) {
                var pageid = Number(Object.keys(data.query.pages)[0])
                if (typeof pageid == "number" && pageid >= 0) {
                    return data.query.pages[pageid].imageinfo[0]
                }
            }
            return
        })
        .fail(() => {
            return
        })
}

export function loadJson(filename: string) {
    return new Promise(function (resolve, reject) {
        try {
            var xhr = new XMLHttpRequest()
            xhr.responseType = "text"
            xhr.open("GET", filename)
            xhr.setRequestHeader("Cache-Control", "public")
            xhr.setRequestHeader("Cache-Control", "min-fresh=43200")
            xhr.setRequestHeader("Cache-Control", "max-age=86400")
            xhr.onload = function () {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.status === 200) {
                        try {
                            var json = JSON.parse(xhr.responseText)
                            if (typeof json.ids === "object") {
                                var key,
                                    keys = Object.keys(json.ids)
                                var n = keys.length
                                var newobj: Record<string, any> = {}
                                while (n--) {
                                    key = keys[n]
                                    newobj[key.toLowerCase()] = json.ids[key]
                                }
                                json.ids = newobj
                            }
                            resolve(json)
                        } catch (err) {
                            reject(err)
                        }
                    } else {
                        reject(Error(xhr.statusText))
                    }
                } else {
                    reject(Error(xhr.statusText))
                }
            }
            xhr.onerror = function () {
                reject(Error("Network Error"))
            }
            xhr.send()
        } catch (err) {
            reject(err)
        }
    })
}

export function loadLua(filename: string) {
    return new Promise(function (resolve, reject) {
        try {
            var xhr = new XMLHttpRequest()
            xhr.responseType = "text"
            xhr.open("GET", filename)
            xhr.setRequestHeader("Cache-Control", "public")
            xhr.setRequestHeader("Cache-Control", "min-fresh=43200")
            xhr.setRequestHeader("Cache-Control", "max-age=86400")
            xhr.onload = function () {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.status === 200) {
                        try {
                            var json = JSON.parse(convertLua(xhr.responseText))
                            if (typeof json.ids === "object") {
                                var key,
                                    keys = Object.keys(json.ids)
                                var n = keys.length
                                var newobj: Record<string, any> = {}
                                while (n--) {
                                    key = keys[n]
                                    newobj[key.toLowerCase()] = json.ids[key]
                                }
                                json.ids = newobj
                            }
                            resolve(json)
                        } catch (err) {
                            reject(err)
                        }
                    } else {
                        reject(Error(xhr.statusText))
                    }
                } else {
                    reject(Error(xhr.statusText))
                }
            }
            xhr.onerror = function () {
                reject(Error("Network Error"))
            }
            xhr.send()
        } catch (err) {
            reject(err)
        }
    })
}

export function pageExsits(title?: string) {
    if (title === undefined) {
        title = mw.config.get("wgPageName")
    }
    return new mw.Api()
        .get({
            action: "query",
            titles: title,
        })
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
        .get({
            action: "query",
            prop: "info",
            titles: title,
        })
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

export function deepClone<T = Object>(obj: T): T {
    try {
        return window.structuredClone(obj)
    } catch (e) {
        console.warn(e)
        return obj
    }
}

function retryableRequest(request: any, delay: number = 1000, retries: number = 1) {
    var deferred = $.Deferred()
    var curRequest: any
    var timeout: NodeJS.Timeout
    var attemptRequest = function (attempt: number) {
        ;(curRequest = request()).then(deferred.resolve, function (code: any, data: any) {
            if (attempt <= retries) {
                timeout = setTimeout(function () {
                    attemptRequest(++attempt)
                }, delay)
            } else {
                deferred.reject(code, data)
            }
        })
    }
    attemptRequest(1)

    return deferred.promise({
        abort: function () {
            if (curRequest.abort) {
                curRequest.abort()
            }
            clearTimeout(timeout)
        },
    })
}
