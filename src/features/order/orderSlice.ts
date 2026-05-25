import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { API_BASE_URL } from '@utils/constants';

type OrderResponse = {
  name: string;
  order: { number: number };
  success: boolean;
};

type OrderState = {
  number: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: OrderState = {
  number: null,
  status: 'idle',
  error: null,
};

export const createOrder = createAsyncThunk<string, string[], { rejectValue: string }>(
  'order/create',
  async (ingredients, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });

      if (!res.ok)
        return rejectWithValue(`Ошибка запроса: ${res.status} ${res.statusText}`);

      const body = (await res.json()) as OrderResponse;
      if (!body?.success || !body.order || typeof body.order.number !== 'number') {
        return rejectWithValue('Некорректный ответ от сервера при создании заказа');
      }

      return String(body.order.number);
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Неизвестная ошибка при создании заказа'
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.number = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.number = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Ошибка создания заказа';
      });
  },
});

export default orderSlice.reducer;
