import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'filter',
  initialState: '',
  reducers: { filter: (state, { payload }) => payload },
});

export const { filter } = actions;

export default reducer;
