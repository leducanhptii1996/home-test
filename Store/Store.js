// src/Store/Store.js
import { roomsReducer } from '../Reducers/Reducers';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    rooms: roomsReducer
  },
});

export default store;
