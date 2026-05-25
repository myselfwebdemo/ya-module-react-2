import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types';

const selectedIngredientSlice = createSlice({
  name: 'selectedIngredient',
  initialState: null as TIngredient | null,
  reducers: {
    selectIngredient: (_state, action: PayloadAction<TIngredient>) => action.payload,
    clearSelectedIngredient: () => null,
  },
});

export const { selectIngredient, clearSelectedIngredient } =
  selectedIngredientSlice.actions;

export default selectedIngredientSlice.reducer;
