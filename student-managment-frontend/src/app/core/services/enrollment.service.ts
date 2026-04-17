import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

export interface Student {
  id?: string; 
  admissionNo?: string; 
  name: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  addressLine: string;
  city: string;
  state: string;
  zip: string;
  department: string;
  study: string;
  course: string;
  year: number;
  semester: string;
  photo?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private apiUrl = 'http://localhost:5000/api/students';

  private studentsSubject = new BehaviorSubject<Student[]>([]);
  private editingStudent = new BehaviorSubject<Student | null>(null);

  constructor(private http: HttpClient) {
    this.refreshStudents();
  }

  // =========================
  // 🔄 Refresh Data from API
  // =========================
  private refreshStudents() {
    this.http.get<Student[]>(this.apiUrl).subscribe({
      next: (students) => this.studentsSubject.next(students),
      error: (err) => console.error('Error fetching students:', err)
    });
  }

  // =========================
  // 📡 STREAM (for UI binding)
  // =========================
  getStudentsStream(): Observable<Student[]> {
    return this.studentsSubject.asObservable();
  }

  // =========================
  // 🔍 GET with Filters
  // =========================
  getStudents(
    search?: string,
    course?: string,
    startDate?: string,
    endDate?: string
  ): Observable<Student[]> {

    let params = new HttpParams();

    if (search) params = params.set('search', search);
    if (course) params = params.set('course', course);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<Student[]>(this.apiUrl, { params });
  }

  // =========================
  // 📄 GET BY ID
  // =========================
  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  // =========================
  // ➕ CREATE
  // =========================
  enrollStudent(studentData: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, studentData).pipe(
      tap(() => this.refreshStudents())
    );
  }

  // =========================
  // ✏️ UPDATE
  // =========================
  updateStudent(id: string, data: Partial<Student>): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, data).pipe(
      tap(() => this.refreshStudents())
    );
  }

  // =========================
  // ❌ DELETE
  // =========================
  deleteStudent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.refreshStudents())
    );
  }

  // =========================
  // 📝 Editing State
  // =========================
  setEditingStudent(student: Student | null) {
    this.editingStudent.next(student);
  }

  getEditingStudent(): Observable<Student | null> {
    return this.editingStudent.asObservable();
  }

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`);
  }

}