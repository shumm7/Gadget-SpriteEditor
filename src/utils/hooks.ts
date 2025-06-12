/** The list of used hooks. */
const Hooks = {
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
} as const
export default Hooks

export function initHooks() {
    // "mjw.spriteeditor.loaded": Hooks.loadedData
    mw.hook(Hooks.loadedJSONData).add((data, flag) => {
        console.log(data, flag)
        mw.hook(Hooks.loadedData).fire(data, flag, "json")
    })
    mw.hook(Hooks.loadedModuleData).add((data, flag) => {
        console.log(data, flag)
        mw.hook(Hooks.loadedData).fire(data, flag, "module")
    })

    // "mjw.spriteeditor.selected": Hooks.selected
    mw.hook(Hooks.selectedCanvas).add((data) => {
        console.log(data)
        mw.hook(Hooks.selected).fire(data, "canvas")
    })
    mw.hook(Hooks.selectedSprite).add((data) => {
        console.log(data)
        mw.hook(Hooks.selected).fire(data, "sprite")
    })

    // "mjw.spriteeditor.changed.image": Hooks.changedImage
    mw.hook(Hooks.changedImage).add((data) => {
        console.log(data)
    })
}
