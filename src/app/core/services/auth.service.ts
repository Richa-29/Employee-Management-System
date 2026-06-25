import { Injectable, signal, computed } from '@angular/core';
import { SupabaseClientService } from '../supabase-client';
import { Employee } from '../models/employee.model';
import type { Session } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private session = signal<Session | null>(null);
  private currentEmployee = signal<Employee | null>(null);
  isInitialized = signal<boolean>(false);

  // Public read-only signals for the rest of the app
  user = this.currentEmployee.asReadonly();
  isAuthenticated = computed(() => this.session() !== null);
  role = computed(() => this.currentEmployee()?.role ?? null);

  constructor(private supabaseClient: SupabaseClientService) {
    this.initSession();
  }

  private async initSession() {
    const { data } = await this.supabaseClient.supabase.auth.getSession();
    this.session.set(data.session);
    if (data.session) {
      await this.loadEmployeeProfile(data.session.user.id);
    }

    // Listen for auth state changes (login, logout, token refresh)
    this.supabaseClient.supabase.auth.onAuthStateChange(async (_event, session) => {
      this.session.set(session);
      if (session) {
        await this.loadEmployeeProfile(session.user.id);
      } else {
        this.currentEmployee.set(null);
      }
    });

    this.isInitialized.set(true);
  }

  private async loadEmployeeProfile(userId: string) {
    const { data, error } = await this.supabaseClient.supabase
      .from('employees')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      this.currentEmployee.set(data as Employee);
    }
  }

  async login(email: string, password: string) {
    const { error } = await this.supabaseClient.supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
  }

  async logout() {
    await this.supabaseClient.supabase.auth.signOut();
  }
}