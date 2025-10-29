import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Filter } from '@/tasks/types';

interface TasksFilterState {
  filter: Filter;
}

const initialState: TasksFilterState = {
  filter: 'all'
};

const tasksFilterSlice = createSlice({
  name: 'tasksFilter',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    }
  }
});

export const { setFilter } = tasksFilterSlice.actions;
export default tasksFilterSlice.reducer;
