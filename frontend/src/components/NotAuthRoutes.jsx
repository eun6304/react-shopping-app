// 로그인 된 사람이 로그인 페이지나 회원가입 페이지 가려고 하면 메인 페이지로 리다이렉팅
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const NotAuthRoutes = ({ isAuth }) => {

  return (
    isAuth ? <Navigate to={'/'} /> : <Outlet />
  )
}

export default NotAuthRoutes
