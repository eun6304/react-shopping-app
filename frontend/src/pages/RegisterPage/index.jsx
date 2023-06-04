import React from 'react'
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux'
import { registerUser } from '../../store/thunkFunctions'
const RegisterPage = () => {
  const { 
    register, 
    handleSubmit, 
    formState : { errors }, // 에러 났을때 만들어뒀던 에러 메세지 표출
    reset // value들 초기화
  } = useForm({ mode : 'onChange'})

  const dispatch = useDispatch();

  const onSubmit = ({ email, password, name }) => {
    const body = {
      email,
      password,
      name,
      image : `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png`
    }

    dispatch(registerUser(body))
    
    reset()
  }

  const userEmail = {
    required : "이메일을 입력해 주세요."
  }

  const userName = {
    required : "이름을 입력해 주세요."
  }

  const userPassword = {
    required : "비밀번호를 입력해 주세요.",
    minLength : {
      value : 6,
      message : "최소 6자 입니다."
    }
  }

  return (
    <section className='flex flex-col justify-center mt-20 max-w-[400px] m-auto'>
      <div className='p-6 bg-white rounded-md shadow-md'>
        <h1 className='text-3xl font-semibold text-center'>
          회원가입
        </h1>
        <form className='mt-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-2'>
            <label
              htmlFor='email'
              className='text-sm font-semibold text-gray-800'
            >Email</label>
            <input
              type="email"
              id="email"
              className='w-full px-4 py-2 mt-2 bg-white border rounded-md'
              {...register('email', userEmail)}
            />
          </div>

          {
            errors?.email &&
            <div>
              <span className='text-xs text-red-500'>
                {errors.email.message}
              </span>
            </div>
          }

          <div className='mb-2'>
            <label
              htmlFor='text'
              className='text-sm font-semibold text-gray-800'
            >Name</label>
            <input
              type="text"
              id="name"
              className='w-full px-4 py-2 mt-2 bg-white border rounded-md'
              {...register('name', userName)}
            />
          </div>

          {
            errors?.name &&
            <div>
              <span className='text-xs text-red-500'>
                {errors.name.message}
              </span>
            </div>
          }

          <div className='mb-2'>
            <label
              htmlFor='password'
              className='text-sm font-semibold text-gray-800'
            >Password</label>
            <input
              type="password"
              id="password"
              className='w-full px-4 py-2 mt-2 bg-white border rounded-md'
              {...register('password', userPassword)}
            />
          </div>

          {
            errors?.password &&
            <div>
              <span className='text-xs text-red-500'>
                {errors.password.message}
              </span>
            </div>
          }

          <div className='mt-6'>
            <button type="submit" className='w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 duration-200'>
              회원가입
            </button>
          </div>

          <p className='mt-8 text-xs font-light text-center text-gray-700'>
            아이디가 있다면?{" "}
            <a
              href='/login'
              className='font-medium hover:underline'
            >
              로그인
            </a>
          </p>
        </form>
      </div>
    </section>
  )
}

export default RegisterPage
