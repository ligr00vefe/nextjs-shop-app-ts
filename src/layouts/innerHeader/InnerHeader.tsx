'use client';
import React, { useState } from 'react';
import styles from './InnerHeader.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';

import logo from '@/assets/colorful.svg';
import rocketIcon from '@/assets/icon-rocket.svg';
import freshIcon from '@/assets/icon-fresh.svg';
import newIcon from '@/assets/new.svg';

const InnerHeader = () => {
    const [search, setSearch] = useState('');
    const router = useRouter();

    const handleMoveCart = () => {
        router.push('/cart');
    };

    return (
        <div className={styles.innerHeader}>
            {/* <!-- 로고 --> */}
            <h1 className={styles.brand}>
                <Link href="/">
                    <Image src={logo} alt="logo" width={211} height={48} />
                </Link>
            </h1>

            {/* <!-- 카테고리 버튼 --> */}
            <button type="button" className={styles.buttonCategory}>
                카테고리
            </button>

            {/* <!-- 검색 폼 --> */}
            <form action="/" className={styles.searchForm}>
                <fieldset>
                    <div className={styles.searchFormWrapper}>
                        <div className={styles.formSelect}>
                            <select name="searchCategory" id="searchCategory">
                                <option value="">전체</option>
                            </select>
                            <svg
                                className={styles.iconDown}
                                width="9"
                                height="6"
                                viewBox="0 0 9 6"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M9 0H0L4.69565 6L9 0Z"
                                    fill="#767676"
                                />
                            </svg>
                        </div>
                        <div className={styles.formInput}>
                            <input
                                type="search"
                                id="searchKeyword"
                                placeholder="찾고 싶은 상품을 검색해보세요!"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            className={styles.searchButton}
                        ></button>
                        <button
                            type="button"
                            className={styles.voiceSearchButton}
                        ></button>
                    </div>
                </fieldset>
            </form>

            {/* <!-- 마이페이지 영역 --> */}
            <div className={styles.myPage}>
                <button
                    type="button"
                    className={classNames(styles.button, styles.myPageButton)}
                >
                    마이페이지
                </button>
                <ul className={styles.myPageList}>
                    <li>
                        <Link href="/">주문목록</Link>
                    </li>
                    <li>
                        <Link href="/">취소/반품</Link>
                    </li>
                    <li>
                        <Link href="/">찜리스트</Link>
                    </li>
                </ul>
            </div>

            {/* <!-- 장바구니 영역 --> */}
            <div className={styles.cart}>
                <div className={styles.cartButtonWrapper}>
                    <button
                        type="button"
                        onClick={handleMoveCart}
                        className={classNames(styles.button, styles.cartButton)}
                    >
                        장바구니
                    </button>
                    <strong className={styles.cartProductCount}>1</strong>
                </div>
            </div>

            {/* <!-- 유형별 링크목록 영역 --> */}
            <div className={styles.typeNavigation}>
                <ul className={styles.typeNavigationList}>
                    <li>
                        <Link href="/">
                            <Image
                                src={rocketIcon}
                                className={styles.badgeRocket}
                                alt="rocket"
                            />
                            로켓배송
                        </Link>
                    </li>
                    <li>
                        <Link href="/">
                            <Image
                                src={freshIcon}
                                className={styles.badgeRocket}
                                alt="fresh"
                            />
                            로켓프레시
                        </Link>
                    </li>
                    <li>
                        <Link href="/">
                            2024년 추석
                            <Image
                                src={newIcon}
                                className={styles.badgeNew}
                                alt="fresh"
                            />
                        </Link>
                    </li>
                    <li>
                        <Link href="/">로켓직구</Link>
                    </li>
                    <li>
                        <Link href="/">골든박스</Link>
                    </li>
                    <li>
                        <Link href="/">정기배송</Link>
                    </li>
                    <li>
                        <Link href="/">이벤트/쿠폰</Link>
                    </li>
                    <li>
                        <Link href="/">기획전</Link>
                    </li>
                    <li>
                        <Link href="/">여행티켓</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default InnerHeader;
