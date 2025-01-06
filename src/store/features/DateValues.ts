import { createSlice } from '@reduxjs/toolkit'

interface DateValues {
    lang:'',
    last_x_datetime: []
}
const initialState: DateValues = {
    lang: '',
    last_x_datetime: []
}
export const DateValuesSlice = createSlice({
    name: 'datevalues',
    initialState,
    reducers: {

        change_last_x_datetime: (state, val) => {
            if (val.payload) {
                state.lang = val.payload.lang;
                state.last_x_datetime = val.payload.last_x_datetime
            }
        },
    }
})
export const selectDateLastXDateTime = (state) => {
    if (state && state.datevalues && state.datevalues.last_x_datetime && state.datevalues.last_x_datetime.length > 0)
        return state.datevalues
    return null;
}

export const { change_last_x_datetime } = DateValuesSlice.actions
export default DateValuesSlice.reducer;;