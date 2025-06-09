export function setTitle(text: string) {
    const skin = mw.config.get("skin")
    $("#firstHeading").text(text)
}

export function getBody() {
    return $("#mw-content-text")
}
