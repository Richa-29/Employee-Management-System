import { Component, inject } from "@angular/core";
import { AuthService } from "../../../core/services/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-navbar',
    standalone: true,
    templateUrl: './navbar.component.html'
})

export class NavbarComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    user = this.authService.user;

    async logout() {
        await this.authService.logout();
        this.router.navigate(['']);
    }
}