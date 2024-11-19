'use client';
import React from 'react';
import { auth, db } from '@/firebase/firebase';
import { collection, doc, DocumentData } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import styles from './SideBar.module.scss';
import { CgSpinner } from 'react-icons/cg';
import classNames from 'classnames';
import { signOut } from 'firebase/auth';
import UserListItem from './UserListItem';
import { IChat } from '@/types';

interface ISideBarProps {
    selectedChatId?: string;
}

const Sidebar = ({ selectedChatId }: ISideBarProps) => {
    // console.log('selectedChatId: ', selectedChatId);

    const router = useRouter();

    // 나의 유저 데이터 가져오기
    const [user] = useAuthState(auth);
    // console.log('user: ', user);

    // 데이터베이스에 있는 모든 유저 데이터 가져오기
    const [snapshotUser] = useCollection(collection(db, 'users'));
    const users = snapshotUser?.docs.map((doc: DocumentData) => ({
        id: doc.id,
        ...doc.data(),
    }));

    // 유저 데이터에서 나의 유저 데이터는 제외하고 가져오기
    const filteredUsers = users?.filter(
        (singleUser) => singleUser.email !== user?.email
    );
    // console.log('filteredUsers: ', filteredUsers);

    // 각 방의 채팅 데이터 가져오기
    const [snapshotChat] = useCollection(collection(db, 'chats'));
    const chats = snapshotChat?.docs.map((doc: DocumentData) => ({
        id: doc.id,
        ...doc.data(),
    }));

    if (!user) {
        return (
            <div className={classNames(styles.spinner, styles.animateSpin)}>
                <CgSpinner />
            </div>
        );
    }

    const logout = () => {
        signOut(auth);
        router.push('/');
    };

    return (
        <div className={styles.sideBar}>
            <div className={styles.users}>
                <h2>채팅</h2>
                <button className={styles.btnLogout} onClick={() => logout()}>
                    <span>로그아웃</span>
                </button>
            </div>

            <div className={styles.container}>
                {filteredUsers?.map((receiver) => (
                    <UserListItem
                        sender={user}
                        receiver={receiver}
                        chats={chats as IChat[]}
                        selectedChatId={selectedChatId}
                        key={receiver.email}
                    />
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
