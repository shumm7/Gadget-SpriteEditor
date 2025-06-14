import Misc from "@/utils/misc"

export function checkSpriteData(value: Record<string, any>): Record<string, any> {
    let data = Misc.deepClone(value)
    if (typeof data === "object" && data !== null) {
        if (!("sections" in data)) data.sections = {}
        if (!("settings" in data)) data.settings = {}
        if (!("ids" in data)) data.ids = {}
    } else {
        data = { settings: {}, sections: {}, ids: {} }
    }
    return data
}
