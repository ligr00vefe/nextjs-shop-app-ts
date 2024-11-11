'use client';
import Heading from '@/components/heading/Heading';
import React, { FormEvent } from 'react';
import styles from './Checkout.module.scss';
import CheckoutForm from '@/components/checkoutForm/CheckoutForm';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectShippingAddress } from '@/redux/slice/checkoutSlice';
import {
    CLEAR_CART,
    selectCartItems,
    selectCartTotalAmount,
} from '@/redux/slice/cartSlice';
import { selectEmail, selectUserID } from '@/redux/slice/authSlice';
import Button from '@/components/button/Button';
import { toast } from 'react-toastify';

const CheckoutClient = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const userID = useSelector(selectUserID);
    const cartItems = useSelector(selectCartItems);
    const shippingAddress = useSelector(selectShippingAddress);
    const userEmail = useSelector(selectEmail);
    const cartTotalAmount = useSelector(selectCartTotalAmount);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const tossPayments = await loadTossPayments(
            process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
        );

        tossPayments
            .requestPayment({
                //결제 정보 파라미터
                // successUrl, failUrl, windowTarget 파라미터를 넘기지 마세요.
                amount: cartTotalAmount,
                orderId: Math.random().toString(36).slice(2),
                orderName: '주문',
            })
            .then(async function (data) {
                // 성공 처리: 서버 측에서 결제 승인 API를 호출하세요
                const { orderId, paymentKey, amount } = data;
                const secretKey = process.env.NEXT_PUBLIC_TOSS_SECRET_KEY;
                const basicToken = Buffer.from(
                    `${secretKey}:`,
                    'utf-8'
                ).toString('base64');

                const url = 'https://api.tosspayments.com/v1/payments/confirm';

                const confirmResponse = fetch(url, {
                    method: 'post',
                    body: JSON.stringify({
                        amount,
                        orderId,
                        paymentKey,
                    }),
                    headers: {
                        Authorizaton: `Basic ${basicToken}`,
                        'Content-Type': 'application/json',
                    },
                }).then((res) => res.json());

                console.log('confirmResponse: ', confirmResponse);

                // 거래 데이터를 데이터베이스에 저장
                const today = new Date();
                const date = today.toDateString();
                const time = today.toLocaleTimeString();

                const orderData = {
                    userID,
                    userEmail,
                    orderDate: date,
                    orderTime: time,
                    orderAmount: amount,
                    orderStatus: '주문수락',
                    cartItems,
                    shippingAddress,
                    createdAt: Timestamp.now().toDate(),
                };

                // Add a new document with a generated id.
                // firestore에 저장
                await addDoc(collection(db, 'orders'), orderData);
                // db에 저장 후 장바구니 비우기
                dispatch(CLEAR_CART());

                // 주문 성공 페이지로 이동
                router.push(`/checkout-success?orderId=${orderId}`);
            })
            .catch((error) => {
                // 에러 처리: 에러 목록을 확인하세요
                // https://docs.tosspayments.com/reference/error-codes#failurl로-전달되는-에러
                if (error.code === 'USER_CANCEL') {
                    // 결제 고객이 결제창을 닫았을 때 에러 처리
                    toast.error('결제를 취소하셨습니다.');
                } else if (error.code === 'INVALID_CARD_COMPANY') {
                    // 유효하지 않은 카드 코드에 대한 에러 처리
                }
            });
    };

    return (
        <section>
            <div className={styles.checkout}>
                <Heading title="주문하기" />
                <form onSubmit={handleSubmit}>
                    <div className={styles.card}>
                        <CheckoutForm />
                    </div>
                    <div>
                        <Button type="submit">토스를 이용해서 결제</Button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default CheckoutClient;
