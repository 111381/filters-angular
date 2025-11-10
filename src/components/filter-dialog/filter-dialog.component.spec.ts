import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterDialogComponent } from './filter-dialog.component';
import { NotificationService } from '../../services/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as constants from '../../constants';
import { signal } from '@angular/core';

describe('FilterDialogComponent', () => {
  let component: FilterDialogComponent;
  let fixture: ComponentFixture<FilterDialogComponent>;
  let notificationServiceSpy: jest.Mocked<any>;

  beforeEach(async () => {
    notificationServiceSpy = {
      showNotification: jest.fn(),
      error: jest.fn(),
      success: jest.fn(),
      notification: signal(null)
    };

    const snackBarSpy = {
      open: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [FilterDialogComponent],
      providers: [
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default filter name from constants', () => {
      expect(component.filterName()).toBe(constants.DEFAULT_FILTER_NAME);
    });

    it('should have correct selection values', () => {
      expect(component.selectionValues).toEqual(['S1', 'S2', 'S3']);
    });

    it('should have default selection as first value', () => {
      expect(component.selectedSelection).toBe('S1');
    });

    it('should have all criterion types defined', () => {
      expect(component.criterionTypes).toEqual(['Amount', 'Title', 'Date']);
    });

    it('should have conditions map defined', () => {
      expect(component.conditionsMap).toBeDefined();
      expect(component.conditionsMap.Amount).toBeDefined();
      expect(component.conditionsMap.Title).toBeDefined();
      expect(component.conditionsMap.Date).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('should add one criterion on initialization', () => {
      expect(component.criteria().length).toBe(1);
    });

    it('should initialize criterion with Amount type', () => {
      expect(component.criteria()[0].filterType).toBe('Amount');
    });

    it('should initialize criterion with greater_than condition', () => {
      expect(component.criteria()[0].conditionType).toBe('greater_than');
    });

    it('should initialize criterion with default amount value', () => {
      expect(component.criteria()[0].value).toBe(constants.DEFAULT_AMOUNT_VALUE);
    });

    it('should assign unique id to initial criterion', () => {
      expect(component.criteria()[0].id).toBeDefined();
      expect(typeof component.criteria()[0].id).toBe('number');
    });
  });

  describe('addCriterion', () => {
    it('should add a new criterion to the list', () => {
      const initialLength = component.criteria().length;

      component.addCriterion();

      expect(component.criteria().length).toBe(initialLength + 1);
    });

    it('should add criterion with default Amount type', () => {
      component.addCriterion();

      const lastCriterion = component.criteria()[component.criteria().length - 1];
      expect(lastCriterion.filterType).toBe('Amount');
    });

    it('should add criterion with greater_than condition', () => {
      component.addCriterion();

      const lastCriterion = component.criteria()[component.criteria().length - 1];
      expect(lastCriterion.conditionType).toBe('greater_than');
    });

    it('should add criterion with default amount value', () => {
      component.addCriterion();

      const lastCriterion = component.criteria()[component.criteria().length - 1];
      expect(lastCriterion.value).toBe(constants.DEFAULT_AMOUNT_VALUE);
    });

    it('should increment criterion id for each new criterion', () => {
      component.addCriterion();
      const firstNewId = component.criteria()[1].id;

      component.addCriterion();
      const secondNewId = component.criteria()[2].id;

      expect(secondNewId).toBeGreaterThan(firstNewId);
    });

    it('should add multiple criteria correctly', () => {
      const initialLength = component.criteria().length;

      component.addCriterion();
      component.addCriterion();
      component.addCriterion();

      expect(component.criteria().length).toBe(initialLength + 3);
    });
  });

  describe('removeCriterion', () => {
    it('should remove criterion when more than minimum count', () => {
      component.addCriterion();
      const initialLength = component.criteria().length;
      const idToRemove = component.criteria()[0].id;

      component.removeCriterion(idToRemove);

      expect(component.criteria().length).toBe(initialLength - 1);
      expect(component.criteria().find(c => c.id === idToRemove)).toBeUndefined();
    });

    it('should not remove criterion when at minimum count', () => {
      const initialLength = component.criteria().length;
      const idToRemove = component.criteria()[0].id;

      component.removeCriterion(idToRemove);

      expect(component.criteria().length).toBe(initialLength);
      expect(component.criteria().find(c => c.id === idToRemove)).toBeDefined();
    });

    it('should preserve other criteria when removing one', () => {
      component.addCriterion();
      component.addCriterion();
      const idToRemove = component.criteria()[1].id;
      const firstCriterion = component.criteria()[0];
      const lastCriterion = component.criteria()[2];

      component.removeCriterion(idToRemove);

      expect(component.criteria().find(c => c.id === firstCriterion.id)).toBeDefined();
      expect(component.criteria().find(c => c.id === lastCriterion.id)).toBeDefined();
    });

    it('should handle removing non-existent criterion gracefully', () => {
      component.addCriterion();
      const initialLength = component.criteria().length;

      component.removeCriterion(99999);

      expect(component.criteria().length).toBe(initialLength);
    });
  });

  describe('updateCriterionType', () => {
    it('should update criterion type to Title', () => {
      const criterionId = component.criteria()[0].id;
      const mockEvent = {
        target: { value: 'Title' }
      } as any;

      component.updateCriterionType(criterionId, mockEvent);

      const updatedCriterion = component.criteria().find(c => c.id === criterionId);
      expect(updatedCriterion?.filterType).toBe('Title');
    });

    it('should update criterion type to Date', () => {
      const criterionId = component.criteria()[0].id;
      const mockEvent = {
        target: { value: 'Date' }
      } as any;

      component.updateCriterionType(criterionId, mockEvent);

      const updatedCriterion = component.criteria().find(c => c.id === criterionId);
      expect(updatedCriterion?.filterType).toBe('Date');
    });

    it('should update criterion type to Amount', () => {
      const criterionId = component.criteria()[0].id;
      const mockEvent = {
        target: { value: 'Amount' }
      } as any;

      component.updateCriterionType(criterionId, mockEvent);

      const updatedCriterion = component.criteria().find(c => c.id === criterionId);
      expect(updatedCriterion?.filterType).toBe('Amount');
    });

    it('should reset value to empty string when changing to Title', () => {
      const criterionId = component.criteria()[0].id;
      const mockEvent = {
        target: { value: 'Title' }
      } as any;

      component.updateCriterionType(criterionId, mockEvent);

      const updatedCriterion = component.criteria().find(c => c.id === criterionId);
      expect(updatedCriterion?.value).toBe('');
    });

    it('should reset value to 0 when changing to Amount', () => {
      const criterionId = component.criteria()[0].id;
      const mockEvent = {
        target: { value: 'Amount' }
      } as any;

      component.updateCriterionType(criterionId, mockEvent);

      const updatedCriterion = component.criteria().find(c => c.id === criterionId);
      expect(updatedCriterion?.value).toBe(0);
    });

    it('should reset value to current date string when changing to Date', () => {
      const criterionId = component.criteria()[0].id;
      const mockEvent = {
        target: { value: 'Date' }
      } as any;

      component.updateCriterionType(criterionId, mockEvent);

      const updatedCriterion = component.criteria().find(c => c.id === criterionId);
      expect(typeof updatedCriterion?.value).toBe('string');
      expect(updatedCriterion?.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should update condition type to first available condition for new type', () => {
      const criterionId = component.criteria()[0].id;
      const mockEvent = {
        target: { value: 'Title' }
      } as any;

      component.updateCriterionType(criterionId, mockEvent);

      const updatedCriterion = component.criteria().find(c => c.id === criterionId);
      expect(updatedCriterion?.conditionType).toBe(component.conditionsMap.Title[0].value);
    });

    it('should not affect other criteria when updating one', () => {
      component.addCriterion();
      const firstCriterionId = component.criteria()[0].id;
      const secondCriterionId = component.criteria()[1].id;
      const mockEvent = {
        target: { value: 'Title' }
      } as any;

      component.updateCriterionType(firstCriterionId, mockEvent);

      const secondCriterion = component.criteria().find(c => c.id === secondCriterionId);
      expect(secondCriterion?.filterType).toBe('Amount');
    });
  });

  describe('updateCriterionField', () => {
    it('should update criterion condition type', () => {
      const criterionId = component.criteria()[0].id;
      const mockEvent = {
        target: { value: 'less_than' }
      } as any;

      component.updateCriterionField(criterionId, 'conditionType', mockEvent);

      const updatedCriterion = component.criteria().find(c => c.id === criterionId);
      expect(updatedCriterion?.conditionType).toBe('less_than');
    });

    it('should update criterion value', () => {
      const criterionId = component.criteria()[0].id;
      const mockEvent = {
        target: { value: '500' }
      } as any;

      component.updateCriterionField(criterionId, 'value', mockEvent);

      const updatedCriterion = component.criteria().find(c => c.id === criterionId);
      expect(updatedCriterion?.value).toBe('500');
    });

    it('should update value to empty string', () => {
      const criterionId = component.criteria()[0].id;
      const mockEvent = {
        target: { value: '' }
      } as any;

      component.updateCriterionField(criterionId, 'value', mockEvent);

      const updatedCriterion = component.criteria().find(c => c.id === criterionId);
      expect(updatedCriterion?.value).toBe('');
    });

    it('should not affect other criteria', () => {
      component.addCriterion();
      const firstCriterionId = component.criteria()[0].id;
      const secondCriterionId = component.criteria()[1].id;
      const initialValue = component.criteria()[1].value;
      const mockEvent = {
        target: { value: '999' }
      } as any;

      component.updateCriterionField(firstCriterionId, 'value', mockEvent);

      const secondCriterion = component.criteria().find(c => c.id === secondCriterionId);
      expect(secondCriterion?.value).toBe(initialValue);
    });
  });

  describe('updateFilterName', () => {
    it('should update filter name', () => {
      const newName = 'My Custom Filter';
      const mockEvent = {
        target: { value: newName }
      } as any;

      component.updateFilterName(mockEvent);

      expect(component.filterName()).toBe(newName);
    });

    it('should update filter name to empty string', () => {
      const mockEvent = {
        target: { value: '' }
      } as any;

      component.updateFilterName(mockEvent);

      expect(component.filterName()).toBe('');
    });

    it('should update filter name with special characters', () => {
      const newName = 'Filter #1 (Test)';
      const mockEvent = {
        target: { value: newName }
      } as any;

      component.updateFilterName(mockEvent);

      expect(component.filterName()).toBe(newName);
    });
  });

  describe('onSave', () => {
    it('should emit save event when all fields are valid', () => {
      const saveSpy = jest.fn();
      component.save.subscribe(saveSpy);

      component.filterName.set('Valid Filter');
      component.criteria.set([
        {
          id: 1,
          filterType: 'Amount',
          conditionType: 'greater_than',
          value: 100
        }
      ]);

      component.onSave();

      expect(saveSpy).toHaveBeenCalledWith({
        name: 'Valid Filter',
        selection: component.selectedSelection,
        criteriaList: component.criteria()
      });
      expect(notificationServiceSpy.showNotification).not.toHaveBeenCalled();
    });

    it('should show notification when filter name is empty', () => {
      component.filterName.set('');

      component.onSave();

      expect(notificationServiceSpy.showNotification).toHaveBeenCalledWith(
        'Please fill out all fields for each criterion and give the filter a name.'
      );
    });

    it('should show notification when filter name is only whitespace', () => {
      component.filterName.set('   ');

      component.onSave();

      expect(notificationServiceSpy.showNotification).toHaveBeenCalled();
    });

    it('should show notification when criterion value is empty string', () => {
      component.filterName.set('Valid Filter');
      component.criteria.set([
        {
          id: 1,
          filterType: 'Title',
          conditionType: 'contains',
          value: ''
        }
      ]);

      component.onSave();

      expect(notificationServiceSpy.showNotification).toHaveBeenCalled();
    });

    it('should show notification when criterion value is null', () => {
      component.filterName.set('Valid Filter');
      component.criteria.set([
        {
          id: 1,
          filterType: 'Amount',
          conditionType: 'greater_than',
          value: null as any
        }
      ]);

      component.onSave();

      expect(notificationServiceSpy.showNotification).toHaveBeenCalled();
    });

    it('should show notification when criterion value is only whitespace', () => {
      component.filterName.set('Valid Filter');
      component.criteria.set([
        {
          id: 1,
          filterType: 'Title',
          conditionType: 'contains',
          value: '   '
        }
      ]);

      component.onSave();

      expect(notificationServiceSpy.showNotification).toHaveBeenCalled();
    });

    it('should emit filter with multiple valid criteria', () => {
      const saveSpy = jest.fn();
      component.save.subscribe(saveSpy);

      component.filterName.set('Multi-Criteria Filter');
      component.criteria.set([
        {
          id: 1,
          filterType: 'Amount',
          conditionType: 'greater_than',
          value: 100
        },
        {
          id: 2,
          filterType: 'Title',
          conditionType: 'contains',
          value: 'test'
        },
        {
          id: 3,
          filterType: 'Date',
          conditionType: 'is_after',
          value: '2024-01-01'
        }
      ]);

      component.onSave();

      expect(saveSpy).toHaveBeenCalledWith({
        name: 'Multi-Criteria Filter',
        selection: component.selectedSelection,
        criteriaList: component.criteria()
      });
    });

    it('should not trim filter name in emitted data', () => {
      const saveSpy = jest.fn();
      component.save.subscribe(saveSpy);

      component.filterName.set('  Spaced Filter  ');
      component.criteria.set([
        {
          id: 1,
          filterType: 'Amount',
          conditionType: 'greater_than',
          value: 100
        }
      ]);

      component.onSave();

      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: '  Spaced Filter  '
        })
      );
    });

    it('should include current selection in emitted data', () => {
      const saveSpy = jest.fn();
      component.save.subscribe(saveSpy);

      component.selectedSelection = 'S2';
      component.filterName.set('Test Filter');
      component.criteria.set([
        {
          id: 1,
          filterType: 'Amount',
          conditionType: 'equals',
          value: 50
        }
      ]);

      component.onSave();

      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          selection: 'S2'
        })
      );
    });
  });

  describe('onClose', () => {
    it('should emit close event', () => {
      const closeSpy = jest.fn();
      component.close.subscribe(closeSpy);

      component.onClose();

      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('Input and Output bindings', () => {
    it('should have mode input with default value modal', () => {
      expect(component.mode()).toBe('modal');
    });

    it('should have save output defined', () => {
      expect(component.save).toBeDefined();
    });

    it('should have close output defined', () => {
      expect(component.close).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid criterion additions', () => {
      for (let i = 0; i < 10; i++) {
        component.addCriterion();
      }

      expect(component.criteria().length).toBe(11); // 1 initial + 10 added
    });

    it('should maintain criterion uniqueness by id', () => {
      for (let i = 0; i < 5; i++) {
        component.addCriterion();
      }

      const ids = component.criteria().map(c => c.id);
      const uniqueIds = new Set(ids);

      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should handle updating non-existent criterion gracefully', () => {
      const initialCriteria = component.criteria();
      const mockEvent = { target: { value: 'Title' } } as any;

      component.updateCriterionType(99999, mockEvent);

      expect(component.criteria()).toEqual(initialCriteria);
    });
  });
});
