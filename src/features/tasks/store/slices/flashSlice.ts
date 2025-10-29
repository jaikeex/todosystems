import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

interface FlashState {
  flashingTaskIds: string[];
}

const initialState: FlashState = {
  flashingTaskIds: []
};

/**
 * Redux is definitely not needed for this, but i wanted to add at least one more slice
 * (since using redux was required) and this seemed like a cool use case.
 */
const flashSlice = createSlice({
  name: 'flash',
  initialState,
  reducers: {
    addFlashTask: (state, action: PayloadAction<string>) => {
      if (!state.flashingTaskIds.includes(action.payload)) {
        state.flashingTaskIds.push(action.payload);
      }
    },

    removeFlashTask: (state, action: PayloadAction<string>) => {
      state.flashingTaskIds = state.flashingTaskIds.filter(
        (id) => id !== action.payload
      );
    }
  }
});

export const { addFlashTask, removeFlashTask } = flashSlice.actions;

export default flashSlice.reducer;

export const selectShouldFlash = (
  state: RootState,
  taskId: string
): boolean => {
  return state.flash?.flashingTaskIds?.includes(taskId) ?? false;
};
