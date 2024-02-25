import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer =  combineReducers({user: userReducer});

// persistConfig is setting the name of the key in the local storage, the version and the storage type
const persistConfig = {
    key: 'root',
    storage,
    version: 1,

}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
        serializableCheck: false,
    }),
});

// persistor is used to persist the state of the store
export const persistor = persistStore(store);