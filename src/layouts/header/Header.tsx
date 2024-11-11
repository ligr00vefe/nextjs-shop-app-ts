'use client';
import React, { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import Link from 'next/link';
import { auth } from '@/firebase/firebase';
import { toast } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import InnerHeader from '../innerHeader/InnerHeader';
import {
    REMOVE_ACTIVE_USER,
    selectIsLoggedIn,
    SET_ACTIVE_USER,
} from '@/redux/slice/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const Header = () => {
    const [displayName, setDisplayName] = useState('');
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // const uid = user.uid;

                // user에 displayName이 없을 경우 email의 @ 앞부분을 가져와서 displayName으로 대체
                if (user.displayName === null) {
                    const u1 = user.email!.substring(
                        0,
                        user.email!.indexOf('@')
                    );
                    // 첫글자는 대문자로 변경해서 전달
                    const uName = u1.charAt(0).toUpperCase() + u1.slice(1);
                    setDisplayName(uName);
                } else {
                    setDisplayName(user.displayName);
                }

                // 유저 정보를 리덕스 스토어에 저장
                dispatch(
                    SET_ACTIVE_USER({
                        email: user.email,
                        userName: user.displayName
                            ? user.displayName
                            : displayName,
                        userID: user.uid,
                    })
                );
            } else {
                setDisplayName('');
                // 유저 정보를 리덕스 스토어에서 삭제
                dispatch(REMOVE_ACTIVE_USER());
            }
        });
    }, [dispatch, displayName]);

    const logoutUser = () => {
        signOut(auth)
            .then(() => {
                toast.success('로그아웃 되었습니다.');
                router.push('/');
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    // 헤더를 렌더링 하지 않는 페이지 구분
    if (
        pathname === '/login' ||
        pathname === '/register' ||
        pathname === '/reset' ||
        pathname.startsWith('/chat')
    ) {
        return null;
    }

    return (
        <header>
            <div className={styles.loginBar}>
                <ul className={styles.list}>
                    {!isLoggedIn ? (
                        <li className={styles.item}>
                            <Link href="/login">로그인</Link>
                        </li>
                    ) : (
                        <>
                            <li className={styles.item}>
                                <Link href="/chat">채팅</Link>
                            </li>
                            <li className={styles.item}>
                                <Link href="/admin/dashboard">관리자</Link>
                            </li>
                            <li className={styles.item}>
                                <Link href="/order-history">주문 목록</Link>
                            </li>
                            <li className={styles.item}>
                                <Link href="/" onClick={logoutUser}>
                                    로그아웃
                                </Link>
                            </li>
                        </>
                    )}

                    <li className={styles.item}>
                        <Link href="/">제휴 마케팅</Link>
                    </li>
                    <li className={styles.item}>
                        <Link href="/">쿠팡 플레이</Link>
                    </li>
                    <li className={styles.item}>
                        <Link href="/">고객센터</Link>
                    </li>
                </ul>
            </div>
            {/* 경로가 /admin으로 시작할 경우 InnerHeader 컴포넌트는 제외 */}
            {pathname.startsWith('/admin') ? null : <InnerHeader />}
        </header>
    );
};

export default Header;
