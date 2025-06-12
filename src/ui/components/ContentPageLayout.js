export default function ContentPageLayout(name, config, label) {
    function P(name, config, label) {
        P.super.call(this, name, config)
    }
    OO.inheritClass(P, OO.ui.PageLayout)
    P.prototype.setupOutlineItem = function () {
        this.outlineItem.setLabel(label)
    }

    return new P(name, config, label)
}
