import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Never reject. Populate req.user when a valid token is present, else leave it undefined.
  handleRequest<TUser = any>(_err: unknown, user: TUser): TUser {
    return (user || undefined) as TUser;
  }
}
