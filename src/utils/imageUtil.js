export const getPositionImageUrl = (name) => {
    return new URL(`../containers/HomePage/img/${name}.svg`, import.meta.url).href
}
