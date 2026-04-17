import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'students', 
    loadComponent: () => import('./features/student-list/student-list').then(m => m.StudentList)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },
  { 
    path: 'enrollment', 
    loadComponent: () => import('./features/student-enrollment/student-enrollment').then(m => m.StudentEnrollment)
  },
  { 
    path: '**', 
    redirectTo: '/dashboard' 
  }
];
