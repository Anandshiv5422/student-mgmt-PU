import { Component, EventEmitter, Input, Output, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Filter as FilterIcon, ChevronDown } from 'lucide-angular';

export interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-filter',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './filter.html',
  styleUrl: './filter.css',
})
export class Filter {
  FilterIcon = FilterIcon;
  ChevronDown = ChevronDown;

  @Input() label: string = 'Filter';
  @Input() options: FilterOption[] = [];
  @Input() value: string = '';
  
  @Output() filterChange = new EventEmitter<string>();

  isOpen = false;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  get selectedLabel(): string {
    if (!this.value) return this.label;
    const selected = this.options.find(o => o.value === this.value);
    return selected ? selected.label : this.label;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(optionValue: string) {
    this.value = optionValue;
    this.filterChange.emit(this.value);
    this.isOpen = false;
  }
}
