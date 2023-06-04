import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCartItems, payProducts, removeCartItem } from '../../store/thunkFunctions'
import CartTable from './Sections/CartTable'

const CartPage = () => {
  const userData = useSelector(state => state.user?.userData)
  const cartDetail = useSelector(state => state.user?.cartDetail)
  const dispatch = useDispatch()

  const [total, setTotal] = useState(0)

  useEffect(() => {
    let cartItemIds = []

    if(userData?.cart && userData.cart.length > 0) {
      userData.cart.forEach(item => {
        cartItemIds.push(item.id)
      })

      const body = {
        cartItemIds,
        userCart : userData.cart
      }

      dispatch(getCartItems(body))
    }
  }, [userData, dispatch])

  useEffect(() => {
    carculateTotal(cartDetail)
  }, [cartDetail])

  const carculateTotal = cartItems => {
    let total = 0
    cartItems.map(item => {
      total += item.price * item.quantity
    })
    setTotal(total)
  }

  const handleRemoveCartItem = (productId) => {
    dispatch(removeCartItem(productId))
  }

  const handlePaymentClick = () => {
    dispatch(payProducts({ cartDetail : cartDetail }))
  }

  return (
    <div>
      <div className='text-center m-7'>
        <h2 className='text-2xl'>나의 장바구니</h2>
      </div>

      { cartDetail?.length > length > 0 ? 
      
        <>
          <CartTable products={cartDetail} onRemoveItem={handleRemoveCartItem} />
          <div className='mt-10'>
            <p><span className='font-bold'>합계 : </span>{ total } 원</p>
            <button
              className='text-white bg-black hover:bg-gray-500 py-2 px-4 rounded-lg mt-5'
              onClick={handlePaymentClick}
            >
              결제하기
            </button>
          </div>
        </>
        
        :
        <p>장바구니가 비었습니다.</p>
      }
    </div>
  )
}

export default CartPage
