import {
    FILTER_BY,
    FILTER_BY_BRAND,
    FILTER_BY_CATEGORY,
    FILTER_BY_PRICE,
} from '@/redux/slice/filterSlice';
import {
    selectMaxPrice,
    selectMinPrice,
    selectProducts,
} from '@/redux/slice/productSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './ProductFilter.module.scss';
import priceFormat from '@/utils/priceFormat';
import Button from '@/components/button/Button';

const ProductFilter = () => {
    const [category, setCategory] = useState('All');
    const [brand, setBrand] = useState('All');
    const [price, setPrice] = useState(1000000);
    const products = useSelector(selectProducts);
    const minPrice = useSelector(selectMinPrice);
    const maxPrice = useSelector(selectMaxPrice);
    const dispatch = useDispatch();

    // filtering by category
    // 해당 카테고리에 상품이 있는 카테고리만 출력
    const allCategories = [
        'All',
        ...new Set(products.map((product) => product.category)),
    ];
    // console.log('allCategories: ', allCategories);

    const filterCategories = (cate: string) => {
        setCategory(cate);
    };

    // filtering by brand
    // Set은 카테고리 중복 제거
    const allBrands = [
        'All',
        ...new Set(products.map((product) => product.brand)),
    ];
    // console.log('allBrands: ', allBrands);

    // useEffect(() => {
    //     dispatch(FILTER_BY_BRAND({ products, brand }));
    // }, [dispatch, products, brand]);

    // useEffect(() => {
    //   dispatch(FILTER_BY_PRICE({ products, price }));
    // }, [dispatch, products, price]);

    // FILTER_BY로 filter 통합
    useEffect(() => {
        dispatch(FILTER_BY({ products, category, brand, price }));
    }, [dispatch, products, category, brand, price]);

    const clearFilters = () => {
        setCategory('All');
        setBrand('All');
        setPrice(maxPrice);
    };

    return (
        <div className={styles.filter}>
            <h4>카테고리</h4>
            <div className={styles.category}>
                {allCategories.map((cate, index) => {
                    return (
                        <button
                            key={index}
                            type="button"
                            className={
                                `${category}` === cate ? `${styles.active}` : ''
                            }
                            onClick={() => filterCategories(cate)}
                        >
                            &#8250; {cate}
                        </button>
                    );
                })}
            </div>

            <h4>브랜드</h4>
            <div className={styles.brand}>
                <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                >
                    {allBrands.map((brand, index) => {
                        return (
                            <option value={brand} key={index}>
                                {brand}
                            </option>
                        );
                    })}
                </select>
            </div>

            <h4>가격</h4>
            <p> {priceFormat(Number(price))}원 </p>
            <div className={styles.price}>
                <input
                    type="range"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min={minPrice}
                    max={maxPrice}
                />
            </div>

            <br />

            <Button onClick={clearFilters}>필터 초기화</Button>
        </div>
    );
};

export default ProductFilter;
