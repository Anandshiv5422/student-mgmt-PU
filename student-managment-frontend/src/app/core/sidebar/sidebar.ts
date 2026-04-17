import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { 
  LucideAngularModule, 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  CheckSquare, 
  BarChart, 
  Calendar, 
  Star, 
  LogOut,
  UserPlus
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  navItems = [
    { title: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
    { title: 'Students', icon: Users, route: '/students' },
    { title: 'Enrollment', icon: UserPlus, route: '/enrollment' },
  ];

  LogOut = LogOut;
}
