// src/Reducers/Reducers.js
import {
  FETCH_ROOMS_REQUEST,
  FETCH_ROOMS_SUCCESS,
  FETCH_ROOMS_FAILURE,
  SET_SORT_OPTION,
  SET_DATE,
  SET_TIME,
  SET_LOADING,
} from '../Actions/ActionType';

const initialState = {
  rooms: [],
  loading: false,
  error: null,
  sortOption: null,
  date: new Date(),
  time: new Date(),
};

export const roomsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ROOMS_REQUEST:
      return { ...state, loading: true };
    case FETCH_ROOMS_SUCCESS:
      return { ...state, loading: false, rooms: action.payload };
    case FETCH_ROOMS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case SET_SORT_OPTION: {
      const isRoomAvailable = (room: Room): boolean => {
        const now = new Date();
        const compareTime = state.time.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        return room.availability[compareTime] === '1';
      };
      let sortedRooms = [...state.rooms];
      const criteria = action.payload;
      if (criteria === 'Level') {
        sortedRooms.sort((a, b) => a.level - b.level);
      } else if (criteria === 'Capacity') {
        sortedRooms.sort((a, b) => a.capacity - b.capacity);
      } else if (criteria === 'Availability') {
        sortedRooms.sort((a, b) => isRoomAvailable(b) - isRoomAvailable(a));
      }

      state.rooms = sortedRooms;
      return { ...state, sortOption: action.payload };
    }
    case SET_DATE:
      return { ...state, date: action.payload };
    case SET_TIME:
      return { ...state, time: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};
