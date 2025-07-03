import { Injectable } from '@nestjs/common';
import { WalletDto } from './dto/wallet.dto';

export interface Wallet {
  name: string;
  type: string

  balance: number;

}

@Injectable()
export class AppService {
  
  wallets: Wallet[] = []
  
  getBalance(user: string): number {
    const wallet = this.findWallet(user);
    if (wallet == null) return -1;

    return wallet.balance;
  }

  createWallet(wallet: WalletDto) {
    this.wallets.push({
      name: wallet.name,
      type: wallet.type,

      balance: 0
    })
    
  }

  private findWallet(user: string): Wallet {

      return this.wallets.find((w) => w.name == user)

  }
}
