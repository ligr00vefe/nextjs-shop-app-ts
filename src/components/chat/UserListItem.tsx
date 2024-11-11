'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './UserListItem.module.scss';
import Image from 'next/image';
import classNames from 'classnames';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { User } from 'firebase/auth';
import { IChat } from '@/types';

interface IUserListItemProps {
    sender: User;
    receiver: User;
    selectedChatId?: string;
    chats: IChat[];
}

const UserListItem = ({
    sender,
    receiver,
    selectedChatId,
    chats,
}: IUserListItemProps) => {
    // console.log('sender', sender);
    // console.log('receiver', receiver);
    // console.log('selectedChatId', selectedChatId);
    // console.log('chats', chats);

    const router = useRouter();

    const chatExists = (receiverEmail: string) => {
        const senderEmail = sender.email!;
        return chats?.find(
            (chat: IChat) =>
                chat?.users?.includes(senderEmail) &&
                chat.users.includes(receiverEmail)
        );
    };

    const chat = chatExists(receiver.email!);

    const redirect = (id: string) => {
        router.push(`/chat/${id}`);
    };

    const handleClick = async () => {
        // 보낸 메시지 데이터 객체 생성
        const senderData = {
            displayName: sender.displayName,
            photoURL: sender.photoURL,
            email: sender.email,
        };

        // 받은 메시지 데이터 객체 생성
        const receiverData = {
            displayName: receiver.displayName,
            photoURL: receiver.photoURL,
            email: receiver.email,
        };

        // Chats 데이터가 있는지 확인하여 없으면 새로 생성.
        if (!chat) {
            const { id } = await addDoc(collection(db, 'chats'), {
                usersData: [senderData, receiverData],
                users: [sender.email, receiver.email],
                timestamp: serverTimestamp(),
            });
            redirect(id);
        } else {
            redirect(chat.id);
        }
    };

    return (
        <div
            className={classNames(
                styles.userListItem,
                chat && chat.id === selectedChatId ? styles.rounded : undefined
            )}
            onClick={handleClick}
        >
            <div className={styles.userIcon}>
                {receiver.photoURL && (
                    <Image
                        src={receiver.photoURL}
                        width={40}
                        height={40}
                        alt={receiver.displayName!}
                    />
                )}
            </div>

            <div className={styles.userName}>
                <p>{receiver.displayName}</p>
            </div>

            {/* {chat &&
                <div className="flex flex-shrink-0 mt-1 text-sm">
                    {Moment(new Date(chat?.timestamp?.seconds * 1000)).format("MMM DD")}
                </div>
            } */}
        </div>
    );
};

export default UserListItem;
