import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Filter = 'all' | 'done' | 'active';

interface TaskFilterState {
  filter: Filter;
}

const initialState: TaskFilterState = {
  filter: 'all'
};

const taskFilterSlice = createSlice({
  name: 'taskFilter',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    }
  }
});

export const { setFilter } = taskFilterSlice.actions;
export default taskFilterSlice.reducer;
