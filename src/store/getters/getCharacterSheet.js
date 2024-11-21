module.exports = (state, getters) => {
    return {
        id: state.id,
        specie: state.specie,
        race: state.race,
        classType: state.classType,
        level: {
            value: 0
        }
    }
}