'use client';
import React, { FormEvent, useState } from 'react';
import styles from './BottomBar.module.scss';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { User } from 'firebase/auth';

interface IBottomBarProps {
    user: User;
    chatId: String;
}

const BottomBar = ({ user, chatId }: IBottomBarProps) => {
    const [input, setInput] = useState('');

    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (input.trim().length === 0) return;

        await addDoc(collection(db, `chats/${chatId}/messages`), {
            text: input,
            sender: user.email,
            photoURL: user.photoURL,
            timestamp: serverTimestamp(),
        });

        setInput('');
    };

    return (
        <div className={styles.bottomBar}>
            <form onSubmit={sendMessage}>
                <input
                    placeholder="메시지를 입력하세요."
                    className={styles.input}
                    autoComplete="off"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit">
                    <IoPaperPlaneOutline />
                </button>
            </form>
        </div>
    );
};

export default BottomBar;
