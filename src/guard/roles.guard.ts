// roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role, ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log(roles);
    if (!roles) {
      return true;
    }

    const user = context.switchToHttp().getRequest();

    if (!user || !user.acesso) {
      return false;
    }
    console.log(
      roles.some((role) => user.acesso?.includes(role)),
      "verdade",
    );
    return roles.some((role) => user.acesso?.includes(role));
  }
}
