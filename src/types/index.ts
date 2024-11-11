import { User } from 'firebase/auth';

export interface IProduct {
    id: string;
    brand: string;
    category: string;
    desc: string;
    imageURL: string;
    name: string;
    price: number;
}

export interface IShippingAddress {
    city: string;
    line: string;
    name: string;
    postalCode: string;
}

// 아래 TCartItem과 같은 형태
// export interface IProduct {
//     id: string;
//     brand: string;
//     category: string;
//     desc: string;
//     imageURL: string;
//     name: string;
//     price: number;
//     createdAt: string;
//     cartQuantity: number;
// }

export type TCartItem = IProduct & {
    cartQuantity: number;
};

export interface IOrder {
    id: string;
    orderAmount: number;
    orderDate: string;
    orderStatus: string;
    orderTime: string;
    userEmail: string;
    userID: string;
    cartItems: TCartItem[];
    shippingAddress: IShippingAddress;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
}

export interface IMessage {
    sender: string;
    photoURL: string;
    text: string;
    timestamp: {
        nanosecond: number;
        seconds: number;
    };
}

export interface IChat {
    id: string;
    users: string[];
    usersData: User[];
    timestamp: {
        nanosecond: number;
        seconds: number;
    };
}
