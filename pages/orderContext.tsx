import { createContext } from "react";

export type ProductContext = {
    carts:any[];
    setCarts:(t:any[]) => void;
    // name:string[];
    // price:number[];
    // img:string[];
    // quantiy:number[]

};

const OrderContext = createContext<ProductContext>({
    carts:[],
    setCarts: ()=> {} ,
})

export default OrderContext;
export const {Provider , Consumer} = OrderContext;

