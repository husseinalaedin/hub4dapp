import { createSlice } from '@reduxjs/toolkit'
 
interface ActiveNav {
    active: any,
    current_nav:any
}
const initialState: ActiveNav = {
    active: '',
    current_nav:'MAIN'
}
export const activeNavSlice = createSlice({
    name: 'navactive',
    initialState,
    reducers: {

        changeActive: (state, val) => {
            if (val.payload != '') {
                state.active = val.payload
            }
        },
        changeNav: (state, val) => {
            if (val.payload != '') {
                state.current_nav = val.payload
            }
        }
    }
})
export const selectActive = (state) => {
    if (state && state.navactive && state.navactive.active)
        return state.navactive.active
    return ''
}
export const selectCurrentNav = (state) => {
    if (state && state.navactive && state.navactive.active)
        return state.navactive.current_nav
    return ''
}
export const navIsMain = (state) => {
    if (state && state.navactive && state.navactive.current_nav)
        return state.navactive.current_nav == 'MAIN' || state.navactive.current_nav == ''
    return false
}
export const navIsAI = (state) => {
    if (state && state.navactive && state.navactive.current_nav)
        return state.navactive.current_nav == 'AI'
    return false
}
export const { changeActive, changeNav } = activeNavSlice.actions
export default activeNavSlice.reducer