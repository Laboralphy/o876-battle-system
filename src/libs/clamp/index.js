function clamp (value, min, max) {
    if (min > max) {
        return clamp(value, max, min)
    }
    return Math.max(min, Math.min(max, value))
}

module.exports = { clamp }
