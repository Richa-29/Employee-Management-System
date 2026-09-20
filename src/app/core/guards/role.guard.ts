import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const roleGuard = (allowedRoles: string[]) => {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        const role = authService.role();
        if(role && allowedRoles.includes(role)) {
            return true;
        }
        router.navigate(['/shell/dashboard']);
        return false;

    }   
}