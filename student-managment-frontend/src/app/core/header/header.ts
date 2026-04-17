import { Component } from '@angular/core';
import { LucideAngularModule, Bell, Settings } from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  Bell = Bell;
  Settings = Settings;
}
