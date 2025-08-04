import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HotelsModule } from './hotels/hotels.module';
import { SupportRequestModule } from './support/support.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { ReservationsModule } from './reservations/reservation.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),

    UserModule,
    AuthModule,
    
    HotelsModule,
    ReservationsModule,
    SupportRequestModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}