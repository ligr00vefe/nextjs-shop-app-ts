'use client';
import React, { FormEvent, useState } from 'react';
import styles from './ReviewProduct.module.scss';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectUserID, selectUserName } from '@/redux/slice/authSlice';
import useFetchCollection from '@/hooks/useFetchCollection';
import Heading from '@/components/heading/Heading';
import Loader from '@/components/loader/Loader';
import Image from 'next/image';
import { Rating } from 'react-simple-star-rating';
import Button from '@/components/button/Button';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { toast } from 'react-toastify';

const ReviewProductClient = () => {
    const [rate, setRate] = useState(0);
    const [review, setReview] = useState('');

    const router = useRouter();

    const { id } = useParams();
    const userID = useSelector(selectUserID);
    const userName = useSelector(selectUserName);

    // getting a single produc tfrom database
    const { document: product } = useFetchCollection('products', id);

    const submitReview = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const today = new Date();
        const date = today.toDateString();

        const reviewData = {
            userID,
            userName,
            productID: id,
            rate,
            review,
            reviewDate: date,
            createdAt: Timestamp.now().toDate(),
        };

        try {
            // Add a new document with a generated id.
            addDoc(collection(db, 'reviews'), reviewData);

            router.push(`/product-details/${id}`);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <section className={styles.review}>
            <Heading title="상품평 작성" />
            {product === null ? (
                <Loader basic />
            ) : (
                <div>
                    <p className={styles.name}>
                        <b>상품 이름:</b>
                        {product.name}
                    </p>
                    <Image
                        src={product.iamgeURL}
                        alt={product.name}
                        width={100}
                        height={100}
                        priority
                    />
                </div>
            )}

            <div className={styles.card}>
                <form onSubmit={(e) => submitReview(e)}>
                    <label>평점:</label>
                    <Rating
                        initialValue={rate}
                        onClick={(rate) => {
                            setRate(rate);
                        }}
                    />
                    <label>상품평</label>
                    <textarea
                        value={review}
                        required
                        onChange={(e) => setReview(e.target.value)}
                        cols={30}
                        rows={10}
                    ></textarea>
                    <Button type="submit">상품평 작성하기</Button>
                </form>
            </div>
        </section>
    );
};

export default ReviewProductClient;
