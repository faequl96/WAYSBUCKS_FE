import React, { useContext } from 'react';
import { Card, Container } from 'react-bootstrap';
import { useNavigate } from "react-router-dom"
import { AppContext } from '../../contexts/AppContext';
import { UserContext } from '../../contexts/UserContext';

const MenuList = () => {
   const navigate = useNavigate();
   const contexts = useContext(AppContext);
   const [state,] = useContext(UserContext);

   return (
      <Container className='row justify-content-between m-auto pb-5' style={{ padding : "0 76px" }}>
         {contexts.isLogin ? (
            <>
               {state.user.role === 'customer' ? (
                  <h1 className='text-danger fw-bolder'>Let's Order</h1>
               ) : (
                  <h1 className='text-danger fw-bolder'>Your Menu</h1>
               )}
            </>
         ) : (
            <h1 className='text-danger fw-bolder'>Let's Order</h1>
         )}
            
         {contexts.products?.map((item, index) => (
            <div key={index} className='col-3 p-3'>
               <Card 
                  className='rounded-4 overflow-hidden' 
                  style={{ width: '100%', backgroundColor : '#f4dcdc', cursor: 'pointer', borderColor: '#acacac' }} 
                  key={item.id} 
                  onClick={() => {
                     !contexts.isLogin
                     ? contexts.setShowLogin(true)
                     : navigate(`/menu/${item.id}/${item.title}`); 
                  }}
               >
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body className='pb-0'>
                     <h1 className='text-danger fw-bolder' style={{ fontSize: '1.05rem' }}>{item.title}</h1>
                     <p className='align-self-start fw-semibold' style={{color : "#984c4c"}}>{contexts.formatCurrency.format(item.price)}</p>
                  </Card.Body>
               </Card>
            </div>
         ))}
      </Container>
   );
}

export default MenuList;

