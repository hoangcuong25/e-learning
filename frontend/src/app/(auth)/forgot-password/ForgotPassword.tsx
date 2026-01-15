/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useRef, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

const ForgotPassword = () => {
    axios.defaults.withCredentials = true
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [isEmailSent, setIsEmailSent] = useState<boolean>(false)
    const [otp, setOtp] = useState<string>('')
    const [isOtpSubmited, setIsOtpSubmted] = useState(false)
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false)

    const [isloading, setIsLoading] = useState(false)

    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const handleInput = (e: any, index: number) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (e: any, index: number) => {
        if (e.key === "Backspace" && e.target.value === "" && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: any) => {
        const paste = e.clipboardData.getData('text')
        const pasteArray = paste.split('')
        pasteArray.forEach((char: any, index: number) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char
            }
        })
    }

    const onSubmitEmail = async (e: any) => {
        e.preventDefault()

        setIsLoading(true)
        try {
            const { data } = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/send-reset-otp', { email })
            if (data.statusCode === 201) {
                setIsEmailSent(true)
                toast.success("Mã OTP đã được gửi đến email của bạn")
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message)
        }
        finally {
            setIsLoading(false)
        }
    }

    const onSubmitOTP = async (e: any) => {
        e.preventDefault()
        const otpArray = inputRefs.current.map((e: any) => e.value)
        setOtp(otpArray.join(''))
        setIsOtpSubmted(true)
    }

    const onSubmitNewPassword = async (e: any) => {
        e.preventDefault()
        try {
            const { data } = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/reset-password', { email, otp, newPassword })
            if (data.statusCode === 201) {
                router.push('/login')
                toast.success('Đổi mật khẩu thành công')
            }
        } catch (error: any) {
            console.log(error.message)
            toast.error(error.response?.data?.message)
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gray-100'>
            {!isEmailSent &&
                <form onSubmit={onSubmitEmail} className='bg-white p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-gray-900 text-2xl font-semibold text-center mb-4'>Quên mật khẩu</h1>
                    <p className='text-center mb-6 text-gray-600'>Nhập địa chỉ email đã đăng ký của bạn</p>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-200'>
                        <input
                            type="email"
                            placeholder='Địa chỉ email'
                            className='bg-transparent outline-none text-gray-900 placeholder-gray-500 w-full'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button className="w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none disabled:opacity-50">{isloading ? 'Đang xử lý...' : 'Gửi mã'}</button>
                </form>
            }

            {!isOtpSubmited && isEmailSent &&
                <form onSubmit={onSubmitOTP} className='bg-white p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-gray-900 text-2xl font-semibold text-center mb-4'>Xác minh OTP</h1>
                    <p className='text-center mb-6 text-gray-600'>Nhập mã gồm 6 chữ số được gửi đến email của bạn</p>
                    <div className='flex justify-between mb-8' onPaste={handlePaste}>
                        {Array(6).fill(0).map((_, index) => (
                            <input
                                type="text"
                                maxLength={1}
                                key={index}
                                className='w-12 h-12 bg-gray-200 text-gray-900 text-center text-xl rounded-md border border-gray-300 focus:outline-indigo-500'
                                ref={e => { inputRefs.current[index] = e }}
                                onInput={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                        ))}
                    </div>
                    <button className="w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none disabled:opacity-50">Xác nhận</button>
                </form>
            }

            {isOtpSubmited && isEmailSent &&
                <form onSubmit={onSubmitNewPassword} className='bg-white p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-gray-900 text-2xl font-semibold text-center mb-4'>Mật khẩu mới</h1>
                    <p className='text-center mb-6 text-gray-600'>Nhập mật khẩu mới bên dưới</p>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-200 relative'>
                        <input
                            type={`${isShowPassword ? 'text' : 'password'}`}
                            placeholder='Mật khẩu mới'
                            className='bg-transparent outline-none text-gray-900 placeholder-gray-500 w-full'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        {isShowPassword ?
                            <FaRegEye onClick={() => setIsShowPassword(false)} className='absolute top-3.5 right-3.5 cursor-pointer text-gray-600' />
                            :
                            <FaRegEyeSlash onClick={() => setIsShowPassword(true)} className='absolute top-3.5 right-3.5 cursor-pointer text-gray-600' />
                        }
                    </div>
                    <button className="w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none disabled:opacity-50">Đổi mật khẩu</button>
                </form>
            }
        </div>
    )
}

export default ForgotPassword