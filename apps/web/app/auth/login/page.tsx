'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { getDeviceInfo, login } from '@/actions/auth/auth';
import {
  ILoginValidationSchema,
  loginValidationSchema,
} from '@/validation/zod/auth/login.schema';
import { BaseResponse } from '@workspace/commons';
import { Session } from '@workspace/types';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<ILoginValidationSchema>({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: {
      username: '',
      password: '',
      deviceId: '',
      deviceName: '',
      deviceType: '',
    },
  });

  const handleLogin = async (values: ILoginValidationSchema) => {
    try {
      setIsLoading(true);

      // Lấy thông tin thiết bị
      const deviceInfo = await getDeviceInfo();

      // Gộp thông tin đăng nhập và thông tin thiết bị
      const loginData = {
        ...values,
        ...deviceInfo,
      };

      // Gọi API đăng nhập
      const result: BaseResponse<Session> = await login(loginData);

      if (result.status === 0) {
        toast.success('Đăng nhập thành công');

        // Lưu thông tin phiên đăng nhập
        localStorage.setItem('token', result?.data?.token.access_token);
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: result.data.user.id,
            username: result.data.user.username,
            email: result.data.user.email,
            roles: result.data.user.roles,
            permissions: result.data.user.permissions,
            avatar: result.data.user.avatar,
          }),
        );

        // Chuyển hướng về trang chủ
        router.push('/');
      } else {
        toast.error(result.message || 'Có lỗi xảy ra khi đăng nhập.');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      toast.error('Có lỗi xảy ra khi đăng nhập.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      {/* Left Panel - Quote Section */}
      <div className="hidden lg:flex relative bg-gradient-to-b from-pink-500 via-purple-500 to-blue-600 p-12">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col text-white">
          <div className="text-sm font-medium mb-4">A WISE QUOTE</div>
          <div className="mt-auto">
            <h1 className="text-5xl font-bold tracking-tight mb-4">
              Get Everything
              <br />
              You Want
            </h1>
            <p className="text-lg opacity-90">
              You can get everything you want if you work hard,
              <br />
              trust the process, and stick to the plan.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardHeader className="space-y-2">
            <div className="flex justify-end">
              <Image
                src="/cogie-logo.png"
                alt="Cogie"
                width={24}
                height={24}
                className="opacity-80"
              />
            </div>
            <CardTitle className="text-3xl">Chào mừng trở lại</CardTitle>
            <CardDescription>
              Nhập tên đăng nhập và mật khẩu để truy cập tài khoản của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên đăng nhập</FormLabel>
                        <FormControl>
                          <Input placeholder="Tên đăng nhập" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Mật khẩu"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    Quên mật khẩu
                  </Link>
                </div>

                <div className="space-y-4">
                  <Button
                    className="w-full h-12 rounded-full"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-full"
                    type="button"
                    disabled={isLoading}
                  >
                    <Image
                      src="/google.svg"
                      alt="Google"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Đăng nhập với Google
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <span>Chưa có tài khoản? </span>
                  <Link
                    href="/auth/register"
                    className="font-medium text-foreground hover:underline"
                  >
                    Đăng ký
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
