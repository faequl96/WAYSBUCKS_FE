import { createContext, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import React, { useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { API, setAuthToken } from '../config/Api';
import { UserContext } from './UserContext';


export const AppContext = createContext();

export const AppContextProvider = ({children}) => {

   const [, dispatch] = useContext(UserContext);

   // ==================================================================================================================================
   // GLOBAL STATES ====================================================================================================================
   // ==================================================================================================================================

   const [isLogin, setIsLogin] = useState(false);
   const [loginMessage, setLoginMessage] = useState('');
   const [regisMessage, setRegisMessage] = useState('');
   const [showLogin, setShowLogin] = useState(false);
   const [showRegister, setShowRegister] = useState(false);
   const [cartLength, setCartLength] = useState();

   // ==================================================================================================================================
   // FORMAT CURRENCY ==================================================================================================================
   // ==================================================================================================================================

   let formatCurrency = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
   });

   // ==================================================================================================================================
   // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // ==================================================================================================================================
   // ////////////////////////////////////////////////////// HANDLER AUTH //////////////////////////////////////////////////////////////
   // ==================================================================================================================================
   // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // ==================================================================================================================================

   // ==================================================================================================================================
   // CHECK USER AUTH ==================================================================================================================
   // ==================================================================================================================================

   const checkUserAuth = async () => {
      try {
         if (localStorage.token) {
            setAuthToken(localStorage.token);
            const response = await API.get("/check-auth");
            let payload = response.data.data;
            payload.token = localStorage.token;
      
            dispatch({
               type: "USER_SUCCESS",
               payload,
            });

            const resCart = await API.get("/cart");
            if(resCart.data.data !== 0) {
               setCartLength(resCart.data.data.length)
            }

            setIsLogin(true)
         }
      } catch (error) {
        console.log(error);
      }
   };

   useEffect(() => {
      checkUserAuth()
   }, [showLogin])

   // ==================================================================================================================================
   // HANDLER REGISTER =================================================================================================================
   // ==================================================================================================================================

   const [regisData, setRegisData] = useState({
		name: '',
		email: '',
		password: '',
		role: '',
	});

   const OnChangeFormRegis = (e) => setRegisData({ ...regisData, [e.target.name]: e.target.value })

	const handlerRegister = useMutation(async(e) => {
		try {
			e.preventDefault();

			const config = {headers: {"Content-type": "application/json"}}
			const body = JSON.stringify(regisData);
			await API.post('/register', body, config);

			setShowRegister(false);
			setShowLogin(true);
			setRegisMessage('');
			setRegisData({...regisData, email: '', password: '', fullName: '', role: ''});

		} catch (error) {
			const alert = (
				<Alert className='fs-6 fw-bolder text-center' variant={'danger'}>
					{error.response.data.message}
				</Alert>
			);
			setRegisMessage(alert);
		}
	});

   // ==================================================================================================================================
   // HANDLER REGISTER =================================================================================================================
   // ==================================================================================================================================

   const [loginData, setLoginData] = useState({
      email: "",
      password: ""
   });

   const OnChangeFormLogin = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value })

   const handlerLogin = useMutation(async(e) => {
      try {
         e.preventDefault();

         const config = {headers: {"Content-type": "application/json"}}
         const body = JSON.stringify(loginData);
         const response = await API.post("/login", body, config);
         dispatch({type: "LOGIN_SUCCESS", payload: response.data.data});

         const resCart = await API.get("/cart");

         console.log(resCart.data.data);

         if(resCart?.data.data === 0) {
            setCartLength(0)
            // console.log(resCart.data.data);
         } else {
            setCartLength(resCart.data.data.length)
            // console.log(resCart.data.data.length);
         }

         setIsLogin(true);
         setShowLogin(false);
         setLoginMessage('');
         setLoginData({email: "", password: ""})

      } catch (err) {
         console.log(err);
         const alert = (
            <Alert className='fs-6 fw-bolder text-center' variant={'danger'}>
               {err.response.data.message}
            </Alert>
         );
         setLoginMessage(alert);
      }
   });

   // ==================================================================================================================================
   // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // ==================================================================================================================================
   // //////////////////////////////////////////////////// HANDLER lANDINGPAGE /////////////////////////////////////////////////////////
   // ==================================================================================================================================
   // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // ==================================================================================================================================

   let { data: products } = useQuery("productsCache", async () => {
      const response = await API.get("/products");
      return response.data.data;
   });

   // ==================================================================================================================================
   // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // ==================================================================================================================================
   // ////////////////////////////////////////////////// HANDLER PRODUCT DETAIL ////////////////////////////////////////////////////////
   // ==================================================================================================================================
   // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // ==================================================================================================================================


    
   const appContextsValue = {
      isLogin,
      setIsLogin,
      loginMessage,
      setLoginMessage,
      regisMessage,
      setRegisMessage,
      
      showLogin,
      setShowLogin,
      showRegister,
      setShowRegister,

      cartLength,
      setCartLength,

      formatCurrency,
      
      checkUserAuth,
      regisData,
      OnChangeFormRegis,
      handlerRegister,
      loginData,
      OnChangeFormLogin,
      handlerLogin,

      products
   }
   return(
      <AppContext.Provider value={appContextsValue}>
         {children}
      </AppContext.Provider>
   )
}