'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from '../login/Auth.module.scss';
import LogoPath from '@/assets/colorful.svg';
import Loader from '@/components/loader/Loader';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebase';

const RegisterClient = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const registerUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== cPassword) {
            toast.error('비밀번호가 일치하지 않습니다.');
        }

        setIsLoading(true);

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('user: ', user);
                setIsLoading(false);

                toast.success('등록 성공...');
                router.push('/login');
            })
            .catch((error) => {
                setIsLoading(false);
                toast.error(error.message);
            });
    };

    return (
        <>
            {isLoading && <Loader />}
            <section className={styles.authWrapper}>
                <div className={styles.container}>
                    <h1 className={styles.logo}>
                        <Image priority src={LogoPath} alt="logo" width={247} />
                    </h1>

                    <form className={styles.form} onSubmit={registerUser}>
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

                        <div className={styles.inputBox}>
                            <label htmlFor="password">비밀번호 확인</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="비밀번호 확인"
                                value={cPassword}
                                onChange={(e) => setCPassword(e.target.value)}
                            />
                        </div>

                        <div className={styles.btnArea}>
                            <button className={styles.coloredBtn} type="submit">
                                회원가입
                            </button>

                            <Link href={'/login'}>
                                <button>로그인</button>
                            </Link>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default RegisterClient;
