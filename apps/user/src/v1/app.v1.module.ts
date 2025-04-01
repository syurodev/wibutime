import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';

import { VERSION_CONTROLLER_ENUM } from '@workspace/types';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

const routes: Routes = [
  {
    path: VERSION_CONTROLLER_ENUM.V1,
    children: [UserModule, AuthModule],
  },
];

@Module({
  imports: [RouterModule.register(routes), UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppV1Module {}
