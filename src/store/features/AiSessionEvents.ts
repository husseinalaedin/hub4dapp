import { createSlice } from '@reduxjs/toolkit'
 
// import type { RootState } from '../../app/store'

// Define a type for the slice state
// const currentSessionSelected:any={

// }
interface CurrentSessionData {
    // session_id: string,
    // name:string,
    // ai_model_used:string,
    src:string,
    session_object:any
}
let initialState: CurrentSessionData = {
    // session_id: '',
    // name: '',
    // ai_model_used:'',
    src:'',
    session_object:{}
}

export const currentSessionSlice = createSlice({
    name: 'aisessionevents',
    initialState,
    reducers: {

        current_session_changed: (state, val) => {
            if (val.payload) {
                // state.session_id = val.payload.session_id
                // state.name = val.payload.name
                // state.ai_model_used = val.payload.ai_model_used,
                state.src = val.payload.src,
                state.session_object = val.payload.session_object
            }
        }
    }
})
export const selectSession = (state) => {
    if (state && state.aisessionevents && state.aisessionevents.session_object && state.aisessionevents.session_object.session_id !='')
        return state.aisessionevents
    return null
}

export const { current_session_changed } = currentSessionSlice.actions
export default currentSessionSlice.reducer