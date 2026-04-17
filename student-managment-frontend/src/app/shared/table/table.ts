import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight, ArrowUpDown, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-angular';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'number' | 'badge' | 'action';
  sort?: boolean;
}

@Component({
  selector: 'app-table',
  imports: [CommonModule, LucideAngularModule],
  providers: [DatePipe],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table implements OnChanges {
  ChevronLeft = ChevronLeft;
  ChevronRight = ChevronRight;
  ArrowUpDown = ArrowUpDown;
  MoreHorizontal = MoreHorizontal;
  Edit = Edit;
  Trash2 = Trash2;
  Eye = Eye;

  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() itemsPerPage: number = 8;

  @Output() onView = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  displayedData: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;

  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private datePipe: DatePipe) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.currentPage = 1;
      this.updateTable();
    }
  }

  updateTable() {
    let processData = [...this.data];

    // Sorting logic
    if (this.sortColumn) {
      processData.sort((a, b) => {
        let valA = a[this.sortColumn!];
        let valB = b[this.sortColumn!];
        
        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.totalPages = Math.ceil(processData.length / this.itemsPerPage) || 1;
    
    // Pagination logic
    const startIdx = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedData = processData.slice(startIdx, startIdx + this.itemsPerPage);
  }

  sortBy(columnKey: string) {
    const colConfig = this.columns.find(c => c.key === columnKey);
    if (!colConfig?.sort) return;

    if (this.sortColumn === columnKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnKey;
      this.sortDirection = 'asc';
    }
    this.updateTable();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateTable();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateTable();
    }
  }

  formatData(item: any, column: TableColumn): any {
    const value = item[column.key];
    if (column.type === 'date') {
      return this.datePipe.transform(value, 'dd.MM.yyyy') || value;
    }
    return value;
  }
}
