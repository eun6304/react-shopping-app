import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import useReducer  from "./userSlice";
import storage from "redux-persist/lib/storage";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
import { devToolsEnhancer } from 'redux-devtools-extension';

const rootReducer = combineReducers({
  user: useReducer
})

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer : persistedReducer,
  middleware : getDefaultMiddleware => getDefaultMiddleware(
    {
      serializableCheck : {
        ignoredActions : [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }
  ),
  devTools: false,
  enhancers: [devToolsEnhancer({ realtime: true })],
},
)

export const persistor = persistStore(store);