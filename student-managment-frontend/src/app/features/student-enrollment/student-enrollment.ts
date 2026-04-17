import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  Camera,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle
} from 'lucide-angular';
import { EnrollmentService, Student } from '../../core/services/enrollment.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-enrollment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './student-enrollment.html',
  styleUrl: './student-enrollment.css',
})
export class StudentEnrollment implements OnInit, OnDestroy {

  enrollmentForm!: FormGroup;
  showIdCard = false;
  imagePreview: string | null = null;
  submittedStudent: Student | null = null;
  isSubmitting = false;
  isEditing = false;
  editStudentId: string | undefined;
  errorMessage: string | null = null;

  private sub = new Subscription();

  // Icons
  Camera = Camera;
  User = User;
  Mail = Mail;
  Phone = Phone;
  Calendar = Calendar;
  MapPin = MapPin;
  Briefcase = Briefcase;
  GraduationCap = GraduationCap;
  CheckCircle = CheckCircle;

  // ✅ Static Dropdown Data
  departments: string[] = [
    'Engineering',
    'Architecture',
    'Management',
    'Pharmacy',
    'Commerce & Science'
  ];

  states: string[] = [
    'Maharashtra',
    'Gujarat',
    'Karnataka',
    'Delhi',
    'Tamil Nadu'
  ];

  semesters: string[] = [
    'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
    'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'
  ];

  // Dynamic dropdowns
  availableStudyPaths: string[] = [];
  availableCourses: string[] = [];
  availableCities: string[] = [];

  // Mapping Data
  private departmentStudyPaths: { [key: string]: string[] } = {
    'Engineering': ['BE', 'BTech', 'ME', 'MTech'],
    'Architecture': ['BArch', 'MArch'],
    'Management': ['MBA', 'MCA', 'BBA', 'BMS'],
    'Pharmacy': ['BPharm', 'MPharm', 'PharmD'],
    'Commerce & Science': ['BSc', 'MSc', 'BCom', 'MCom']
  };

  private studyCourses: { [key: string]: string[] } = {
    'BE': ['Computer Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Electronics'],
    'BTech': ['Information Technology', 'Data Science', 'AI & ML'],
    'ME': ['Structural Engineering', 'Machine Design'],
    'MTech': ['VLSI Design', 'Software Engineering'],
    'BArch': ['Urban Design', 'Interior Design'],
    'MArch': ['Sustainable Architecture'],
    'MBA': ['Finance', 'Marketing', 'HR', 'Operations'],
    'MCA': ['Cloud Computing', 'Full Stack Development'],
    'BBA': ['General Management', 'International Business'],
    'BMS': ['Marketing', 'Finance'],
    'BPharm': ['Pharmacology', 'Pharmaceutics'],
    'MPharm': ['Pharmaceutical Chemistry'],
    'PharmD': ['Clinical Pharmacy'],
    'BSc': ['Computer Science', 'IT', 'Biotechnology'],
    'MSc': ['Data Science', 'Microbiology'],
    'BCom': ['Accounting & Finance', 'Banking & Insurance'],
    'MCom': ['Business Management']
  };

  private cities: { [key: string]: string[] } = {
    'Maharashtra': ['Mumbai', 'Pune', 'Navi Mumbai', 'Panvel'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara'],
    'Karnataka': ['Bangalore', 'Mysore'],
    'Delhi': ['New Delhi'],
    'Tamil Nadu': ['Chennai', 'Coimbatore']
  };

  constructor(
    private fb: FormBuilder,
    private enrollmentService: EnrollmentService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setupDropdownLogic();
    this.checkForEditMode();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.enrollmentService.setEditingStudent(null);
  }

  // ✅ FORM INIT
  initForm() {
    this.enrollmentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      addressLine: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      department: ['', Validators.required],
      study: [{ value: '', disabled: true }, Validators.required],
      course: [{ value: '', disabled: true }, Validators.required],
      year: [new Date().getFullYear(), Validators.required],
      semester: ['', Validators.required],
      photo: [null]
    });
  }

  // ✅ DROPDOWN LOGIC
  setupDropdownLogic() {
    // Department → Study
    this.sub.add(
      this.enrollmentForm.get('department')?.valueChanges.subscribe(dept => {
        if (dept) {
          this.availableStudyPaths = this.departmentStudyPaths[dept] || [];
          this.enrollmentForm.get('study')?.enable();

          this.enrollmentForm.get('study')?.setValue('');
          this.enrollmentForm.get('course')?.setValue('');
          this.enrollmentForm.get('course')?.disable();
        }
      })
    );

    // Study → Course
    this.sub.add(
      this.enrollmentForm.get('study')?.valueChanges.subscribe(study => {
        if (study) {
          this.availableCourses = this.studyCourses[study] || [];
          this.enrollmentForm.get('course')?.enable();

          this.enrollmentForm.get('course')?.setValue('');
        }
      })
    );

    // State → City
    this.sub.add(
      this.enrollmentForm.get('state')?.valueChanges.subscribe(state => {
        if (state) {
          this.availableCities = this.cities[state] || [];
          this.enrollmentForm.get('city')?.setValue('');
        }
      })
    );
  }

checkForEditMode() {
    this.sub.add(
        this.enrollmentService.getEditingStudent().subscribe(student => {
            if (student) {
                this.isEditing = true;
                this.editStudentId = student.id;
                this.imagePreview = student.photo || null;

                this.availableStudyPaths = this.departmentStudyPaths[student.department] || [];
                this.availableCourses = this.studyCourses[student.study] || [];
                this.availableCities = this.cities[student.state] || [];

                // ✅ Enable BEFORE patchValue so the controls accept the values
                this.enrollmentForm.get('study')?.enable();
                this.enrollmentForm.get('course')?.enable();

                // ✅ Temporarily disconnect valueChanges to avoid cascade reset
                const deptCtrl = this.enrollmentForm.get('department');
                const studyCtrl = this.enrollmentForm.get('study');
                const courseCtrl = this.enrollmentForm.get('course');

                // Patch silently using emitEvent: false
                deptCtrl?.setValue(student.department, { emitEvent: false });
                studyCtrl?.setValue(student.study, { emitEvent: false });
                courseCtrl?.setValue(student.course, { emitEvent: false });

                const nameParts = student.name.split(' ');
                this.enrollmentForm.patchValue({
                    ...student,
                    firstName: nameParts[0],
                    lastName: nameParts.slice(1).join(' '),
                    // Ensure date is plain YYYY-MM-DD for the date input
                    dob: student.dob ? student.dob.substring(0, 10) : ''
                }, { emitEvent: false });
            }
        })
    );
}

  // ✅ FILE UPLOAD
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.enrollmentForm.patchValue({ photo: this.imagePreview });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
  if (this.enrollmentForm.invalid) {
    this.markFormGroupTouched(this.enrollmentForm);
    return;
  }

  this.isSubmitting = true;

  const raw = this.enrollmentForm.getRawValue();

  // ✅ SAFE & CLEAN PAYLOAD
  const studentData: any = {
    name: `${raw.firstName} ${raw.lastName}`.trim(),

    course: raw.course || '',
    department: raw.department || '',
    study: raw.study || '',
    semester: raw.semester || '',

    year: Number(raw.year),

    // ✅ FIXED DATE (NO split)
    dob: raw.dob ? raw.dob.substring(0, 10) : null,

    email: raw.email,
    mobile: raw.mobile,
    gender: raw.gender,

    state: raw.state,
    city: raw.city,
    zip: raw.zip,
    addressLine: raw.addressLine,

    // ✅ ONLY send if exists
    // BEST FIX
...(raw.photo ? { photo: raw.photo } : {})};

  console.log('✅ FINAL PAYLOAD:', studentData);

  let request$;

  if(this.isEditing && this.editStudentId) {
    console.log(`🔄 Updating student ID ${this.editStudentId}`);
    request$ = this.enrollmentService.updateStudent(this.editStudentId, studentData);
  } else {
  console.log('➕ Creating new student');
  request$ = this.enrollmentService.enrollStudent(studentData);
  }
  
  request$.subscribe({
  next: (res) => {
    console.log('✅ SUCCESS:', res);

    this.isSubmitting = false;
    this.errorMessage = null;

    if (this.isEditing) {
      this.router.navigate(['/students']);
    } else {
      this.submittedStudent = res;
      this.showIdCard = true;
    }

    // Force Angular to detect changes immediately
    this.cdr.detectChanges();
  },
  error: (err) => {
    console.error('❌ API ERROR:', err);

    this.isSubmitting = false;

    this.errorMessage =
      err?.error?.error ||
      err?.error?.message ||
      'Something went wrong. Please try again.';

    // Force Angular to detect changes immediately
    this.cdr.detectChanges();
  }
});
}

  closeIdCard() {
    this.showIdCard = false;
    this.router.navigate(['/students']);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  get f() {
    return this.enrollmentForm.controls;
  }
}