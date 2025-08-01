import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Redux/Slice/userSlice";
import storage from "redux-persist/lib/storage";
import adminReducer from "../Redux/Slice/adminSlice"
import userProfileReducer from '../Redux/Slice/ProfileSlice/userProfileSlice' 
import hotelProfileReducer from '../Redux/Slice/ProfileSlice/hotelProfileSlice'
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

// Separate persist configurations for each reducer
const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ['id', 'email', 'isAuthenticated'], 
};

const adminPersistConfig = {
  key: "admin", 
  storage,
  whitelist: ['id', 'email', 'isAuthenticated'], 
};

const userProfilePersistConfig = {
  key: "userProfile", 
  storage,
  whitelist: ['name', 'profilepic', 'phone', 'address', 'city'], 
};
const hotelProfilePersistConfig = {
  key : "hotelProfile",
  storage,
  whitelist : ['name','profilepic','phone','locaton','city','idProof']
}

// Persisted reducers with separate configs
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedAdminReducer = persistReducer(adminPersistConfig, adminReducer);
const persistedUserProfileReducer = persistReducer(userProfilePersistConfig, userProfileReducer);
const persistedHotelProfileReducer = persistReducer(hotelProfilePersistConfig,hotelProfileReducer)

// Configure store
const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    admin: persistedAdminReducer,
    userProfile: persistedUserProfileReducer,
    hotelProfile: persistedHotelProfileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production', 
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;