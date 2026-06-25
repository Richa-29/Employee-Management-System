import { Component, inject } from "@angular/core";
import { AuthService } from "../../../core/services/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-sidebar',
    standalone: true,
    templateUrl: './sidebar.component.html'
})

export class SidebarComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    role = this.authService.role;
}