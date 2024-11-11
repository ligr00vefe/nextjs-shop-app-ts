import React from 'react';
import OrderDetailsClient from './OrderDetailsClient';

interface IOrderDetailsProps {
    params: {
        id: string;
    };
}

const OrderDetails = ({ params }: IOrderDetailsProps) => {
    const { id } = params;
    // console.log('id: ', id);

    return (
        <>
            {/* <div>{id}</div> */}
            <OrderDetailsClient />
        </>
    );
};

export default OrderDetails;
