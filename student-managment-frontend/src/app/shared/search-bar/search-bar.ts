import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search } from 'lucide-angular';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  SearchIcon = Search;
  searchTerm = '';
  
  @Input() placeholder = 'Search...';
  @Output() search = new EventEmitter<string>();

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.search.emit(value);
  }
}
