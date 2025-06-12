/** The list of used hooks. */
export const HOOKS = {
    /** When sprite data was loaded. */
    loadedData: "mjw.spriteeditor.loaded",

    /** When sprite data in JSON format was loaded. */
    loadedJSONData: "mjw.spriteeditor.loaded.json",

    /** When sprite data in Scribunto (Lua) module was loaded. */
    loadedModuleData: "mjw.spriteeditor.loaded.module",

    /** When sprite image was loaded. */
    changedImage: "mjw.spriteeditor.changed.image",

    /** When sprite was selected. */
    selected: "mjw.spriteeditor.selected",

    /** When sprite was selected on Editor. */
    selectedSprite: "mjw.spriteeditor.selected.sprite",

    /** When sprite was selected on Canvas. */
    selectedCanvas: "mjw.spriteeditor.selected.canvas",
}

/** Initialize hooks */
export function initHooks() {
    // "mjw.spriteeditor.loaded": HOOKS.loadedData
    mw.hook(HOOKS.loadedJSONData).add((data, flag) => {
        console.log(data, flag)
        mw.hook(HOOKS.loadedData).fire(data, flag, "json")
    })
    mw.hook(HOOKS.loadedModuleData).add((data, flag) => {
        console.log(data, flag)
        mw.hook(HOOKS.loadedData).fire(data, flag, "module")
    })

    // "mjw.spriteeditor.selected": HOOKS.selected
    mw.hook(HOOKS.selectedCanvas).add((data) => {
        console.log(data)
        mw.hook(HOOKS.selected).fire(data, "canvas")
    })
    mw.hook(HOOKS.selectedSprite).add((data) => {
        console.log(data)
        mw.hook(HOOKS.selected).fire(data, "sprite")
    })

    // "mjw.spriteeditor.changed.image": HOOKS.changedImage
    mw.hook(HOOKS.changedImage).add((data) => {
        console.log(data)
    })
}
