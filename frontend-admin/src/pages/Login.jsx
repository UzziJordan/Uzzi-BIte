import React from 'react'
import image from '../assets/loggin.jpg'
import logo from '../assets/Background.png'

const Login
 = () => {
  return (
    <div className='flex h-screen'>
        <div
            className='h-screen w-[33vw] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center'
            style={{ backgroundImage: `url(${image})` }}
            >

            <img src={logo} alt="Uzzi Bites Logo" className='object-contain' />
            <h1 className='text-[#FFFFFF] text-[36px] font-bold '>Uzzi Bites</h1>
            <p className='text-[#9CA3AF] text-[18px] font-medium '>Admin Portal</p>
        </div>

        <div className='flex items-center justify-center flex-1'>
            <form action="login" method="POST" className=' flex flex-col'>
                <h1 className='text-[#222222] text-[30px] font-bold '>Welcome Back!</h1>
                <p className='text-[#6B7280] text-[16px] '>Please Login to your account</p>
                
                <div className='mt-10 flex flex-col gap-6'>
                    <input className='bg-[#FFFFFF] border border-[#E8ECEF] text-[#9CA3AF] text-[16px] py-3 px-4 rounded-2xl' type="text" placeholder="Email Address" />
                    <input className='bg-[#FFFFFF] border border-[#E8ECEF] text-[#9CA3AF] text-[16px] py-3 px-4 rounded-2xl' type="password" placeholder="Password" />
                    
                    <div className='flex gap-2 items-center'>
                        <input type="checkbox" className="appearance-none w-4 h-4 border border-red-500 rounded checked:bg-red-500 checked:border-red-500" id="remember" name="remember" />
                        <label htmlFor="remember" className='text-[16px]'>Remember Me</label>
                    </div>

                    <button type="submit" className='text-[16px] font-semibold bg-[#E63946] text-white rounded-2xl py-2 '>Login</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login