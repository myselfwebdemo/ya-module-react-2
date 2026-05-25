import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { API_BASE_URL } from '@utils/constants';

import type { TIngredient } from '@utils/types';

type IngredientsState = {
  items: TIngredient[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: IngredientsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ingredients`);
    if (!response.ok)
      return rejectWithValue(
        `Ошибка запроса: ${response.status} ${response.statusText}`
      );

    const body = (await response.json()) as { success: boolean; data: TIngredient[] };
    if (!body?.success || !Array.isArray(body.data))
      return rejectWithValue('Получены некорректные данные от сервера');

    return body.data;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Неизвестная ошибка');
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Ошибка загрузки';
      });
  },
});

export default ingredientsSlice.reducer;
