import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { filter, of, switchMap } from "rxjs";

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    return toObservable(authService.isInitialized).pipe(
        filter(initialized => initialized === true),
        switchMap(() => {
             if (authService.isAuthenticated()) {
                return of(true);
             } else {
                router.navigate(['']);
                return of(false);
             }
        })
    )   
};