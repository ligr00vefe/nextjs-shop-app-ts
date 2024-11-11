'use client';
import { db } from '@/firebase/firebase';
import { doc, DocumentData, getDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const useFetchDocument = (collectionName: string, documentID: string) => {
    const [document, setDocument] = useState<DocumentData | null>(null);

    const getDocument = useCallback(async () => {
        // collectionName과 documentID가 유효한지 확인
        if (!collectionName || !documentID) {
            toast.error('유효하지 않은 컬렉션 이름 또는 문서 ID');
            return;
        }

        // getting a document from firestore
        const docRef = doc(db, collectionName, documentID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const obj = {
                id: documentID,
                ...docSnap.data(),
            };

            setDocument(obj);
        } else {
            toast.error('Document Not Found');
        }
    }, [collectionName, documentID]);

    useEffect(() => {
        getDocument();
    }, [getDocument]);

    return { document };
};

export default useFetchDocument;
