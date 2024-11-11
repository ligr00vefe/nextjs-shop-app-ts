import { IProduct, TCartItem } from '@/types';
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { RootState } from '../store';

interface ICartState {
    cartItems: TCartItem[];
    cartTotalQuantity: number;
    cartTotalAmount: number;
    previousURL: string;
}

const initialState: ICartState = {
    cartItems:
        typeof window !== 'undefined'
            ? localStorage.getItem('cartItems')
                ? JSON.parse(localStorage.getItem('cartItems')!)
                : []
            : [],
    cartTotalQuantity: 0, // 장바구니에 담긴 상품 총 개수 - represents the total number in out cart
    cartTotalAmount: 0, // 장바구니 내 상품 총 가격 - total value of every thing in the cart
    previousURL: '',
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        ADD_TO_CART: (state, action) => {
            // console.log('action.payload: ', action.payload);
            const productIndex = state.cartItems.findIndex(
                // 장바구니에 상품이 있으면 해당 인덱스를 반환하고
                // 상품이 없으면 인덱스로  -1을 반환
                (item) => item.id === action.payload.id
            );
            // console.log('action: ', action);

            const increaseCount = action.payload.quantity
                ? action.payload.quantity
                : 1;

            if (productIndex >= 0) {
                // item already exists in cart
                // increase the cart quantity
                // 상품이 이미 장바구니에 추가되어있으면 cartQuantity만 증가해줌.
                state.cartItems[productIndex].cartQuantity += increaseCount;

                toast.info(
                    `${action.payload.name} 상품이 하나 추가되었습니다.`,
                    {
                        position: 'top-left',
                    }
                );
            } else {
                // item does not exist in the cart
                // add item to the cart
                // 장바구니에 등록되지 않은 상품이면 상품과 cartQuantity를 둘 다 추가해줌.
                const tempProduct = {
                    ...action.payload,
                    cartQuantity: increaseCount,
                };
                state.cartItems.push(tempProduct);
                toast.success(
                    `${action.payload.name} 상품이 장바구니에 추가되었습니다.`,
                    {
                        position: 'top-left',
                    }
                );
            }
            // save cart to local storage
            // NOTE when you want to save some thing in the local storage you use JSON.stringify
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        DECREASE_TO_CART: (state, action) => {
            // console.log('action.payload: ', action.payload);
            const productIndex = state.cartItems.findIndex(
                (item) => item.id === action.payload.id
            );
            if (state.cartItems[productIndex].cartQuantity > 1) {
                // if product exists, decrease it by one
                // 한 개 이상이 등록되어 있을 때는 카운트만 -1
                state.cartItems[productIndex].cartQuantity -= 1;
                toast.info(`${action.payload.name} product decreased by one`, {
                    position: 'top-left',
                });
            } else if (state.cartItems[productIndex].cartQuantity === 1) {
                // delete the product from the cart
                // 마지막 한 개의 상품을 빼려고 할 때는 해당 상품 삭제
                const newCartItem = state.cartItems.filter(
                    // 해당 상품과 id가 일치 하지 않는 상품들로 새 배열 생성.
                    (item) => item.id !== action.payload.id
                );
                state.cartItems = newCartItem;
                toast.success(`${action.payload.name} removed from Cart`, {
                    position: 'top-left',
                });
            }
            // update the cartItems in the local storage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        CALCULATE_TOTAL_QUANTITY: (state) => {
            const array: number[] = [];
            state.cartItems.map((item) => {
                const { cartQuantity } = item;

                const quantity = cartQuantity;
                return array.push(quantity);
            });
            const totalQuantity = array.reduce((a, b) => {
                return a + b;
            }, 0);
            // console.log('totalAmount: ', totalAmount);
            state.cartTotalQuantity = totalQuantity;
        },
        CALCULATE_SUBTOTAL: (state) => {
            // console.log('action.payload: ', action.payload);
            const array: number[] = [];
            state.cartItems.map((item) => {
                const { price, cartQuantity } = item;

                const cartItemAmount = price * cartQuantity;
                return array.push(cartItemAmount);
            });
            const totalAmount = array.reduce((a, b) => {
                return a + b;
            }, 0);
            // console.log('totalAmount: ', totalAmount);
            state.cartTotalAmount = totalAmount;
        },
        REMOVE_FROM_CART: (state, action) => {
            // console.log('action.payload: ', action.payload);
            const newCartItem = state.cartItems.filter(
                (item) => item.id !== action.payload.id
            );
            state.cartItems = newCartItem;
            toast.success(`${action.payload.name} removed from cart`, {
                position: 'top-left',
            });

            // update the cartItems in the local storage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        CLEAR_CART: (state) => {
            // console.log('action.payload: ', action.payload);
            // 장바구니 배열을 빈 배열로 초기화
            state.cartItems = [];
            toast.info(` Cart cleared`, {
                position: 'top-left',
            });

            // update the cartItems in the local storage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        SAVE_URL: (state, action) => {
            // console.log('action.payload: ', action.payload);
            state.previousURL = action.payload;
        },
    },
});

export const {
    ADD_TO_CART,
    DECREASE_TO_CART,
    CALCULATE_TOTAL_QUANTITY,
    CALCULATE_SUBTOTAL,
    REMOVE_FROM_CART,
    CLEAR_CART,
    SAVE_URL,
} = cartSlice.actions;

// exporting valuables that will point all of those up cart states
export const selectCartItems = (state: RootState) => state.cart.cartItems;
export const selectCartTotalQuantity = (state: RootState) =>
    state.cart.cartTotalQuantity;
export const selectCartTotalAmount = (state: RootState) =>
    state.cart.cartTotalAmount;
export const selectPreviousURL = (state: RootState) => state.cart.previousURL;

export default cartSlice.reducer;
