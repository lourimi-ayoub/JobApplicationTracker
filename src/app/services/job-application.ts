import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { JobApplication } from '../models/job-application';

@Injectable({
  providedIn: 'root',
})
export class JobApplicationService {
  private readonly STORAGE_KEY = 'job_applications';

  private applicationsSubject = new BehaviorSubject<JobApplication[]>(this.loadFromStorage());

  public applications$: Observable<JobApplication[]> = this.applicationsSubject.asObservable();

  constructor() {
    this.applications$.subscribe((apps) => this.saveToStorage(apps));
  }

  getApplications(): JobApplication[] {
    return this.applicationsSubject.value;
  }

  addApplication(app: Omit<JobApplication, 'id'>): void {
    const newApp: JobApplication = {
      ...app,
      id: this.generateId(),
    };

    const current = this.applicationsSubject.value;
    this.applicationsSubject.next([...current, newApp]);
  }

  updateApplication(id: string, updates: Partial<JobApplication>): void {
    const current = this.applicationsSubject.value;
    const updated = current.map((app) => (app.id === id ? { ...app, ...updates } : app));
    this.applicationsSubject.next(updated);
  }

  deleteApplication(id: string): void {
    const current = this.applicationsSubject.value;
    const filtered = current.filter((app) => app.id !== id);
    this.applicationsSubject.next(filtered);
  }

  getApplicationById(id: string): JobApplication | undefined {
    return this.applicationsSubject.value.find((app) => app.id === id);
  }

  private saveToStorage(applications: JobApplication[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(applications));
  }

  private loadFromStorage(): JobApplication[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);

    return parsed.map((app: any) => ({
      ...app,
      appliedDate: new Date(app.appliedDate),
      interviewDate: app.interviewDate ? new Date(app.interviewDate) : undefined,
      deadline: app.deadline ? new Date(app.deadline) : undefined,
    }));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
