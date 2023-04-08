import { createContext } from "react";

export type UsersContext = {
    userId:string;
    setUserId:(t:any) => void;
 
};

const UserContext = createContext<UsersContext>({
    userId:"",
    setUserId: ()=> {} 
})

export default UserContext;
export const {Provider , Consumer} = UserContext;

