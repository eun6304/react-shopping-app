import { createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../utils/axios"

export const registerUser = createAsyncThunk(
  "user/registerUser",
  // payload Create
  async(body, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `/users/register`,
        body
      )
      // payload
      return response.data
    } catch(error) {
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data || error.message)
    }
  }
)
export const loginUser = createAsyncThunk(
  "user/loginUser",
  // payload Creator
  async(body, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `/users/login`,
        body
      )
      // payload
      return response.data
    } catch(error) {
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data || error.message)
    }
  }
)

export const authUser = createAsyncThunk(
  "user/authUser",
  // payload Creator
  async(_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/users/auth`
      )
      // payload
      return response.data
    } catch(error) {
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data || error.message)
    }
  }
)

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  // payload Creator
  async(_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/users/logout`
      )
      
      // payload
      return response.data
    } catch(error) {
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data || error.message)
    }
  }
)

export const addToCart = createAsyncThunk(
  "user/addToCart",
  // payload Creator
  async(body, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `/users/cart`,
        body
      )
      
      // payload
      return response.data
    } catch(error) {
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data || error.message)
    }
  }
)

export const getCartItems = createAsyncThunk(
  "user/getCartItems",
  // payload Creator
  async({ cartItemIds, userCart }, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/products/${cartItemIds}?type=array`,
      )
      
      // CartItem들에 해당하는 정보들을
      // Product Collection에서 가져온 후에
      // Quantity 정보를 넣어 준다.
      userCart.forEach(cartItem => {
        response.data.forEach((productDetail, index) => {
          if (cartItem.id === productDetail._id) {
            response.data[index].quantity = cartItem.quantity
          }
        })
      })
      return response.data
    } catch(error) {
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data || error.message)
    }
  }
)

export const removeCartItem = createAsyncThunk(
  "user/removeCartItem",
  // payload Creator
  async(productId, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(
        `/users/cart?productId=${productId}`,
      )
      
      // CartItem들에 해당하는 정보들을
      // Product Collection에서 가져온 후에
      // Quantity 정보를 넣어 준다.
      response.data.cart.forEach(cartItem => {
        response.data.productInfo.forEach((productDetail, index) => {
          if (cartItem.id === productDetail._id) {
            response.data.productInfo[index].quantity = cartItem.quantity
          }
        })
      })
      return response.data
    } catch(error) {
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data || error.message)
    }
  }
)

export const payProducts = createAsyncThunk(
  "user/payment",
  // payload Creator
  async(body, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `/users/payment`,
        body
      )
      
      return response.data
    } catch(error) {
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data || error.message)
    }
  }
)