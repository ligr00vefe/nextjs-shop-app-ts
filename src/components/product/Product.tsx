'use client';
import useFetchCollection from '@/hooks/useFetchCollection';
import React, { useEffect, useState } from 'react';
import styles from './Product.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectProducts,
    STORE_PRODUCTS,
    GET_PRICE_RANGE,
} from '@/redux/slice/productSlice';
import Loader from '../loader/Loader';
import ProductList from './productList/ProductList';
import ProductFilter from './productFilter/ProductFilter';

// 임시 데이터
// import productsData from './ProductsData';
// import productReviewsData from './ProductReviewsData';

const Product = () => {
    const { data, isLoading } = useFetchCollection('products');
    // console.log('data: ', data);
    // console.log('productsData: ', productsData);

    // 임시 데이터용 isLoading값
    // const [isLoading, setIsLoading] = useState(false);

    // 불러온 데이터를 redux store에 저장
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            STORE_PRODUCTS({
                products: data,
            })
        );

        dispatch(
            GET_PRICE_RANGE({
                products: data,
            })
        );
    }, [data, dispatch]);

    // redux store에서 component로 가져오기
    const products = useSelector(selectProducts);

    return (
        <section className={styles.product}>
            <aside className={styles.filter}>
                {isLoading ? null : <ProductFilter />}
            </aside>
            <div className={styles.content}>
                {isLoading ? (
                    <Loader basic />
                ) : (
                    <ProductList products={products} />
                )}
            </div>
        </section>
    );
};

export default Product;
