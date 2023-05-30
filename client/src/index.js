import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import authReducer from './state'
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

/*
redux-persist gives us an ability to save Redux store in the Local Storage of the browser. 
Effectively, when you press the refresh page button in your browser, your storage will remain the same. 
Obviously, you can define how many levels or which parts of your store you want to make persistent.

Don't get overwhelm seeing lines 14-38, all these are mentioned redux-persist how to use redux-persit with redux-toolkit
*/
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'

import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';

const persistConfig={ key:"root", storage,version:1}
const persistedReducer=persistReducer(persistConfig,authReducer)
const store=configureStore({
  reducer:persistedReducer,
  middleware: (getDefaultMiddleware)=>
  getDefaultMiddleware({
    serializableCheck:{
      ignoredActions:[ FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER ]                              //will ignore warnings, if any occurs while using persist.
    }
  })
})
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

