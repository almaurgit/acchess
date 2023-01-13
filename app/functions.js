export function validCoordinate(coordinate) {
    if (typeof coordinate !== 'string') {
        throw new Error("The square is not in string format")
    }
    const squareRegex = /^[a-z]\d\d?$/
    if (!squareRegex.test(coordinate)) {
        throw new Error("The square is not in a good format (example : g2)")
    }
    return true
}