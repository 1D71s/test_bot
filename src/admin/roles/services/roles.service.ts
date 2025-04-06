import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { Roles } from '../enums/roles.enum';
import { ChangeRoleDto } from '../dtos/requests/change-role.dto';
import { JwtPayloadUserInterface } from 'src/auth/interfaces/jwt-payload-user.interface';
import { MessageInterface } from 'src/common/dto/responses/message.response';

@Injectable()
export class RolesService {
    constructor(
        private readonly userService: UsersService,
    ) {}

    async updateRole(query: ChangeRoleDto, user: JwtPayloadUserInterface): Promise<MessageInterface> {
        const { userId, newRole } = query;
        const checkAccess = this.checkRoleHierarchy(user.role ,newRole);

        if (!checkAccess) {
            throw new ForbiddenException('Access denied');
        }

        const userForNewRole = await this.userService.getOneById(userId)

        if (!userForNewRole) {
            throw new NotFoundException('Access denied');
        }

        const update = await this.userService.update(userId, {
            role: newRole,
        });

        if (!update) {
            throw new BadRequestException('Role not updated');
        }

        return { message: 'Role updated' };
    }

    public checkRoleHierarchy(userRole: string, requiredRole: string): boolean {
        const { OWNER, ADMIN, MANAGER, CUSTOMER } = Roles;
        const hierarchy: Record<string, string[]> = {
            [OWNER]: [ADMIN, MANAGER, CUSTOMER],
            [ADMIN]: [MANAGER, CUSTOMER],
            [MANAGER]: [CUSTOMER],
            [CUSTOMER]: [],
        };

        const allowedRoles = hierarchy[userRole];
        return allowedRoles ? allowedRoles.includes(requiredRole) : false;
    }
}
