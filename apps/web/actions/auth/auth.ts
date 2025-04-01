'use server';

import { collectDeviceInfo } from '@/lib/device-info';
import { fetchData } from '@/lib/fetch';
import { ILoginValidationSchema } from '@/validation/zod/auth/login.schema';
import { IRegisterValidationSchema } from '@/validation/zod/auth/register.schema';
import {
  AuthEndpointUtils,
  BaseResponse,
  PROJECT_ID,
} from '@workspace/commons';
import { Session } from '@workspace/types';

export const login = async (
  init: ILoginValidationSchema,
): Promise<BaseResponse<Session>> => {
  return await fetchData<Session>({
    url: new AuthEndpointUtils().login,
    projectId: PROJECT_ID.USER,
    options: {
      method: 'POST',
      body: init,
    },
  });
};

export const register = async (init: IRegisterValidationSchema) => {
  const { confirmPassword, ...registerData } = init;

  return await fetchData({
    url: new AuthEndpointUtils().register,
    projectId: PROJECT_ID.USER,
    options: {
      method: 'POST',
      body: registerData,
    },
  });
};

export const getDeviceInfo = async () => {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return {
      deviceId: 'server-side',
      deviceName: 'Server',
      deviceType: 'server',
      deviceOs: 'Server OS',
      browserInfo: 'Server Browser',
    };
  }

  // Sử dụng hàm thu thập thông tin thiết bị
  return collectDeviceInfo();
};
