/**
 * Get search params object from `window.location`.
 */
export function getSearchParams(): URLSearchParams {
    return new URLSearchParams(window.location.search)
}

export function replaceSearchParams(key: string, value?: string | null) {
    var p = getSearchParams()
    if (value) {
        p.set(key, value)
    } else {
        p.delete(key)
    }
    let url = new URL(window.location.href)
    url.search = p.toString()
    history.pushState("", "", url)
    return p
}

export function setSearchParams(key: string, value?: string | null) {
    var p = getSearchParams()
    if (value) {
        p.set(key, value)
    } else {
        p.delete(key)
    }
    window.location.search = p.toString()
    return p
}

export function getPageTitle(title?: string, ns?: number) {
    if (title === undefined) {
        if (ns === undefined) {
            title = mw.config.get("wgPageName")
        } else {
            title = mw.config.get("wgTitle")
        }
    }
    return new mw.Title(title, ns)
}
