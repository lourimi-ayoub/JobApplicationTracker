import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JobApplicationService } from '../../services/job-application';
import { JobApplication } from '../../models/job-application';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatTooltipModule,
  ],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css'],
})
export class JobListComponent implements OnInit {
  applications$!: Observable<JobApplication[]>;
  displayedColumns: string[] = [
    'company',
    'position',
    'status',
    'appliedDate',
    'interviewDate',
    'actions',
  ];

  constructor(private jobService: JobApplicationService) {}

  ngOnInit(): void {

    this.applications$ = this.jobService.applications$;
  }

  deleteApplication(id: string): void {
    if (confirm('Are you sure you want to delete this application?')) {
      this.jobService.deleteApplication(id);
    }
  }

  getStatusColor(status: string): string {
    const colors: any = {
      Applied: 'primary',
      Interviewing: 'accent',
      Accepted: 'success',
      Rejected: 'warn',
    };
    return colors[status] || 'primary';
  }
}
