'use client';
import React from 'react';
import styles from './OrderDetails.module.scss';
import useFetchDocument from '@/hooks/useFetchDocument';
import { useParams, useRouter } from 'next/navigation';
import Heading from '@/components/heading/Heading';
import Loader from '@/components/loader/Loader';
import priceFormat from '@/utils/priceFormat';
import Image from 'next/image';
import Button from '@/components/button/Button';
import Link from 'next/link';
import { TCartItem } from '@/types';

const OrderDetailsClient = () => {
    const { id } = useParams();
    const { document: order } = useFetchDocument(
        'orders',
        Array.isArray(id) ? id[0] : id!
    );

    const router = useRouter();

    const handleClick = (id: string) => {
        router.push(`/review-product/${id}`);
    };

    return (
        <section className={styles.table}>
            <Heading title="주문 상세 정보" />

            {order === null ? (
                <Loader basic />
            ) : (
                <>
                    <div className={styles.details}>
                        <p>
                            <b>주문 아이디</b> {order.id}
                        </p>
                        <p>
                            <b>주문 가격</b> {priceFormat(order.orderAmount)}원
                        </p>
                        <p>
                            <b>주문 상태</b> {order.orderStatus}
                        </p>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <td>순서</td>
                                <td>상품</td>
                                <td>가격</td>
                                <td>개수</td>
                                <td>합계</td>
                                <td>실행</td>
                            </tr>
                        </thead>
                        <tbody>
                            {order.cartItems.map(
                                (cartItem: TCartItem, index: number) => {
                                    const {
                                        id,
                                        name,
                                        price,
                                        imageURL,
                                        cartQuantity,
                                    } = cartItem;

                                    return (
                                        <tr key={id}>
                                            <td>
                                                <b>{index + 1}</b>
                                            </td>
                                            <td>
                                                <p>
                                                    <b>{name}</b>
                                                </p>
                                                <Image
                                                    src={imageURL}
                                                    alt={name}
                                                    width={100}
                                                    height={100}
                                                />
                                            </td>
                                            <td>{priceFormat(price)}원</td>
                                            <td>{cartQuantity}</td>
                                            <td>
                                                {priceFormat(
                                                    price * cartQuantity
                                                )}
                                                원
                                            </td>
                                            <td className={styles.icons}>
                                                <Link
                                                    href={`/review-product/${id}`}
                                                >
                                                    <Button
                                                        onClick={() =>
                                                            handleClick(id)
                                                        }
                                                    >
                                                        상품 리뷰하기
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </section>
    );
};

export default OrderDetailsClient;
