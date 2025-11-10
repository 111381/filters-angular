export type CriterionType = 'Amount' | 'Title' | 'Date';

export type DialogMode = 'modal' | 'inline';

export type AmountCondition = 'greater_than' | 'less_than' | 'equals' | 'not_equals';
export type TitleCondition = 'contains' | 'not_contains' | 'equals' | 'not_equals';
export type DateCondition = 'is' | 'is_not' | 'is_after' | 'is_before';

export type Condition = AmountCondition | TitleCondition | DateCondition;

export interface Criterion {
  id: number;
  filterType: CriterionType;
  conditionType: Condition;
  value: any;
}

export interface Filter {
  id: number;
  name: string;
  selection: string;
  criteriaList: Criterion[];
}

export const CONDITIONS_MAP: { [key in CriterionType]: { value: Condition; label: string }[] } = {
  Amount: [
    {value: 'greater_than', label: 'is greater than'},
    {value: 'less_than', label: 'is less than'},
    {value: 'equals', label: 'equals'},
    {value: 'not_equals', label: 'does not equal'},
  ],
  Title: [
    {value: 'contains', label: 'contains'},
    {value: 'not_contains', label: 'does not contain'},
    {value: 'equals', label: 'equals'},
    {value: 'not_equals', label: 'does not equal'},
  ],
  Date: [
    {value: 'is', label: 'is'},
    {value: 'is_not', label: 'is not'},
    {value: 'is_after', label: 'is after'},
    {value: 'is_before', label: 'is before'},
  ]
};
