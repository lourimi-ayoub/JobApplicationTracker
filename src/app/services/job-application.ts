import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { JobApplication } from '../models/job-application';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private readonly STORAGE_KEY = 'job_applications';
  
  // BehaviorSubject holds current state and emits to all subscribers
  private applicationsSubject = new BehaviorSubject<JobApplication[]>(this.loadFromStorage());
  
  // Public Observable that components subscribe to
  public applications$: Observable<JobApplication[]> = this.applicationsSubject.asObservable();

  constructor() {
    // Auto-save to localStorage whenever data changes
    this.applications$.subscribe(apps => this.saveToStorage(apps));
  }

  // Get current snapshot of applications (non-reactive)
  getApplications(): JobApplication[] {
    return this.applicationsSubject.value;
  }

  // Add new application
  addApplication(app: Omit<JobApplication, 'id'>): void {
    const newApp: JobApplication = {
      ...app,
      id: this.generateId()
    };
    
    const current = this.applicationsSubject.value;
    this.applicationsSubject.next([...current, newApp]);
  }

  // Update existing application
  updateApplication(id: string, updates: Partial<JobApplication>): void {
    const current = this.applicationsSubject.value;
    const updated = current.map(app => 
      app.id === id ? { ...app, ...updates } : app
    );
    this.applicationsSubject.next(updated);
  }

  // Delete application
  deleteApplication(id: string): void {
    const current = this.applicationsSubject.value;
    const filtered = current.filter(app => app.id !== id);
    this.applicationsSubject.next(filtered);
  }

  // Get single application by ID
  getApplicationById(id: string): JobApplication | undefined {
    return this.applicationsSubject.value.find(app => app.id === id);
  }

  // LOCALSTORAGE PERSISTENCE
  private saveToStorage(applications: JobApplication[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(applications));
  }

  private loadFromStorage(): JobApplication[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    return parsed.map((app: any) => ({
      ...app,
      appliedDate: new Date(app.appliedDate),
      interviewDate: app.interviewDate ? new Date(app.interviewDate) : undefined,
      deadline: app.deadline ? new Date(app.deadline) : undefined
    }));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}