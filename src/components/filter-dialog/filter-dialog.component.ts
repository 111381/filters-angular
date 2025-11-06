import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CONDITIONS_MAP, Criterion, CriterionType, Filter } from '../../models/filter.model';
import { NotificationService } from '../../services/notification.service';
import * as constants from '../../constants';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class FilterDialogComponent implements OnInit {
  save = output<Omit<Filter, 'id'>>();
  close = output<void>();
  mode = input<'modal' | 'inline'>('modal');
  readonly selectionValues: string[] = ['s1', 's2', 's3'];
  selectedSelection: string = this.selectionValues[0];

  readonly filterName = signal(constants.DEFAULT_FILTER_NAME);
  readonly criteria = signal<Criterion[]>([]);
  readonly conditionsMap = CONDITIONS_MAP;
  readonly criterionTypes: CriterionType[] = ['Amount', 'Title', 'Date'];
  private nextCriterionId = 1;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.addCriterion();
  }

  addCriterion(): void {
    const defaultCriterion: Criterion = {
      id: this.nextCriterionId++,
      filterType: 'Amount',
      conditionType: 'greater_than',
      value: constants.DEFAULT_AMOUNT_VALUE,
    };
    this.criteria.update(current => [...current, defaultCriterion]);
  }

  removeCriterion(idToRemove: number): void {
    if (this.criteria().length > constants.MIN_CRITERIA_COUNT) {
      this.criteria.update(current => current.filter(c => c.id !== idToRemove));
    }
  }

  updateCriterionType(idToUpdate: number, event: Event): void {
    const newType = (event.target as HTMLSelectElement).value as CriterionType;
    this.criteria.update(current =>
      current.map(c => {
        if (c.id === idToUpdate) {
          const newCondition = this.conditionsMap[newType][0].value;
          let newValue: any;
          switch (newType) {
            case 'Amount':
              newValue = 0;
              break;
            case 'Title':
              newValue = '';
              break;
            case 'Date':
              newValue = new Date().toISOString().split('T')[0];
              break;
          }
          return {...c, filterType: newType, conditionType: newCondition, value: newValue};
        }
        return c;
      })
    );
  }

  updateCriterionField(idToUpdate: number, field: 'conditionType' | 'value', event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    this.criteria.update(current =>
      current.map(c => (c.id === idToUpdate ? {...c, [field]: newValue} : c))
    );
  }

  updateFilterName(event: Event): void {
    this.filterName.set((event.target as HTMLInputElement).value);
  }

  onSave(): void {
    if (this.filterName().trim() && this.criteria().every(c => c.value !== null && String(c.value).trim() !== '')) {
      this.save.emit({
        name: this.filterName(),
        selection: this.selectedSelection,
        criteriaList: this.criteria(),
      });
    } else {
      this.notificationService.showNotification('Please fill out all fields for each criterion and give the filter a name.');
    }
  }

  onClose(): void {
    this.close.emit();
  }

  protected readonly constants = constants;
}