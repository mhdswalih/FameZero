import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Redux/Slice/userSlice";
import storage from "redux-persist/lib/storage";
import adminReducer from "../Redux/Slice/adminSlice"
import userProfileReducer from '../Redux/Slice/ProfileSlice/userProfileSlice' 
import hotelProfileReducer from '../Redux/Slice/ProfileSlice/hotelProfileSlice'
import productReducer from '../Redux/Slice/ProductSlice/productSlice'
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


const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ['id','role','email','isVerified','token'], 
};

const adminPersistConfig = {
  key: "admin", 
  storage,
  whitelist: ['id', 'email','token'], 
};

const userProfilePersistConfig = {
  key: "userProfile", 
  storage,
  whitelist: ['_id','name', 'profilepic', 'phone', 'address', 'city'], 
};
const hotelProfilePersistConfig = {
  key : "hotelProfile",
  storage,
  whitelist : ['_id','userId','name','profilepic','phone','locaton','city','idProof','status']
}
const productPersistConfig = {
  key : 'products',
  storage,
  whitelist : ['_id','productName','price','quantity']
}

// Persisted reducers with separate configs
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedAdminReducer = persistReducer(adminPersistConfig, adminReducer);
const persistedUserProfileReducer = persistReducer(userProfilePersistConfig, userProfileReducer);
const persistedHotelProfileReducer = persistReducer(hotelProfilePersistConfig,hotelProfileReducer)
const persistedProductsReducer = persistReducer(productPersistConfig,productReducer)

// Configure store
const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    admin: persistedAdminReducer,
    userProfile: persistedUserProfileReducer,
    hotelProfile: persistedHotelProfileReducer,
    product : persistedProductsReducer,
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