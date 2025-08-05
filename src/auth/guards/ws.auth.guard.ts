import { ExecutionContext, CanActivate, Injectable, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { WsException } from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { User } from "src/users/schemas/user.schema";

export type WsClient = Socket & { user: User }

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.jwt_token;

    if (!token) {
      throw new WsException('Unauthorized: No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      client.user = payload; 
      
      return true;

    } catch (error) {
      throw new WsException('Unauthorized: Invalid token');
    }
  }
}