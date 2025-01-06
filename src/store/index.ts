import { configureStore } from '@reduxjs/toolkit'
import BusyStatus from './features/BusyStatus'
import ScreenStatus from './features/ScreenStatus'
import CurrentSettings from './features/CurrentSettings'
import activeNav from './features/ActiveNav'
import newSessionSlice from './features/AiSessionEvents'
import newAiHintsSlice from './features/AiHints'
import activeAiMessages from './features/AiMessageActive'
import advanceSearchStatus from './features/AdvSearchStatus'
import DateValuesSlice from './features/DateValues'
import DbDataSlice from './features/DbData'

export const store = configureStore({
    reducer: {
        screenstatus: ScreenStatus,
        busystatus: BusyStatus,
        currentsettings: CurrentSettings,
        navactive: activeNav,
        aisessionevents: newSessionSlice,
        aihints: newAiHintsSlice,
        activeaimessage: activeAiMessages,
        advsearchstatus: advanceSearchStatus,
        datevalues: DateValuesSlice,
        dbdata: DbDataSlice
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch