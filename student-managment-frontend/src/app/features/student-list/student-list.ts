import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  Search,
  Filter,
  Calendar,
  X,
  CheckCircle,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase
} from 'lucide-angular';
import { Table, TableColumn } from '../../shared/table/table';
import { EnrollmentService, Student } from '../../core/services/enrollment.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, Table],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList implements OnInit {

  students: Student[] = [];
  filteredStudents: Student[] = [];

  SearchIcon = Search;
  FilterIcon = Filter;
  CalendarIcon = Calendar;
  XIcon = X;
  CheckIcon = CheckCircle;
  UserIcon = User;
  MailIcon = Mail;
  PhoneIcon = Phone;
  MapIcon = MapPin;
  GraduationIcon = GraduationCap;
  BriefcaseIcon = Briefcase;

  courses: string[] = [
    'Computer Engineering','Mechanical Engineering','Civil Engineering','Electronics',
    'Information Technology','Data Science','AI & ML',
    'Urban Design','Interior Design','Sustainable Architecture',
    'Finance','Marketing','Human Resources','Operations','General Management','International Business',
    'Pharmacology','Pharmaceutics','Pharmaceutical Chemistry','Clinical Pharmacy',
    'Computer Science','Biotechnology','Microbiology','Accounting & Finance','Banking & Insurance','Business Management'
  ];

  columns: TableColumn[] = [
    { key: 'name', label: 'Name', type: 'text', sort: true },
    { key: 'admissionNo', label: 'Admission No.', type: 'badge', sort: true },
    { key: 'course', label: 'Course', type: 'text', sort: true },
    { key: 'year', label: 'Year', type: 'number', sort: true },
    { key: 'semester', label: 'Semester', type: 'text', sort: true },
    { key: 'department', label: 'Department', type: 'text', sort: true },
    { key: 'actions', label: 'Actions', type: 'action' }
  ];

  searchQuery = '';
  selectedCourse = '';
  startDate = '';
  endDate = '';

  selectedStudent: Student | null = null;
  showViewModal = false;

  isLoading = false;
  private searchSubject = new Subject<string>();

  constructor(
    private enrollmentService: EnrollmentService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.applyFilters());

    // 🔥 FIX
    setTimeout(() => this.applyFilters(), 0);
  }

  applyFilters() {
    this.isLoading = true;

    this.enrollmentService.getStudents(
      this.searchQuery,
      this.selectedCourse,
      this.startDate,
      this.endDate
    ).subscribe({
      next: (data) => {
        this.students = [...data];
        this.filteredStudents = [...data];
        this.isLoading = false;
        this.cdr.detectChanges(); // 🔥 fix
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange() {
    this.searchSubject.next(this.searchQuery);
  }

 onViewStudent(student: Student) {
  if (student.id) {
    this.enrollmentService.getStudentById(student.id).subscribe({
      next: (data) => {

        this.selectedStudent = { ...data }; // ✅ new reference
        this.showViewModal = true;

        this.cdr.detectChanges(); // 🔥 force UI update
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}

  onEditStudent(student: Student) {
    this.enrollmentService.setEditingStudent(student);
    this.router.navigate(['/enrollment']);
  }

  onDeleteStudent(student: Student) {
    if (student.id && confirm(`Delete ${student.name}?`)) {
      this.filteredStudents = this.filteredStudents.filter(s => s.id !== student.id);
      this.students = this.students.filter(s => s.id !== student.id);

      this.enrollmentService.deleteStudent(student.id).subscribe(() => {
        this.applyFilters();
      });
    }
  }

  closeModal() {
    this.showViewModal = false;
    this.selectedStudent = null;
  }
}