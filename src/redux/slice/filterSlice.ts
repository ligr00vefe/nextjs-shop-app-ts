import { IProduct } from '@/types';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface IFilterState {
    filteredProducts: IProduct[];
}

const initialState: IFilterState = {
    filteredProducts: [],
};

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        FILTER_BY_CATEGORY: (
            state,
            action: { payload: { products: IProduct[]; category: string } }
        ) => {
            // console.log('action.payload: ', action.payload);
            const { products, category } = action.payload;
            let tempProducts = [];
            if (category === 'All') {
                tempProducts = products;
            } else {
                tempProducts = products.filter(
                    (product) => product.category === category
                );
            }
            state.filteredProducts = tempProducts;
        },
        FILTER_BY_BRAND: (
            state,
            action: { payload: { products: IProduct[]; brand: string } }
        ) => {
            // console.log('action.payload: ', action.payload);
            const { products, brand } = action.payload;
            let tempProducts = [];
            if (brand === 'All') {
                tempProducts = products;
            } else {
                tempProducts = products.filter(
                    (product) => product.brand === brand
                );
            }
            state.filteredProducts = tempProducts;
        },
        FILTER_BY_PRICE: (
            state,
            action: { payload: { products: IProduct[]; price: number } }
        ) => {
            // console.log('action.payload: ', action.payload);
            const { products, price } = action.payload;
            let tempProducts = [];
            tempProducts = products.filter(
                (product) => product.price === price
            );

            state.filteredProducts = tempProducts;
        },
        // 위의 FILTER_BY_CATEGORY, FILTER_BY_BRAND, FILTER_BY_PRICE 통합해서 FITER_BY 하나만 사용
        FILTER_BY: (
            state,
            action: {
                payload: {
                    products: IProduct[];
                    category: string;
                    brand: string;
                    price: number;
                };
            }
        ) => {
            // console.log('action.payload: ', action.payload);

            const { products, category, brand, price } = action.payload;
            // console.log('products: ', products);
            // console.log('category: ', category);
            // console.log('brand: ', brand);
            // console.log('price: ', price);

            let tempProducts = [];

            if (category === 'All') {
                tempProducts = products;
            } else {
                tempProducts = products.filter(
                    (product) => product.category === category
                );
            }

            if (brand === 'All') {
                tempProducts = tempProducts;
            } else {
                tempProducts = tempProducts.filter(
                    (product) => product.brand === brand
                );
            }

            tempProducts = tempProducts.filter(
                (product) => product.price <= price
            );

            state.filteredProducts = tempProducts;
        },
        FILTER_BY_SEARCH: (
            state,
            action: { payload: { products: IProduct[]; search: string } }
        ) => {
            // console.log('action.payload: ', action.payload);

            const { products, search } = action.payload;
            // console.log('products: ', products);

            let tempProducts: IProduct[] = [];

            if (search) {
                tempProducts = products.filter((product) =>
                    product.name.includes(search)
                );
            }

            state.filteredProducts = tempProducts;
        },
        SORT_PRODUCTS: (
            state,
            action: { payload: { products: IProduct[]; sort: string } }
        ) => {
            // console.log('action.payload: ', action.payload);
            const { products, sort } = action.payload;

            let tempProducts: IProduct[] = [];
            if (sort === 'latest') {
                tempProducts = products;
            }

            if (sort === 'lowest-price') {
                tempProducts = products.slice().sort((a, b) => {
                    return a.price - b.price;
                });
            }

            if (sort === 'highest-price') {
                tempProducts = products.slice().sort((a, b) => {
                    return b.price - a.price;
                });
            }

            state.filteredProducts = tempProducts;
        },
    },
});

export const {
    FILTER_BY_CATEGORY,
    FILTER_BY_BRAND,
    FILTER_BY_PRICE,
    FILTER_BY,
    FILTER_BY_SEARCH,
    SORT_PRODUCTS,
} = filterSlice.actions;

export const selectFilteredProducts = (state: RootState) =>
    state.filter.filteredProducts;

export default filterSlice.reducer;
