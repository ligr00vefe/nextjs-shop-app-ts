'use client';
import React from 'react';
import styles from './TopBar.module.scss';
import Image from 'next/image';
import { User } from 'firebase/auth';

interface ITopbarProps {
    user: User;
}

const TopBar = ({ user }: ITopbarProps) => {
    return (
        <div className={styles.topBar}>
            <div className={styles.userIcon}>
                {user.photoURL && (
                    <Image
                        src={user?.photoURL}
                        alt={user?.email!}
                        width={40}
                        height={40}
                    />
                )}
            </div>
            <span className={styles.userName}>{user.displayName}</span>
        </div>
    );
};

export default TopBar;
