import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { JobApplicationService } from '../../services/job-application';
import { ApplicationStatus } from '../../models/job-application';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.css'],
})
export class JobFormComponent implements OnInit {
  jobForm!: FormGroup;
  isEditMode = false;
  editId: string | null = null;

  statuses: ApplicationStatus[] = ['Applied', 'Interviewing', 'Accepted', 'Rejected'];

  constructor(
    private fb: FormBuilder,
    private jobService: JobApplicationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

    
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.editId = id;
        this.loadApplication(id);
      }
    });
  }

  private initForm(): void {
    this.jobForm = this.fb.group({
      company: ['', Validators.required],
      position: ['', Validators.required],
      status: ['Applied', Validators.required],
      appliedDate: [new Date(), Validators.required],
      interviewDate: [null],
      deadline: [null],
      notes: [''],
    });
  }

  private loadApplication(id: string): void {
    const app = this.jobService.getApplicationById(id);
    if (app) {
      this.jobForm.patchValue({
        company: app.company,
        position: app.position,
        status: app.status,
        appliedDate: app.appliedDate,
        interviewDate: app.interviewDate || null,
        deadline: app.deadline || null,
        notes: app.notes || '',
      });
    }
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      const formValue = this.jobForm.value;

      if (this.isEditMode && this.editId) {
        // Update existing
        this.jobService.updateApplication(this.editId, formValue);
      } else {
        // Add new
        this.jobService.addApplication(formValue);
      }

      this.router.navigate(['/jobs']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/jobs']);
  }
}
