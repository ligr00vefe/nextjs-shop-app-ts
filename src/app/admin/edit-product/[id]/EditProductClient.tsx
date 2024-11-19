'use client';
import Loader from '@/components/loader/Loader';
import useFetchDocument from '@/hooks/useFetchDocument';
import { useParams, useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import styles from '../../add-product/AddProduct.module.scss';
import { categories } from '../../add-product/AddProductClient';

import Heading from '@/components/heading/Heading';
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db, storage } from '@/firebase/firebase';
import { toast } from 'react-toastify';
import Button from '@/components/button/Button';

const EditProductClient = () => {
    const { id } = useParams();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const { document } = useFetchDocument(
        'products',
        Array.isArray(id) ? id[0] : id || ''
    );
    const [product, setProduct] = useState(document);

    useEffect(() => {
        setProduct(document);
    }, [document]);

    const handleInputChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        // console.log('file: ', file);

        // uploading image to firebase
        const storageRef = ref(storage, `images/${Date.now()}${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                toast.error(error.message);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setProduct({ ...product, imageURL: downloadURL });
                });
            }
        );
    };

    const editProduct = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        if (!product || !document) return;

        // id가 string | string[]인 경우 처리
        const productId = Array.isArray(id) ? id[0] : id; // id가 배열일 경우 첫 번째 요소를 사용.

        if (!productId) {
            setIsLoading(false);
            toast.error('유효하지 않은 상품 ID입니다.'); // productId가 undefined인 경우 처리
            return;
        }

        // 기존 이미지와 신규 이미지가 다를 경우에만 삭제
        if (product.imageURL !== document.imageURL) {
            // delete image from storage
            const storageRef = ref(storage, document.imageURL);
            deleteObject(storageRef);
        }

        try {
            setDoc(doc(db, 'products', productId), {
                name: product.name,
                imageURL: product.imageURL,
                price: Number(product.price),
                category: product.category,
                brand: product.brand,
                desc: product.desc,
                createdAt: document.createdAt,
                editedAt: Timestamp.now().toDate(),
            });

            setIsLoading(false);
            toast.success('상품이 성공적으로 수정되었습니다.');
            router.push('/admin/all-products');
        } catch (error) {
            setIsLoading(false);
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <>
            {isLoading && <Loader />}
            <div className={styles.product}>
                <Heading title="상품 수정하기" />

                {product === null ? (
                    <Loader />
                ) : (
                    <>
                        <form onSubmit={editProduct}>
                            <label>상품 이름:</label>
                            <input
                                type="text"
                                placeholder="상품 이름"
                                required
                                name="name"
                                value={product.name}
                                onChange={(e) => handleInputChange(e)}
                            />
                            <label>상품 이미지:</label>
                            <div>
                                {uploadProgress === 0 ? null : (
                                    <div className={styles.progress}>
                                        <div
                                            className={styles['progress-bar']}
                                            style={{
                                                width: `${uploadProgress}%`,
                                            }}
                                        >
                                            {uploadProgress < 100
                                                ? `Uploading... ${uploadProgress}`
                                                : `Upload Complete ${uploadProgress}%`}
                                        </div>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    placeholder="Product Image"
                                    accept="image/*"
                                    name="image"
                                    onChange={(e) => handleImageChange(e)}
                                />

                                {product.imageURL === '' ? null : (
                                    <input
                                        type="text"
                                        name="imageURL"
                                        disabled
                                        value={product.imageURL}
                                        required
                                        placeholder="이미지 URL"
                                    />
                                )}
                            </div>
                            <label>상품 가격:</label>
                            <input
                                type="number"
                                placeholder="상품 가격"
                                required
                                name="price"
                                value={product.price}
                                onChange={(e) => handleInputChange(e)}
                            />

                            <label>상품 카테고리:</label>
                            <select
                                required
                                name="category"
                                value={product.category}
                                onChange={(e) => handleInputChange(e)}
                            >
                                <option value="" disabled>
                                    --상품 카테고리 선택
                                </option>
                                {categories.map((category) => {
                                    return (
                                        <option
                                            key={category.id}
                                            value={category.name}
                                        >
                                            {category.name}
                                        </option>
                                    );
                                })}
                            </select>

                            <label>상품 브랜드/회사:</label>
                            <input
                                type="text"
                                placeholder="상품 브랜드/회사"
                                name="brand"
                                value={product.brand}
                                onChange={(e) => handleInputChange(e)}
                            />

                            <label>상품 설명:</label>
                            <textarea
                                name="desc"
                                value={product.desc}
                                cols={10}
                                rows={10}
                                required
                                onChange={(e) => handleInputChange(e)}
                            ></textarea>

                            <Button type="submit">상품 수정</Button>
                        </form>
                    </>
                )}
            </div>
        </>
    );
};

export default EditProductClient;
