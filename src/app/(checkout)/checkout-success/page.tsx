import React from 'react';
import styles from './CheckoutSuccess.module.scss';
import Heading from '@/components/heading/Heading';
import priceFormat from '@/utils/priceFormat';
import { formatTime } from '@/utils/dayjs';

interface ICheckoutSuccessProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface IPayment {
    orderName: string;
    orderId: string;
    approvedAt: string;
    card: {
        number: number;
        amount: number;
    };
}

const CheckoutSuccess = async ({ searchParams }: ICheckoutSuccessProps) => {
    const secretKey = process.env.NEXT_PUBLIC_TOSS_SECRET_KEY || '';
    const orderId = await searchParams;
    const url = `https://api.tosspayments.com/v1/payments/orders/${orderId}`;

    const basicToken = Buffer.from(`${secretKey}:`, `utf-8`).toString('base64');

    const response = await fetch(url, {
        headers: {
            Authorization: `Basic ${basicToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch payment data');
    }

    const payments: IPayment = await response.json();

    // console.log('payments: ', payments);

    const { card } = payments;

    return (
        <section className={styles.success}>
            <Heading title="결제 성공" />
            <ul className={styles.list}>
                <li>
                    <b>결제 상품:</b> {payments.orderName}
                </li>
                <li>
                    <b>주문 번호:</b> {payments.orderId}
                </li>
                <li>
                    <b>카드 번호:</b> {card.number}
                </li>
                <li>
                    <b>결제 금액:</b> {priceFormat(card.amount)}원
                </li>
                <li>
                    <b>결제승인날짜:</b> {formatTime(payments.approvedAt)}
                </li>
            </ul>
        </section>
    );
};

export default CheckoutSuccess;
