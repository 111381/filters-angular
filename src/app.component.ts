import {ChangeDetectionStrategy, Component, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterDialogComponent } from './components/filter-dialog/filter-dialog.component';
import { Filter } from './models/filter.model';
import { FilterRestService } from "@/src/services/filter-rest-service";
import { finalize } from "rxjs";
import { NotificationService } from "@/src/services/notification.service";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FilterDialogComponent],
})
export class AppComponent implements OnInit {
  private readonly destroyRef = takeUntilDestroyed();
  readonly filters = signal<Filter[]>([]);
  readonly isDialogVisible = signal(false);
  readonly dialogMode = signal<'modal' | 'inline'>('modal');
  readonly isLoading = signal(false);
  private nextFilterId = signal(1);

  constructor(
    private filterRestService: FilterRestService,
    private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.loadFilters();
  }

  loadFilters(): void {
    this.isLoading.set(true);
    this.filterRestService.getAllFilters()
      .pipe(
        finalize(() => this.isLoading.set(false)),
        this.destroyRef
      )
      .subscribe({
        next: (filters: Filter[]) => this.handleFiltersLoaded(filters),
        error: (error) => this.notificationService.error(error.message)
      });
  }

  private handleFiltersLoaded(filters: Filter[]): void {
    this.filters.set(filters);
  }

  setDialogMode(mode: 'modal' | 'inline'): void {
    this.dialogMode.set(mode);
  }

  addFilter(): void {
    this.isDialogVisible.set(true);
  }

  saveFilter(newFilterData: Omit<Filter, 'id'>): void {
    const newFilter: Filter = {
      ...newFilterData,
      id: this.nextFilterId(),
    };
    this.isLoading.set(true);
    this.filterRestService.saveFilter(newFilter)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.filters.update(currentFilters => [...currentFilters, newFilter]);
          this.nextFilterId.update(id => id + 1);
          this.isDialogVisible.set(false);
          this.isLoading.set(false);
          this.notificationService.success('Filter saved successfully');
        },
        error: (error) => {
          this.isLoading.set(false);
          this.notificationService.error('Failed to save filter: ' + error.message);
        }
      });
  }

  closeDialog(): void {
    this.isDialogVisible.set(false);
  }

  getConditionLabel(type: string, conditionValue: string): string {
    switch (type) {
      case 'Amount':
        if (conditionValue === 'greater_than') return '>';
        if (conditionValue === 'less_than') return '<';
        if (conditionValue === 'equals') return '=';
        if (conditionValue === 'not_equals') return '!=';
        break;
      case 'Title':
        if (conditionValue === 'contains') return 'contains';
        if (conditionValue === 'not_contains') return 'does not contain';
        if (conditionValue === 'equals') return 'is';
        if (conditionValue === 'not_equals') return 'is not';
        break;
      case 'Date':
        if (conditionValue === 'is') return 'on';
        if (conditionValue === 'is_not') return 'not on';
        if (conditionValue === 'is_after') return 'after';
        if (conditionValue === 'is_before') return 'before';
        break;
    }
    return conditionValue;
  }
}