import { createSlice } from '@reduxjs/toolkit'

interface AiHints {
    lang:'',
    ai_hints: []
}
const initialState: AiHints = {
    lang: '',
    ai_hints: []
}
export const newAiHintsSlice = createSlice({
    name: 'aihints',
    initialState,
    reducers: {

        change_ai_hints: (state, val) => {
            if (val.payload) {
                state.lang = val.payload.lang
                state.ai_hints = val.payload.ai_hints
            }
        },
    }
})
export const selectAiHints = (state) => {
    if (state && state.aihints && state.aihints.ai_hints && state.aihints.ai_hints.length>0)
        return state.aihints
    return null;
}

export const { change_ai_hints } = newAiHintsSlice.actions
export default newAiHintsSlice.reducer;;