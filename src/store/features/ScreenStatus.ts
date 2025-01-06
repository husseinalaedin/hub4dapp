import { createSlice } from "@reduxjs/toolkit";
// import type { RootState } from '../../app/store'

// Define a type for the slice state
export const screenBreaks = {
  small: 800,
  medium: 1000,
  large: 1200,
  xlarge: 1610,
};
interface ScreenStatus {
  opened: boolean;
  openedAi: boolean;
  small: boolean;
  medium: boolean;
  large: boolean;
  xlarge: boolean;
  xlarger: boolean;
  // restrictWidthLargeScreen:boolean
  /*restrict the body of the main screen in case large to 900px, 
        the main purpose is to controle when to use the whole screen and when not,
        e.g when we need a lot of information to show, we can remove the restriction(board info)
    */
}
const WINDOW: any = typeof window !== "undefined" ? window : { };
// Define the initial state using that type
const initialState: ScreenStatus = {
  opened: WINDOW.innerWidth > screenBreaks.small,
  openedAi: WINDOW.innerWidth > screenBreaks.small,
  small: WINDOW.innerWidth <= screenBreaks.small,
  medium:
    WINDOW.innerWidth > screenBreaks.small &&
    WINDOW.innerWidth <= screenBreaks.medium,
  large:
    WINDOW.innerWidth > screenBreaks.medium &&
    WINDOW.innerWidth <= screenBreaks.large,
  xlarge:
    WINDOW.innerWidth > screenBreaks.large &&
    WINDOW.innerWidth <= screenBreaks.xlarge,
  xlarger: WINDOW.innerWidth > screenBreaks.xlarge,
  // restrictWidthLargeScreen:false
};

export const screenStatusSlice = createSlice({
  name: "screenstatus",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    open: (state) => {
      state.opened = true;
    },
    close: (state) => {
      state.opened = false;
    },
    toggle: (state) => {
      state.opened = !state.opened;
    },

    openAi: (state) => {
      state.openedAi = true;
    },
    closeAi: (state) => {
      state.openedAi = false;
    },
    toggleAi: (state) => {
      state.openedAi = !state.openedAi;
    },

    update_small: (state, small) => {
      state.small = small.payload;
    },
    update_medium: (state, medium) => {
      state.medium = medium.payload;
    },
    update_large: (state, large) => {
      state.large = large.payload;
    },
    update_xlarge: (state, xlarge) => {
      state.xlarge = xlarge.payload;
    },
    update_xlarger: (state, xlarger) => {
      state.xlarger = xlarger.payload;
    },
    // restrictLargeScreenWidth: state => {
    //     state.restrictWidthLargeScreen = true
    // },
    // removeRestrictLargeScreenWidth: state => {
    //     state.restrictWidthLargeScreen = false
    // },
  },
});
export const selectOpened = (state: any) => state.screenstatus.opened;
export const selectOpenedAi = (state: any) => state.screenstatus.openedAi;

export const selectSmall = (state: any) => state.screenstatus.small;
export const selectMedium = (state: any) => state.screenstatus.medium;
export const selectLarge = (state: any) => state.screenstatus.large;
export const selectxLarge = (state: any) => state.screenstatus.xlarge;
export const selectxLarger = (state: any) => state.screenstatus.xlarger;
export const selectRestrictWidthLargeScreen = (state: any) =>
  state.screenstatus.restrictWidthLargeScreen;

export const {
  open,
  close,
  toggle,
  openAi,
  closeAi,
  toggleAi,
  update_small,
  update_medium,
  update_large,
  update_xlarge,
  update_xlarger,
} = screenStatusSlice.actions;
// export const { toggle_samll } = screenstatusSlice.actions

// export const update_small = (small: boolean): => (dispatch: Dispatch<AnyAction>): Dispatch<AnyAction> => {
//    return dispatch(update_small2(small))
// }

export default screenStatusSlice.reducer;
