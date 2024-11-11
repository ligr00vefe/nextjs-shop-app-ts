import { IOrder } from '@/types';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface IOrderState {
    orderHistory: IOrder[];
    totalOrderAmount: null | number;
}

const initialState: IOrderState = {
    orderHistory: [],
    totalOrderAmount: null,
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        STORE_ORDERS: (state, action) => {
            // console.log('action.payload: ', action.payload);
            state.orderHistory = action.payload;
        },
        CALCULATE_TOTAL_ORDER_AMOUNT: (state) => {
            const array: number[] = [];
            state.orderHistory.map((item) => {
                const { orderAmount } = item;
                return array.push(orderAmount);
            });
            // 주문 내역 내 모든 주문 금액을 더함.
            const totalAmount = array.reduce((a, b) => {
                return a + b;
            }, 0);
            state.totalOrderAmount = totalAmount;
        },
    },
});

export const { STORE_ORDERS, CALCULATE_TOTAL_ORDER_AMOUNT } =
    orderSlice.actions;

export const selectOrderHistory = (state: RootState) =>
    state.order.orderHistory;
export const selectTotalOrderAmount = (state: RootState) =>
    state.order.totalOrderAmount;

export default orderSlice.reducer;
