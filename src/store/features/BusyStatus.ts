import { createSlice } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux';
// import type { RootState } from '../../app/store'

// Define a type for the slice state
interface BusyStatus {
    isBusy: boolean
}

// Define the initial state using that type
const initialState: BusyStatus = {
    isBusy: false
}

export const busyStatusSlice = createSlice({
    name: 'busystatus',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        busy: state => {
            state.isBusy = true
        },
        free: state => {
            state.isBusy = false
        },
        toggle: state => {
            state.isBusy = !state.isBusy
        },
        update_busy: (state, small) => {
            state.isBusy = small.payload
        }
    }
})
export const selectIsBusy = (state) => state.busystatus.isBusy

export const { toggle, update_busy } = busyStatusSlice.actions
// export const { toggle_samll } = navStatusSlice.actions

// export const update_small = (small: boolean): => (dispatch: Dispatch<AnyAction>): Dispatch<AnyAction> => {
//    return dispatch(update_small2(small))
// }

export default busyStatusSlice.reducer