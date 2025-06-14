import { convertLua } from "@/utils/lua"

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
