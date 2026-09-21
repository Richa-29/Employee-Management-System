import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../core/services/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule],
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {

    error = signal<string | null>(null);

    private fb= inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    ngOnInit(): void {
         this.loginForm.valueChanges.subscribe(() => {
            this.error.set(null);
        });
    }

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
        this.error.set(null);
        try {
            await this.authService.login(this.loginForm.value.email ?? '', this.loginForm.value.password ?? '');
            this.router.navigate(['/shell']);
        } catch(error) {
            this.error.set('Invalid Credentials');
        }
    }
}