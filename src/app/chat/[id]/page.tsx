'use client';
import React, { useEffect, useRef } from 'react';
import Sidebar from '@/components/chat/SideBar';
import styles from '../Chat.module.scss';
import { useParams } from 'next/navigation';
import TopBar from '@/components/chat/TopBar';
import MessageBubble from '@/components/chat/MessageBubble';
import BottomBar from '@/components/chat/BottomBar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase/firebase';
import {
    useCollectionData,
    useDocumentData,
} from 'react-firebase-hooks/firestore';
import { collection, doc, orderBy, query } from 'firebase/firestore';
import { CgSpinner } from 'react-icons/cg';
import classNames from 'classnames';
import { IoChatbubbleOutline } from 'react-icons/io5';
import { User } from 'firebase/auth';
import { IMessage } from '@/types';

const ChatPage = () => {
    const [user] = useAuthState(auth);
    const { id } = useParams();
    // console.log('id: ', id);

    const bottomOfChat = useRef<null | HTMLDivElement>(null);
    // console.log('bottomOfChat: ', bottomOfChat);

    // 해당 채팅방의 메시지 데이터 가져오기
    const q = query(
        collection(db, `chats/${id}/messages`),
        orderBy('timestamp')
    );

    const [messages, loading] = useCollectionData(q);

    // 해당 채팅방 데이터 가져오기(useDocumentData는 의존성 데이터를 호출하기 때문에 q보다 후순위로 호출해야 한다.)
    const [chat] = useDocumentData(doc(db, 'chats', id as string));
    // console.log('chat: ', chat);
    // console.log('chat.usersData: ', chat.usersData);

    // 본인이 아닌 대화 상대방의 정보만 필터링
    const getOtherUser = (users: User[], currentUser: User) => {
        return users?.filter((user) => user.email !== currentUser?.email)[0];
    };

    // 새로운 메시지가 작성되면 화면을 제일 아래로 이동
    useEffect(() => {
        bottomOfChat.current?.scrollIntoView({
            behavior: 'auto',
            block: 'start',
        });
    }, [messages]);

    if (!chat) {
        return <div>No chat found.</div>; // 채팅이 없을 때 표시할 내용
    }

    return (
        <main className={styles.chatMain}>
            <div className={styles.sidebar}>
                <Sidebar selectedChatId={id as string} />
            </div>

            <div className={styles.container}>
                <div className={styles.messageArea}>
                    <TopBar
                        user={getOtherUser(chat?.usersData, user as User)}
                    />

                    <div className={styles.messageBox}>
                        <div className={styles.inner}>
                            {loading && (
                                <div
                                    className={classNames(
                                        styles.spinner,
                                        styles.animateSpin
                                    )}
                                >
                                    <CgSpinner />
                                </div>
                            )}

                            {!loading && messages?.length === 0 && (
                                <div className={styles.empty}>
                                    <IoChatbubbleOutline
                                        className={styles.icon}
                                    />
                                    <p>대화를 시작합니다.</p>
                                </div>
                            )}
                            {messages?.map((msg, index) => (
                                <MessageBubble
                                    user={user as User}
                                    photoURL={msg.photoURL}
                                    message={msg as IMessage}
                                    key={index}
                                    numberOfMessages={messages?.length}
                                    currentMessageIndex={index}
                                />
                            ))}
                            <div
                                ref={bottomOfChat}
                                className={styles.newMsg}
                            ></div>
                        </div>
                    </div>

                    <BottomBar user={user as User} chatId={id as string} />
                </div>
            </div>
        </main>
    );
};

export default ChatPage;
