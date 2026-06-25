import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../core/services/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule],
    standalone: true,
    templateUrl: './login.component.html'
})

export class LoginComponent {

    error = signal<string>('');

    private fb= inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm = this.fb.group({
            email: ['',
                [Validators.required,
                Validators.email]
            ],
            password: ['',
                [Validators.required]
            ]
        });

    async onSubmit() {
        try {
            await this.authService.login(this.loginForm.value.email ?? '', this.loginForm.value.password ?? '');
            this.router.navigate(['/dashboard']);
        } catch(error) {
            this.error.set('Invalid Credentials');
        }
        
    }
}