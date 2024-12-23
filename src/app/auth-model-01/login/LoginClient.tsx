'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './Auth.module.scss';
import LogoPath from '@/assets/colorful.svg';
import Loader from '@/components/loader/Loader';
import Input from '@/components/input/Input';
import AutoSignInCheckbox from '@/components/autoSignInCheckbox/AutoSignInCheckbox';
import Divider from '@/components/divider/Divider';
import Link from 'next/link';
import Button from '@/components/button/Button';
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
    const [isAutoLogin, setIsAutoLogin] = useState(false);

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
            <section className={styles.auth}>
                <div className={styles.container}>
                    <h1 className={styles.logo}>
                        <Image priority src={LogoPath} alt="logo" width={247} />
                    </h1>

                    <form className={styles.form} onSubmit={loginUser}>
                        <Input
                            email
                            icon="letter"
                            id="email"
                            name="email"
                            label="이메일"
                            placeholder="아이디(이메일)"
                            className={styles.control}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            password
                            icon="lock"
                            id="password"
                            name="password"
                            label="비밀번호"
                            placeholder="비밀번호"
                            className={styles.control}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className={styles.group}>
                            {/* 자동 로그인, 비밀번호 수정 */}
                            <AutoSignInCheckbox
                                checked={isAutoLogin}
                                onChange={(e) =>
                                    setIsAutoLogin(
                                        (e.target as HTMLInputElement).checked
                                    )
                                }
                            />

                            <Link href={'/reset'} className={styles.findLink}>
                                비밀번호 수정하기
                                <svg
                                    width="11"
                                    height="18"
                                    viewBox="0 0 11 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={styles.findLinkArrow}
                                >
                                    <path
                                        d="M1.5 1L9.5 9L1.5 17"
                                        stroke="#0074E9"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </Link>
                        </div>

                        <div className={styles.buttonArea}>
                            <Button type="submit" style={{ width: '100%' }}>
                                로그인
                            </Button>

                            <Divider />

                            <Button style={{ width: '100%' }} secondary>
                                <Link href={'/register'}>회원가입</Link>
                            </Button>
                            <Divider />

                            <div>
                                <Button onClick={signInWithGoogle}>
                                    구글 로그인
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default LoginClient;
