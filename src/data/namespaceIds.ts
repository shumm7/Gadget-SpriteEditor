const config = mw.config.get("wgNamespaceIds")

const GetID = (key: string, def: number) => {
    const n = config[key]
    return typeof n === "number" ? n : def
}

const NamespaceIds: Record<string, number> = {
    media: GetID("media", -2),
    special: GetID("special", -1),
    article: GetID("", 0),
    talk: GetID("talk", 1),
    article_talk: GetID("talk", 1),
    user: GetID("user", 2),
    user_talk: GetID("user_talk", 3),
    project: GetID("project", 4),
    project_talk: GetID("project_talk", 5),
    file: GetID("file", 6),
    image: GetID("image", 6),
    file_talk: GetID("file_talk", 7),
    image_talk: GetID("image_talk", 7),
    mediawiki: GetID("mediawiki", 8),
    mediawiki_talk: GetID("mediawiki_talk", 9),
    template: GetID("template", 10),
    template_talk: GetID("template_talk", 11),
    help: GetID("help", 12),
    help_talk: GetID("help_talk", 13),
    category: GetID("category", 14),
    category_talk: GetID("category_talk", 15),
    module: GetID("module", 828),
    module_talk: GetID("module_talk", 829),
} as const

export default NamespaceIds
