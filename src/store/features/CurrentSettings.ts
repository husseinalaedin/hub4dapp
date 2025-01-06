import { createSlice } from '@reduxjs/toolkit'
import { initLang } from '../../global/Misc'

interface CurrentSettings {
    language: string
}
const initialState: CurrentSettings = {
    language: initLang()
}
export const settingsSlice = createSlice({
    name: 'currentsettings',
    initialState,
    reducers: {
        change_language: (state, val) => {
            if (val.payload != '') {
                state.language = val.payload
            }
        }
    }
})
export const selectLanguage = (state:any) => {
    if (state && state.currentsettings && state.currentsettings.language)
        return state.currentsettings.language
    return 'en'
}

export const { change_language } = settingsSlice.actions
export default settingsSlice.reducer