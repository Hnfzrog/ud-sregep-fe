import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

export interface TableColumn {
  name: string;
  prop: string;
  type?: 'text' | 'html' | 'boolean';
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() rows: Array<any> = [];
  @Input() columns: TableColumn[] = [];
  @Input() actionTitle: string = '';
  @Input() checkboxColumn: boolean = false; // default: tidak tampil
  @Input() showActions: boolean = true;     // default: tampil

  @Output() confirmClicked = new EventEmitter<any>();
  @Output() editClicked = new EventEmitter<any>();
  @Output() deleteClicked = new EventEmitter<any>();
  @Output() searchChanged = new EventEmitter<{ keyword: string, limit: number, offset: number }>();
  @Output() selectedRowsChange = new EventEmitter<any[]>();

  rowsPerPageOptions: number[] = [5, 10, 20, 50, 100, 500];
  rowsPerPage: number = 5;
  currentPage: number = 1;
  searchKeyword: string = '';
  selectedRows: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.filterData();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredRows.length / this.rowsPerPage);
  }

  get filteredRows(): Array<any> {
    return this.rows.filter(row =>
      Object.values(row).some((value: any) =>
        value?.toString().toLowerCase().includes(this.searchKeyword.toLowerCase())
      )
    );
  }

  get paginatedRows(): Array<any> {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.filteredRows.slice(start, end);
  }

  get minRowsPerPage(): number {
    return Math.min(...this.rowsPerPageOptions);
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterData();
    }
  }

  onRowsPerPageChange(newRowsPerPage: number): void {
    this.rowsPerPage = newRowsPerPage;
    this.currentPage = 1;
    this.filterData();
  }

  onSearchChange(keyword: string): void {
    this.searchKeyword = keyword;
    this.currentPage = 1;
    this.filterData();
  }

  triggerSearch(): void {
    this.currentPage = 1;
    this.filterData();
  }

  private filterData(): void {
    const offset = (this.currentPage - 1) * this.rowsPerPage;
    const limit = this.rowsPerPage;
    this.searchChanged.emit({
      keyword: this.searchKeyword,
      limit,
      offset
    });
  }

  isSelected(row: any): boolean {
    return this.selectedRows.includes(row);
  }

  toggleRowSelection(row: any): void {
    const index = this.selectedRows.indexOf(row);
    if (index > -1) {
      this.selectedRows.splice(index, 1);
    } else {
      this.selectedRows.push(row);
    }
    this.selectedRowsChange.emit(this.selectedRows);
  }

  isAllSelected(): boolean {
    return this.paginatedRows.length > 0 && this.paginatedRows.every(row => this.isSelected(row));
  }

  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.selectedRows = [...this.paginatedRows];
    } else {
      this.selectedRows = [];
    }
    this.selectedRowsChange.emit(this.selectedRows);
  }
}
