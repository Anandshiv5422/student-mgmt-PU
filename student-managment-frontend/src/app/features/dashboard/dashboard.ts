import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-angular';
import { EnrollmentService, Student } from '../../core/services/enrollment.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  totalStudents = 0;
  totalLessons = 0;
  activeCourses = 0;
  totalDepartments = 0;
  isLoading = true;
  isBackendHealthy = false;

  recentStudents: Student[] = [];

  // Icons
  UsersIcon = Users;
  GraduationIcon = GraduationCap;
  BookIcon = BookOpen;
  LayersIcon = Layers;
  ArrowRightIcon = ArrowRight;
  CheckIcon = CheckCircle;
  ClockIcon = Clock;

  constructor(
    private enrollmentService: EnrollmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;
    console.log('Loading dashboard stats...');
    this.enrollmentService.getDashboardStats().subscribe({
      next: (data) => {
        
    console.log(data);
        this.totalStudents = data.totalStudents || 0;
        this.totalLessons = data.totalLessons || 0;
        this.activeCourses = data.activeCourses || 0;
        this.totalDepartments = data.totalDepartments || 0;
        this.recentStudents = data.recentStudents || [];

        this.isBackendHealthy = true;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Dashboard API error:', err);
        this.isBackendHealthy = false;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}