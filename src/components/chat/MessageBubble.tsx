'use client';
import React from 'react';
import styles from './MessageBubble.module.scss';
import Image from 'next/image';
import classNames from 'classnames';
import { User } from 'firebase/auth';
import { IMessage } from '@/types';

interface IMessageBubbleProps {
    user: User;
    message: IMessage;
    photoURL: string;
    numberOfMessages: number;
    currentMessageIndex: number;
}

const MessageBubble = ({
    user,
    message,
    photoURL,
    numberOfMessages,
    currentMessageIndex,
}: IMessageBubbleProps) => {
    const sender = message.sender === user?.email;

    return (
        <div className={styles.msgBubble}>
            <div className={!sender ? styles.start : styles.end}>
                {!sender && (
                    <div className={styles.userIcon}>
                        {photoURL && (
                            <Image
                                width={30}
                                height={30}
                                src={photoURL}
                                alt={message.sender}
                            />
                        )}
                    </div>
                )}
                <div
                    className={classNames(
                        styles.msgText,
                        !sender ? styles.receiver : styles.sender
                    )}
                >
                    {message.text}
                </div>
            </div>
            {/* {numberOfMessages === currentMessageIndex + 1 && (
                <div className={!sender ? `flex justify-start` : `flex justify-end`}>
                <span className="px-1 text-xs text-gray-400">
                    Sent{" "}
                    {Moment(new Date(message?.timestamp?.seconds * 1000)).format(
                    "MMM DD, YYYY h:mm a"
                    )}
                </span>
                </div>
            )} */}
        </div>
    );
};

export default MessageBubble;
