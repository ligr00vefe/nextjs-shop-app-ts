'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './Auth.module.scss';
import LogoPath from '@/assets/colorful.svg';
import Loader from '@/components/loader/Loader';
import Link from 'next/link';
import { toast } from 'react-toastify';
import {
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/firebase/firebase';

const LoginClient = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const redirectUser = () => {
        router.push('/');
    };

    const loginUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredentail) => {
                setIsLoading(false);
                toast.success('로그인에 성공했습니다.');
                redirectUser();
            })
            .catch((error) => {
                setIsLoading(false);
                toast.error(error.message);
            });
    };

    // login width google
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                toast.success('로그인에 성공했습니다.');
                redirectUser();
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    return (
        <>
            {isLoading && <Loader />}
            <section className={styles.authWrapper}>
                <div className={styles.container}>
                    <div className={styles.logo}>
                        <Image priority src={LogoPath} alt="logo" width={247} />
                        <h1>로그인</h1>
                    </div>

                    <form className={styles.form} onSubmit={loginUser}>
                        <div className={styles.inputBox}>
                            <label htmlFor="email">이메일</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="이메일을 입력하세요."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className={styles.inputBox}>
                            <label htmlFor="password">비밀번호</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="비밀번호를 입력하세요."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className={styles.btnArea}>
                            <button
                                className={styles.coloredBtn}
                                type="submit"
                                style={{ width: '100%' }}
                            >
                                로그인
                            </button>

                            <Link href={'/register'}>
                                <button>회원가입</button>
                            </Link>

                            <button onClick={signInWithGoogle}>
                                Google 계정으로 로그인
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default LoginClient;
