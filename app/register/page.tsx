/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { LoadingButton } from '@/components/shared/CustomButton' 
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { validateError } from '@/lib/utils'
import { registerUse } from './action'
import { registerType } from './type'

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  })
  const [formError, setFormError] = useState('')

  const router = useRouter()

  const validateForm = () => {
    const x = registerType.safeParse(formData)
    setFormError(validateError(x))
    return x.success
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
    setFormError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    const res = await registerUse(formData)
    if (!res.success) {
      setFormError(res.message)
      setIsLoading(false)
      return
    }
    router.push('/login')

    setIsLoading(false)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 w-screen h-screen overflow-hidden">
        <img
          className=" h-full object-cover w-full"
          alt="Random image"
          src="https://random-image-pepebigotes.vercel.app/api/random-image"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md bg-white/20 dark:bg-black/20 backdrop-blur-md shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-3xl font-bold text-center ">GCO Inventory</h2>
            </div>
            <CardTitle className="text-2xl text-center ">
              Create an Account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your information to register
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-white/30 border-white/10  placeholder:/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-white/30 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-white/30 border-white/10  placeholder:/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-white/30 border-white/10  placeholder:/60"
                />
              </div>

              {formError && <p className="text-sm text-red-300">{formError}</p>}

              <LoadingButton
                type="submit"
                className="w-full bg-white/90 hover:bg-white text-slate-900"
                disabled={isLoading}
              >
                Register
              </LoadingButton>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-center /80 mt-2">
              Already have an account?{' '}
              <Link href="/login" className="underline  hover:/80">
                Login here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default RegisterPage
