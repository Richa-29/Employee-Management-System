import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";

@Component ({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent {
    private authService = inject(AuthService);
    role = computed(() => this.authService.role() ?? 'admin'); 
    //we have made this computed to handle null values, if null it will be 'admin'
}