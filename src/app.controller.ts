import { Body, Controller, Get, HttpException, Param, Post, UseInterceptors, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { MainInterceptor} from './interceptors/app.interceptor';
import { AppUserValidationPipe } from './pipes/app.user.validation.pipe';
import { JoiValidationPipe } from './validation/joi.validation.pipe';
import { WalletSchema } from './validation/schemas/wallet.schema';
import { WalletDto } from './dto/wallet.dto';

@UseInterceptors(MainInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("balance/:user")
  getBalance(@Param("user", AppUserValidationPipe) user: string) {
    const balance = this.appService.getBalance(user);

    if (balance == -1) {
      throw new HttpException("User not found", 500)
    }

    return {
      "user": user,
      "balance": balance
    }
  }

  @UsePipes(new JoiValidationPipe(WalletSchema))
  @Post("wallet")
  createWallet(@Body() body : WalletDto) {
    return body;
  }
}
