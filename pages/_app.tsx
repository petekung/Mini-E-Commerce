// pages/_app.js
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import {Provider} from './orderContext'
import UserContext from './userContext';
function App({ Component, pageProps }) {

  const [carts , setCarts] = useState([]);
  const [userId , setUserId] = useState();
  useEffect(()=>{
    //  console.log(carts)
  },[carts])
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <UserContext.Provider value={{ userId ,setUserId}}>
      <Provider value={{ carts , setCarts }}>
        <Component {...pageProps} />
      </Provider>
      </UserContext.Provider>

    </>
  )
}
export default App