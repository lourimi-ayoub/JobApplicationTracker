import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobFormComponent } from './components/job-form/job-form.component';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'jobs', component: JobListComponent },
  { path: 'add', component: JobFormComponent },
  { path: 'edit/:id', component: JobFormComponent },
  { path: 'calendar', component: CalendarViewComponent },
  { path: '**', redirectTo: '/dashboard' }
];