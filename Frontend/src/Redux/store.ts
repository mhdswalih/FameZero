import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Redux/Slice/userSlice";
import storage from "redux-persist/lib/storage";
import adminReducer from "../Redux/Slice/adminSlice"
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Persist configuration
const persistConfig = {
  key: "user",
  storage,
};


// Persisted reducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedAdminReducer = persistReducer(persistConfig,adminReducer)
// Configure store
const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    admin:persistedAdminReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
