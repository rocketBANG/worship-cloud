enum ModelState {
    LOADING,
    LOADED,
    UNLOADED,
    ERROR,
    DIRTY,
    SAVING
}

export const StateToString = (state: ModelState): string => {
    if(state === ModelState.LOADED) {
        return "Saved";
    } else if (state === ModelState.LOADING) {
        return "Loading";
    } else if (state === ModelState.ERROR) {
        return "Error";
    } else if (state === ModelState.UNLOADED) {
        return "Unloaded";
    } else if (state === ModelState.DIRTY) {
        return "Dirty";
    } else if (state === ModelState.SAVING) {
        return "Saving";
    }
}

export { ModelState };