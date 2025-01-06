import { createSlice } from '@reduxjs/toolkit'
// import type { RootState } from '../../app/store'

// Define a type for the slice state
interface AdvSearchStatus {
    isOpen: boolean
}

// Define the initial state using that type
const initialState: AdvSearchStatus = {
    isOpen: false
}

export const busyStatusSlice = createSlice({
    name: 'advsearchstatus',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        changeAdvSearchStatus: (state, val) => {
            state.isOpen = !!val.payload
        }
    }
})
export const selectAdvSearchStatus = (state) => state.advsearchstatus.isOpen

export const { changeAdvSearchStatus } = busyStatusSlice.actions
export default busyStatusSlice.reducer