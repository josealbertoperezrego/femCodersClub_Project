import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleAuthenticationController } from './google-authentication.controller';
import { GoogleAuthenticationService } from './google-authentication.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, UserModule, AuthModule],
  providers: [GoogleAuthenticationService],
  controllers: [GoogleAuthenticationController],
  exports: []
})
export class GoogleAuthenticationModule {}
