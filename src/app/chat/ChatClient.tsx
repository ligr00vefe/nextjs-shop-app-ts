'use client';
import React, { useEffect, useState } from 'react';
import styles from './Chat.module.scss';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase/firebase';
import { CgSpinner } from 'react-icons/cg';
import classNames from 'classnames';
import Login from '../(auth)/login/page';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import Sidebar from '@/components/chat/SideBar';

const ChatClient = () => {
    const [user, loading] = useAuthState(auth);
    const [displayName, setDisplayName] = useState('');
    // console.log('user: ', user);

    useEffect(() => {
        if (user) {
            // displayName이 없을경우 이메일 앞부분으로 대체
            // console.log('user.displayName: ', user.displayName);
            if (user.displayName) {
                setDisplayName(user.displayName);
            } else {
                setDisplayName(user.email!.split('@')[0]);
            }
            // console.log('displayName: ', displayName);

            // user 정보가 있으면 firebase에 저장
            setDoc(
                doc(db, 'users', user.uid),
                {
                    email: user.email,
                    lastActive: serverTimestamp(),
                    photoURL: user.photoURL,
                    displayName: displayName,
                },
                { merge: true } // 이미 등록된 user 데이터인지를 판별하는 변수
            );
        }
    }, [user, displayName]);

    if (loading) {
        return (
            <div className={classNames(styles.spinner, styles.animateSpin)}>
                <CgSpinner />
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    return (
        <main className={styles.chatMain}>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>

            <div className={styles.container}>
                <div className={styles.empty}>
                    <IoChatbubblesOutline className={styles.icon} />
                    <p>대화를 시작합니다.</p>
                </div>
            </div>
        </main>
    );
};

export default ChatClient;
