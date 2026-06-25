import { HttpInterceptorFn } from "@angular/common/http";
import { SupabaseClientService } from "../supabase-client";
import { from, switchMap } from "rxjs";
import { inject } from "@angular/core";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const supabase = inject(SupabaseClientService);
    return from(supabase.supabase.auth.getSession()).pipe(
        switchMap(({data}) => {
            const token = data.session?.access_token;
            if(token) {
                const cloned = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return next(cloned);
            }
            return next(req);
        })
    )
}