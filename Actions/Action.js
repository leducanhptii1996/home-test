import {
  FETCH_ROOMS_REQUEST,
  FETCH_ROOMS_SUCCESS,
  FETCH_ROOMS_FAILURE,
  SET_SORT_OPTION,
  SET_DATE,
  SET_TIME,
  SET_LOADING,
} from './ActionType';

// Action to fetch rooms
export const fetchRoomsRequest = () => ({
  type: FETCH_ROOMS_REQUEST,
});

export const fetchRoomsSuccess = (rooms) => ({
  type: FETCH_ROOMS_SUCCESS,
  payload: rooms,
});

export const fetchRoomsFailure = (error) => ({
  type: FETCH_ROOMS_FAILURE,
  payload: error,
});

// Action to set the sort option
export const setSortOption = (option) => ({
  type: SET_SORT_OPTION,
  payload: option,
});

// Action to set the selected date
export const setDate = (date) => ({
  type: SET_DATE,
  payload: date,
});

// Action to set the selected time
export const setTime = (time) => ({
  type: SET_TIME,
  payload: time,
});

// Action to set loading state
export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

// Thunk to fetch rooms from API
export const fetchRooms = () => async (dispatch) => {
  dispatch(fetchRoomsRequest());
  try {
    const response = await fetch('https://gist.githubusercontent.com/yuhong90/7ff8d4ebad6f759fcc10cc6abdda85cf/raw/463627e7d2c7ac31070ef409d29ed3439f7406f6/room-availability.json');
    const data = await response.json();
    const transformedRooms = data.map((room) => ({
      name: room.name || 'Unknown',
      capacity: room.capacity || '0',
      level: room.level || '0',
      availability: room.availability || {},
    }));
    dispatch(fetchRoomsSuccess(transformedRooms));
  } catch (err) {
    dispatch(fetchRoomsFailure('Failed to load data.'));
    console.error('Failed to fetch data:', err);
  }
};
