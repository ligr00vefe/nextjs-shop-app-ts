import {
    selectFilteredProducts,
    SORT_PRODUCTS,
} from '@/redux/slice/filterSlice';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ProductList.module.scss';
import ProductItem from '../productItem/ProductItem';
import Pagination from '@/components/pagination/Pagination';
import { IProduct } from '@/types';

interface IProductListProps {
    products: IProduct[];
}

const ProductList = ({ products }: IProductListProps) => {
    const [sort, setSort] = useState('latest');

    const filteredProducts = useSelector(selectFilteredProducts);

    const dispatch = useDispatch();

    // sorting product
    useEffect(() => {
        dispatch(SORT_PRODUCTS({ products, sort }));
    }, [dispatch, products, sort]);

    // PAGINATION states
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(3);

    // get current products
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFastProduct = indexOfLastProduct - productsPerPage;
    // 얕은 복사로 배열이 생성됨.
    const currentProducts = filteredProducts.slice(
        indexOfFastProduct,
        indexOfLastProduct
    );

    const isRadioSelected = (value: string) => sort === value;
    const handleRadioClick = (e: ChangeEvent<HTMLInputElement>) =>
        setSort(e.target.value);

    return (
        <div className={styles.productList}>
            <div className={styles.top}>
                <div>
                    <ul className={styles.sort}>
                        <li
                            className={
                                isRadioSelected('latest') ? styles.selected : ''
                            }
                        >
                            <input
                                type="radio"
                                value="latest"
                                id="latest"
                                checked={isRadioSelected('latest')}
                                onChange={handleRadioClick}
                            />
                            <label htmlFor="latest">최신순</label>
                        </li>
                        <li
                            className={
                                isRadioSelected('lowest-price')
                                    ? styles.selected
                                    : ''
                            }
                        >
                            <input
                                type="radio"
                                value="lowest-price"
                                id="lowest-price"
                                checked={isRadioSelected('lowest-price')}
                                onChange={handleRadioClick}
                            />
                            <label htmlFor="lowest-price">낮은가격순</label>
                        </li>
                        <li
                            className={
                                isRadioSelected('highest-price')
                                    ? styles.selected
                                    : ''
                            }
                        >
                            <input
                                type="radio"
                                value="highest-price"
                                id="highest-price"
                                checked={isRadioSelected('highest-price')}
                                onChange={handleRadioClick}
                            />
                            <label htmlFor="highest-price">높은가격순</label>
                        </li>
                    </ul>
                </div>

                <div className={styles.limit}>
                    <select
                        value={productsPerPage}
                        onChange={(e) => setProductsPerPage(e.target.value)}
                    >
                        <option value={3}>3개씩 보기</option>
                        <option value={10}>10개씩 보기</option>
                        <option value={30}>30개씩 보기</option>
                        <option value={50}>50개씩 보기</option>
                    </select>
                </div>
            </div>

            <div className={styles.grid}>
                {products.length === 0 ? (
                    <p>상품이 없습니다.</p>
                ) : (
                    <>
                        {currentProducts.map((product) => {
                            return (
                                <div key={product.id}>
                                    <ProductItem {...product} />
                                </div>
                            );
                        })}
                    </>
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalProducts={filteredProducts.length}
                productsPerPage={productsPerPage}
            />
        </div>
    );
};

export default ProductList;
