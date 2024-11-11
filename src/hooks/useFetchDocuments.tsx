'use client';
import React, { useCallback, useEffect, useState } from 'react';
import {
    DocumentData,
    WhereFilterOp,
    collection,
    getDocs,
    query,
    where,
} from 'firebase/firestore';
import { db } from '@/firebase/firebase';

// https://firebase.google.com/docs/firestore/query-data/queries?hl=ko
const useFetchDocuments = (
    collectionName: string,
    arg: [string, WhereFilterOp, string]
) => {
    const [documents, setDocuments] = useState<DocumentData[]>([]);

    const getDocuments = useCallback(async () => {
        const q = query(
            collection(db, collectionName),
            where(arg[0], arg[1], arg[2])
        );
        const querySnapshot = await getDocs(q);

        let documentsArray: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
            const data = {
                id: doc.id,
                ...doc.data(),
            };
            // doc.data() is never undefied for query doc snapshots
            // donsole.log(doc.id, ' => ', doc.data());
            documentsArray.push(data);
        });
        setDocuments(documentsArray);
    }, [collectionName, arg]);

    useEffect(() => {
        getDocuments();
    }, [getDocuments]);

    return { documents };
};

export default useFetchDocuments;
