import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JobApplicationService } from '../../services/job-application';
import { JobApplication } from '../../models/job-application';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Stats {
  total: number;
  applied: number;
  interviewing: number;
  accepted: number;
  rejected: number;
  upcomingInterviews: JobApplication[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  stats$!: Observable<Stats>;

  constructor(private jobService: JobApplicationService) {}

  ngOnInit(): void {
    this.stats$ = this.jobService.applications$.pipe(map((apps) => this.calculateStats(apps)));
  }

  private calculateStats(applications: JobApplication[]): Stats {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return {
      total: applications.length,
      applied: applications.filter((a) => a.status === 'Applied').length,
      interviewing: applications.filter((a) => a.status === 'Interviewing').length,
      accepted: applications.filter((a) => a.status === 'Accepted').length,
      rejected: applications.filter((a) => a.status === 'Rejected').length,
      upcomingInterviews: applications
        .filter((a) => a.interviewDate && a.interviewDate >= now && a.interviewDate <= nextWeek)
        .sort((a, b) => a.interviewDate!.getTime() - b.interviewDate!.getTime()),
    };
  }
}
