import { createSlice } from '@reduxjs/toolkit'

interface DbDatum {
    lang: '',
    values: []
}

interface DbData {
  curr: DbDatum;
  wtsb: DbDatum;
  privacy: DbDatum;
  uom: DbDatum;
}
const initialState: DbData = {
  curr: {
    lang: "",
    values: [],
  },
  wtsb: {
    lang: "",
    values: [],
  },
  privacy: {
    lang: "",
    values: [],
  },
  uom: {
    lang: "",
    values: [],
  },
};
export const DbDataSlice = createSlice({
  name: "dbdata",
  initialState,
  reducers: {
    change_curr: (state, val) => {
      if (val.payload) {
        state.curr.lang = val.payload.lang;
        state.curr.values = val.payload.values;
      }
    },
    change_wtsb: (state, val) => {
      if (val.payload) {
        state.wtsb.lang = val.payload.lang;
        state.wtsb.values = val.payload.values;
      }
    },
    change_privacy: (state, val) => {
      if (val.payload) {
        state.privacy.lang = val.payload.lang;
        state.privacy.values = val.payload.values;
      }
    },
    change_uom: (state, val) => {
      if (val.payload) {
        state.uom.lang = val.payload.lang;
        state.uom.values = val.payload.values;
      }
    },
  },
});
export const selectCurr = (state) => {
    if (state && state.dbdata && state.dbdata.curr && state.dbdata.curr.values && state.dbdata.curr.values.length > 0)
        return state.dbdata.curr
    return null;
}
export const selectWtsb = (state) => {
    if (state && state.dbdata && state.dbdata.wtsb && state.dbdata.wtsb.values && state.dbdata.wtsb.values.length > 0)
        return state.dbdata.wtsb
    return null;
}
export const selectPrivacy = (state) => {
    if (state && state.dbdata && state.dbdata.privacy && state.dbdata.privacy.values && state.dbdata.privacy.values.length > 0)
        return state.dbdata.privacy
    return null;
}
export const selectUom = (state) => {
  if (
    state &&
    state.dbdata &&
    state.dbdata.uom &&
    state.dbdata.uom.values &&
    state.dbdata.uom.values.length > 0
  )
    return state.dbdata.uom;
  return null;
};
export const { change_curr, change_wtsb, change_privacy,change_uom } = DbDataSlice.actions
export default DbDataSlice.reducer;;