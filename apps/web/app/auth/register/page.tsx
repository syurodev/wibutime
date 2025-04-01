'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { register } from '@/actions/auth/auth';
import {
  IRegisterValidationSchema,
  registerValidationSchema,
} from '@/validation/zod/auth/register.schema';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const registerForm = useForm<IRegisterValidationSchema>({
    resolver: zodResolver(registerValidationSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleRegister = async (values: IRegisterValidationSchema) => {
    try {
      setIsLoading(true);

      // Gọi API đăng ký
      const result = await register(values);

      if (result.status === 0) {
        // Hiển thị thông báo thành công
        alert('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');

        // Chuyển hướng đến trang đăng nhập
        router.push('/auth/login');
      } else {
        // Hiển thị thông báo lỗi
        alert(result.message || 'Có lỗi xảy ra khi đăng ký.');
      }
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      alert('Có lỗi xảy ra khi đăng ký.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      {/* Left Panel - Image Section */}
      <div className="hidden lg:flex relative bg-gradient-to-b from-teal-500 via-cyan-600 to-blue-700 p-12">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col text-white">
          <div className="text-sm font-medium mb-4">WIBUTIME</div>
          <div className="mt-auto">
            <h1 className="text-5xl font-bold tracking-tight mb-4">
              Bắt đầu hành trình
              <br />
              mới
            </h1>
            <p className="text-lg opacity-90">
              Chào mừng đến với cộng đồng Wibutime.
              <br />
              Nơi thỏa mãn đam mê và sở thích của bạn.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
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
            <CardTitle className="text-3xl">Tạo tài khoản mới</CardTitle>
            <CardDescription>
              Nhập thông tin để tạo tài khoản của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(handleRegister)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <FormField
                    control={registerForm.control}
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
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
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

                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xác nhận mật khẩu</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <Button
                    className="w-full h-12 rounded-full"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
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
                    Đăng ký với Google
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <span>Đã có tài khoản? </span>
                  <Link
                    href="/auth/login"
                    className="font-medium text-foreground hover:underline"
                  >
                    Đăng nhập
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
