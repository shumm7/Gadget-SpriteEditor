const root = {
    "canonical-pagename": "スプライトエディタ",
    title: "スプライトエディタ",
    description: "スプライトエディタを使用して、スプライトシート上のデータを編集します。",
    "selector-label": "スプライトシートを編集",
    "selector-instructions": "編集したいページの名前を入力:",
    "selector-extension-error":
        "拡張子は <var>.json</var> である必要があります（<var>.$2</var>）: $1",
    "selector-noextension-error": "拡張子は <var>.json</var> である必要があります: $1",
    "selector-contentmodel-error":
        "コンテンツモデルは <var>$3</var> である必要があります（<var>$2</var>）: $1",
    "selector-namespace-error":
        "名前空間は <var>Module</var> か <var>MediaWiki</var> である必要があります: $1",
    "editor-ids-title": "スプライトデータ",
    "editor-sections-title": "セクション",
    "editor-settings-title": "シート設定",
    "editor-export-title": "エクスポート",
    "settings-unknown-value": "<var>$1</var>",
    "settings-name": "名前",
    "settings-image": "画像",
    "settings-scale": "拡大率",
    "settings-pos": "スプライト位置",
    "settings-size": "スプライトの大きさ (px)",
    "settings-width": "スプライト幅 (px)",
    "settings-height": "スプライト高さ (px)",
    "settings-sheetsize": "画像の横幅 (px)",
    "settings-sheet-width": "画像の横幅 (px)",
    "settings-sheet-height": "画像の高さ (px)",
    "settings-notip": "ツールチップを非表示",
    "settings-classname": "クラス名",
    "settings-class": "追加クラス",
    "settings-image-description":
        "スプライトシートとして利用する画像を、URLかファイル名で指定する（名前空間 <var>File:</var> は不要）。",
    "settings-size-description":
        "各スプライトの高さと横幅を指定します。この値は <var>width</var> と <var>height</var> により上書きされます。",
    "settings-width-description":
        "各スプライトの横幅を指定します。この値は <var>size</var> を上書きします。",
    "settings-height-description":
        "各スプライトの高さを指定します。この値は <var>size</var> を上書きします。",
    "settings-classname-description":
        "スプライトに共通で設定されるHTMLクラスを指定します（例: <code>inv-sprite</code>）。",
    "editor-settings-add": "追加",
    "editor-settings-value-options": "$2：$1",
    "editor-settings-type-string": "文字列",
    "editor-settings-type-number": "数値",
    "editor-settings-type-boolean": "真偽値",
    "editor-canvas-scale": "ズーム倍率: <b>$1%</b>",
    "editor-canvas-selected": "選択中: <b>$1個</b> ($2, $3)",
    "editor-canvas-selected-multiple": "選択中: <b>$1</b>",
} as const
export default root
