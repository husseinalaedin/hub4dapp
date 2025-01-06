import { createSlice } from '@reduxjs/toolkit'
 
interface ActiveAiMessage {
    stamp: string,
    src: string
    global: boolean,
    object: any,
    id:string,
    src2:string

}
let initialState: ActiveAiMessage = {
    stamp: '',
    src: 'INIT',
    global: false,
    object: null,
    id:'',
    src2:''

}

export const activeAiMessagesSlice = createSlice({
    name: 'activeaimessage',
    initialState,
    reducers: {

        switch_active_message: (state, val) => {
            if (val.payload) {
                // state.session_id = val.payload.session_id
                // state.name = val.payload.name
                // state.ai_model_used = val.payload.ai_model_used,
                state.stamp = val.payload.stamp
                state.src = val.payload.src
                state.global = val.payload.global
                state.object = val.payload.object
                if (val && val.payload && val.payload.object && val.payload.object.id)
                    state.id = val.payload.object.id
                else
                    state.id=''
                state.src2 = val.payload.src2
            }
        },
        on_active_message_do: (state, val) => {
            state.stamp = val.payload.stamp
            state.src = val.payload.src
        }
    }
})
export const selectAiActiveMessage = (state) => {
    if (state && state.activeaimessage)
        return state.activeaimessage
    return null
}

export const { switch_active_message, on_active_message_do } = activeAiMessagesSlice.actions
export default activeAiMessagesSlice.reducer