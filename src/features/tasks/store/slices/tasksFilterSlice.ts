import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Filter = 'all' | 'done' | 'active';

interface TasksFilterState {
  filter: Filter;
}

const initialState: TasksFilterState = {
  filter: 'all'
};

const tasksFilterSlice = createSlice({
  name: 'taskFilter',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    }
  }
});

export const { setFilter } = tasksFilterSlice.actions;
export default tasksFilterSlice.reducer;
