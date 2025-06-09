export const HOOKS = {
    loadedData: "mjw.spriteeditor.loaded",
    loadedJSONData: "mjw.spriteeditor.loaded.json",
    loadedModuleData: "mjw.spriteeditor.loaded.module",
    changedImage: "mjw.spriteeditor.changed.image",
    selected: "mjw.spriteeditor.selected",
    selectedSprite: "mjw.spriteeditor.selected.sprite",
    selectedCanvas: "mjw.spriteeditor.selected.canvas",
}

export function initHooks() {
    mw.hook(HOOKS.loadedJSONData).add((data, flag) => {
        console.log(data, flag)
        mw.hook(HOOKS.loadedData).fire(data, flag, "json")
    })
    mw.hook(HOOKS.loadedModuleData).add((data, flag) => {
        console.log(data, flag)
        mw.hook(HOOKS.loadedData).fire(data, flag, "module")
    })
    mw.hook(HOOKS.selectedCanvas).add((data) => {
        console.log(data)
        mw.hook(HOOKS.selected).fire(data, "canvas")
    })
    mw.hook(HOOKS.selectedSprite).add((data) => {
        console.log(data)
        mw.hook(HOOKS.selected).fire(data, "sprite")
    })
    mw.hook(HOOKS.changedImage).add((data) => {
        console.log(data)
    })
}
