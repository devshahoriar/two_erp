/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { LoadingButton } from "@/components/shared/CustomButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateError } from "@/lib/utils";
import Link from "next/link";
import { loginUser } from "./action";
import { loginType } from "./type";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  const router = useRouter();

  const validateForm = () => {
    const p = loginType.safeParse(formData);
    if (!p.success) {
      setFormError(validateError(p));
      return false;
    }
    setFormError("");
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const res = await loginUser(formData);
    if (!res.success) {
      setFormError(res.message);
      setIsLoading(false);
      return;
    }
    router.push("/admin");
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 h-screen w-screen overflow-hidden">
        <img
          className="h-full w-full object-cover"
          alt="Random image"
          src="https://random-image-pepebigotes.vercel.app/api/random-image"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md bg-white/20 shadow-xl backdrop-blur-md dark:bg-black/20">
          <CardHeader className="space-y-1">
            <div className="mb-6 flex items-center justify-center">
              <h2 className="text-center text-3xl font-bold">GCO Erp</h2>
            </div>
            <CardTitle className="text-center text-2xl">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="placeholder:/60 border-white/10 bg-white/30"
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
                  className="placeholder:/60 border-white/10 bg-white/30"
                />
              </div>

              {formError && <p className="text-sm text-red-300">{formError}</p>}

              <LoadingButton
                type="submit"
                className="w-full bg-white/90 text-slate-900 hover:bg-white"
                disabled={isLoading}
              >
                Sign in
              </LoadingButton>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="/80 mt-2 text-center text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="hover:/80 underline">
                Register here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
