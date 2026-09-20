import { Component, inject } from "@angular/core";
import { AuthService } from "../../../core/services/auth.service";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
    selector: 'app-sidebar',
    standalone: true,
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    imports: [RouterLink, RouterLinkActive]
})

export class SidebarComponent {
    private authService = inject(AuthService);
    role = this.authService.role;
}