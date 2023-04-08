import React, { useContext } from "react";
import { useEffect, useState } from "react";
import UserContext from "./userContext";
import { useRouter } from "next/router";


const App: React.FC = () => {
    const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState({
    displayName: "",
    userId: "",
    statusMessage: "",
    pictureUrl: "",
  });
  const {userId ,setUserId} = useContext(UserContext)
  let liff: any;
  useEffect(() => {
    liff = require("@line/liff");
    const lineLiff = async () => {
      try {
        await liff.init({ liffId: `${process.env.NEXT_PUBLIC_LIFF_ID}` });
      } catch (error) {
        console.error("liff init error");
      }
      if(liff.isLoggedIn()){
        // liff.login({ redirectUri:"https://pete-web.ngrok.1mobyline.com/login"})
      
        const lineProflie = await liff.getProfile();
        setProfile(lineProflie)
        setUserId(lineProflie.userId);

        router.push({
            pathname:"./searchProduct",query:{UID:userId}
        })
       
      }
      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri:`${process.env.NEXT_PUBLIC_FN_URL}`+"/login"});
       
      }
    
    };
    lineLiff();

   // console.log(process.env.NEXT_PUBLIC_LIFF_ID);
    console.log("userId",profile.userId);
     console.log(profile.displayName);
  }, [profile.userId]);

  return (
   <>
   </>
  );
};

export default App;