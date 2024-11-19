'use client';
import React, { useEffect, useState } from 'react';
import styles from './AllProducts.module.scss';
import Loader from '@/components/loader/Loader';
import useFetchCollection from '@/hooks/useFetchCollection';
import {
    FILTER_BY_SEARCH,
    selectFilteredProducts,
} from '@/redux/slice/filterSlice';
import { selectProducts, STORE_PRODUCTS } from '@/redux/slice/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import Heading from '@/components/heading/Heading';
import priceFormat from '@/utils/priceFormat';
import Link from 'next/link';
import Image from 'next/image';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Pagination from '@/components/pagination/Pagination';
import Search from '@/components/search/Search';
import { deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db, storage } from '@/firebase/firebase';
import { deleteObject, ref } from 'firebase/storage';
import Notiflix from 'notiflix';

// 임시 데이터
// import data from '../../../components/product/ProductsData';

const AllProductsClient = () => {
    const [search, setSearch] = useState('');
    const { data, isLoading } = useFetchCollection('products');
    // 임시 데이터용 isLoading값
    // const [isLoading, setIsLoading] = useState(false);

    const products = useSelector(selectProducts);
    const filteredProducts = useSelector(selectFilteredProducts);

    // PAGINATION states
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);

    // get current products
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFastProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFastProduct,
        indexOfLastProduct
    );

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            STORE_PRODUCTS({
                products: data,
            })
        );
    }, [dispatch, data]);

    // filtering product in store
    useEffect(() => {
        dispatch(
            FILTER_BY_SEARCH({
                products,
                search,
            })
        );
    }, [dispatch, products, search]);

    // confirmDelete
    const confirmDelete = (id: string, imageURL: string) => {
        Notiflix.Confirm.show(
            '상품 삭제하기',
            '이 상품을 삭제하게 됩니다.',
            '삭제',
            '취소',
            function okCb() {
                deleteProduct(id, imageURL);
            },
            function cancelCb() {
                console.log('삭제가 취소되었습니다.');
            },
            {
                width: '320px',
                borderRadius: '3px',
                titleColor: '#4385f4',
                cssAnimationStyle: 'zoom',
                // etc ...
            }
        );
    };

    // deleteProduct
    const deleteProduct = async (id: string, imageURL: string) => {
        try {
            await deleteDoc(doc(db, 'products', id));
            // delete image from storage
            const storageRef = ref(storage, imageURL);
            await deleteObject(storageRef);
            toast.success('상품을 성공적으로 삭제했습니다.');
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <>
            {isLoading && <Loader />}
            <div className={styles.table}>
                <Heading
                    title={'모든 상품'}
                    subtitle={`총 ${filteredProducts.length} 개의 상품`}
                />

                <div className={styles.search}>
                    <Search
                        value={search}
                        onChange={(e) =>
                            setSearch((e.target as HTMLInputElement).value)
                        }
                    />
                </div>

                {filteredProducts.length < 1 ? (
                    <p>상품이 없습니다.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>순서</th>
                                <th>이미지</th>
                                <th>이름</th>
                                <th>카테고리</th>
                                <th>가격</th>
                                <th>실행</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map((product, index) => {
                                const { id, name, category, price, imageURL } =
                                    product;

                                return (
                                    <tr key={id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <Image
                                                src={imageURL}
                                                alt={name}
                                                width={100}
                                                height={100}
                                            />
                                        </td>
                                        <td>{name}</td>
                                        <td>{category}</td>
                                        <td>{priceFormat(price)}원</td>
                                        <td className={styles.icons}>
                                            <Link
                                                href={`/admin/edit-product/${id}`}
                                            >
                                                <FaEdit
                                                    size={20}
                                                    color="green"
                                                />
                                            </Link>{' '}
                                            <FaTrashAlt
                                                size={18}
                                                color="red"
                                                onClick={() =>
                                                    confirmDelete(id, imageURL)
                                                }
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalProducts={filteredProducts.length}
                    productsPerPage={productsPerPage}
                />
            </div>
        </>
    );
};

export default AllProductsClient;
