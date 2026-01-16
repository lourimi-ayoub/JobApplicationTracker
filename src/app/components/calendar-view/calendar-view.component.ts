import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { JobApplicationService } from '../../services/job-application';
import { JobApplication } from '../../models/job-application';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    RouterLink,
  ],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css'],
})
export class CalendarViewComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right:"today",
    },
     buttonText: {
      prev: '← Previous',
      next: ' Next →',
      today: 'Today'
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    height: 'auto',
  };

  selectedEvent: { company: string; position: string; date: Date; type: string } | null = null;

  constructor(private jobService: JobApplicationService) {}

  ngOnInit(): void {
    
    this.jobService.applications$.subscribe((apps) => {
      this.calendarOptions.events = this.convertToCalendarEvents(apps);
    });
  }

  private convertToCalendarEvents(applications: JobApplication[]): EventInput[] {
    const events: EventInput[] = [];

    applications.forEach((app) => {
      // Add interview dates
      if (app.interviewDate) {
        events.push({
          title: `Interview: ${app.company}`,
          start: app.interviewDate,
          backgroundColor: '#4caf50',
          borderColor: '#4caf50',
          extendedProps: {
            company: app.company,
            position: app.position,
            type: 'Interview',
          },
        });
      }

      // Add deadlines
      if (app.deadline) {
        events.push({
          title: `Deadline: ${app.company}`,
          start: app.deadline,
          backgroundColor: '#F44336',
          borderColor: '#f44336',
          extendedProps: {
            company: app.company,
            position: app.position,
            type: 'Deadline',
          },
        });
      }
    });

    return events;
  }

  handleEventClick(info: any): void {
    this.selectedEvent = {
      company: info.event.extendedProps.company,
      position: info.event.extendedProps.position,
      date: info.event.start,
      type: info.event.extendedProps.type,
    };
  }
}
