import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FilterRestService } from './filter-rest-service';
import { Filter } from '../models/filter.model';

describe('FilterRestService', () => {
  let service: FilterRestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FilterRestService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(FilterRestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Service Configuration', () => {
    it('should have apiUrl defined', () => {
      expect(service.apiUrl).toBeDefined();
      expect(typeof service.apiUrl).toBe('string');
    });

    it('should have filterServicePath defined', () => {
      expect(service.filterServicePath).toBeDefined();
      expect(typeof service.filterServicePath).toBe('string');
    });
  });

  describe('getAllFilters', () => {
    it('should return an array of filters', (done) => {
      const mockFilters: Filter[] = [
        {
          id: 1,
          name: 'Test Filter',
          selection: 'S1',
          criteriaList: []
        },
        {
          id: 2,
          name: 'Another Filter',
          selection: 'S2',
          criteriaList: []
        }
      ];

      service.getAllFilters().subscribe(filters => {
        expect(filters).toEqual(mockFilters);
        expect(filters.length).toBe(2);
        done();
      });

      const req = httpMock.expectOne(service.apiUrl + '/' + service.filterServicePath);
      expect(req.request.method).toBe('GET');
      req.flush(mockFilters);
    });

    it('should return empty array when no filters exist', (done) => {
      service.getAllFilters().subscribe(filters => {
        expect(filters).toEqual([]);
        expect(filters.length).toBe(0);
        done();
      });

      const req = httpMock.expectOne(service.apiUrl + '/' + service.filterServicePath);
      req.flush([]);
    });

    it('should handle filters with complex criteria', (done) => {
      const mockFilters: Filter[] = [
        {
          id: 1,
          name: 'Complex Filter',
          selection: 'S1',
          criteriaList: [
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
          ]
        }
      ];

      service.getAllFilters().subscribe(filters => {
        expect(filters[0].criteriaList.length).toBe(3);
        expect(filters[0].criteriaList[0].filterType).toBe('Amount');
        expect(filters[0].criteriaList[1].filterType).toBe('Title');
        expect(filters[0].criteriaList[2].filterType).toBe('Date');
        done();
      });

      const req = httpMock.expectOne(service.apiUrl + '/' + service.filterServicePath);
      req.flush(mockFilters);
    });

    it('should handle 500 server error', (done) => {
      const errorMessage = 'Failed to load filters. Please try again.';

      service.getAllFilters().subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
          done();
        }
      });

      const req = httpMock.expectOne(service.apiUrl + '/' + service.filterServicePath);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle 404 not found error', (done) => {
      const errorMessage = 'Failed to load filters. Please try again.';

      service.getAllFilters().subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
          done();
        }
      });

      const req = httpMock.expectOne(service.apiUrl + '/' + service.filterServicePath);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle network error', (done) => {
      const errorMessage = 'Failed to load filters. Please try again.';

      service.getAllFilters().subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
          done();
        }
      });

      const req = httpMock.expectOne(service.apiUrl + '/' + service.filterServicePath);
      req.error(new ProgressEvent('error'));
    });
  });

  describe('saveFilter', () => {
    it('should save filter and return saved filter', (done) => {
      const filterToSave: Filter = {
        id: 1,
        name: 'New Filter',
        selection: 'S1',
        criteriaList: [
          {
            id: 1,
            filterType: 'Amount',
            conditionType: 'greater_than',
            value: 100
          }
        ]
      };

      service.saveFilter(filterToSave).subscribe(savedFilter => {
        expect(savedFilter).toEqual(filterToSave);
        done();
      });

      const req = httpMock.expectOne(service.apiUrl + '/' + service.filterServicePath);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(filterToSave);
      req.flush(filterToSave);
    });

    it('should save filter with empty criteria list', (done) => {
      const filterToSave: Filter = {
        id: 1,
        name: 'Simple Filter',
        selection: 'S2',
        criteriaList: []
      };

      service.saveFilter(filterToSave).subscribe(savedFilter => {
        expect(savedFilter.criteriaList).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(service.apiUrl + '/' + service.filterServicePath);
      req.flush(filterToSave);
    });

    it('should save filter with multiple criteria', (done) => {
      const filterToSave: Filter = {
        id: 1,
        name: 'Multi Criteria Filter',
        selection: 'S3',
        criteriaList: [
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
          }
        ]
      };

      service.saveFilter(filterToSave).subscribe(savedFilter => {
        expect(savedFilter.criteriaList.length).toBe(2);
        done();
      });

      const req = httpMock.expectOne(service.apiUrl + '/' + service.filterServicePath);
      req.flush(filterToSave);
    });

    it('should handle 400 bad request error', (done) => {
      const filterToSave: Filter = {
        id: 1,
        name: 'Invalid Filter',
        selection: 'S1',
        criteriaList: []
      };
      const errorMessage = 'Failed to save filter. Please try again.';

      service.saveFilter(filterToSave).subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
          done();
        }
      });

      const req = httpMock.expectOne(service.apiUrl + '/' + service.filterServicePath);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 500 server error on save', (done) => {
      const filterToSave: Filter = {
        id: 1,
        name: 'Test Filter',
        selection: 'S1',
        criteriaList: []
      };
      const errorMessage = 'Failed to save filter. Please try again.';

      service.saveFilter(filterToSave).subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
          done();
        }
      });

      const req = httpMock.expectOne(service.apiUrl + '/' + service.filterServicePath);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should send correct headers with POST request', (done) => {
      const filterToSave: Filter = {
        id: 1,
        name: 'Test Filter',
        selection: 'S1',
        criteriaList: []
      };

      service.saveFilter(filterToSave).subscribe(() => done());

      const req = httpMock.expectOne(service.apiUrl + '/' + service.filterServicePath);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.has('Content-Type')).toBeTruthy();
      req.flush(filterToSave);
    });
  });

  describe('Error Handling', () => {
    it('should transform HTTP errors to user-friendly messages', (done) => {
      service.getAllFilters().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toContain('Please try again');
          done();
        }
      });

      const req = httpMock.expectOne(service.apiUrl + '/' + service.filterServicePath);
      req.error(new ProgressEvent('error'));
    });

    it('should handle timeout errors gracefully', (done) => {
      service.saveFilter({ id: 1, name: 'Test', selection: 'S1', criteriaList: [] }).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBeDefined();
          done();
        }
      });

      const req = httpMock.expectOne(service.apiUrl + '/' + service.filterServicePath);
      req.error(new ProgressEvent('timeout'));
    });
  });
});
