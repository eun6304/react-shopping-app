// 로그인 안된 사람이 로그인 된 사람만 들어갈 수 있는 곳 가면 로그인 페이지로 리다이렉팅
import React from 'react'
import { Outlet, Navigate } from "react-router-dom" 

const ProtectedRoutes = ({ isAuth }) => {
  return (
    isAuth ? <Outlet /> : <Navigate to={ "/login" }/>
  )
}

export default ProtectedRoutes
