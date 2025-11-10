import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBarSpy: jest.Mocked<MatSnackBar>;

  beforeEach(() => {
    const spy = {
      open: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: spy }
      ]
    });

    service = TestBed.inject(NotificationService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('notification signal', () => {
    it('should initialize with null', () => {
      expect(service.notification()).toBeNull();
    });

    it('should be a signal', () => {
      expect(typeof service.notification).toBe('function');
    });
  });

  describe('showNotification', () => {
    it('should open snack bar with default action', () => {
      const message = 'Test message';

      service.showNotification(message);

      expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });

    it('should open snack bar with custom action', () => {
      const message = 'Test message';
      const action = 'OK';

      service.showNotification(message, action);

      expect(snackBarSpy.open).toHaveBeenCalledWith(message, action, {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });

    it('should use 3000ms duration', () => {
      service.showNotification('Test');

      expect(snackBarSpy.open).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({ duration: 3000 })
      );
    });

    it('should position at center horizontally', () => {
      service.showNotification('Test');

      expect(snackBarSpy.open).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({ horizontalPosition: 'center' })
      );
    });

    it('should position at top vertically', () => {
      service.showNotification('Test');

      expect(snackBarSpy.open).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({ verticalPosition: 'top' })
      );
    });

    it('should handle empty message', () => {
      service.showNotification('');

      expect(snackBarSpy.open).toHaveBeenCalledWith('', 'Close', expect.any(Object));
    });

    it('should handle long messages', () => {
      const longMessage = 'This is a very long message '.repeat(10);

      service.showNotification(longMessage);

      expect(snackBarSpy.open).toHaveBeenCalledWith(longMessage, 'Close', expect.any(Object));
    });

    it('should handle special characters in message', () => {
      const message = 'Error: <script>alert("test")</script>';

      service.showNotification(message);

      expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'Close', expect.any(Object));
    });
  });

  describe('error', () => {
    it('should show notification with Error action', () => {
      const message = 'Error occurred';

      service.error(message);

      expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'Error', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });

    it('should handle empty error message', () => {
      service.error('');

      expect(snackBarSpy.open).toHaveBeenCalledWith('', 'Error', expect.any(Object));
    });

    it('should handle error with technical details', () => {
      const message = 'HTTP 500: Internal Server Error - Database connection failed';

      service.error(message);

      expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'Error', expect.any(Object));
    });

    it('should call showNotification internally', () => {
      const showNotificationSpy = jest.spyOn(service, 'showNotification');

      service.error('Test error');

      expect(showNotificationSpy).toHaveBeenCalledWith('Test error', 'Error');
    });
  });

  describe('success', () => {
    it('should show notification with Success action', () => {
      const message = 'Operation successful';

      service.success(message);

      expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'Success', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });

    it('should handle empty success message', () => {
      service.success('');

      expect(snackBarSpy.open).toHaveBeenCalledWith('', 'Success', expect.any(Object));
    });

    it('should handle success with details', () => {
      const message = 'Filter saved successfully with ID: 12345';

      service.success(message);

      expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'Success', expect.any(Object));
    });

    it('should call showNotification internally', () => {
      const showNotificationSpy = jest.spyOn(service, 'showNotification');

      service.success('Test success');

      expect(showNotificationSpy).toHaveBeenCalledWith('Test success', 'Success');
    });
  });

  describe('Multiple notifications', () => {
    it('should handle multiple sequential notifications', () => {
      service.showNotification('Message 1');
      service.showNotification('Message 2');
      service.showNotification('Message 3');

      expect(snackBarSpy.open).toHaveBeenCalledTimes(3);
    });

    it('should handle mixed error and success notifications', () => {
      service.error('Error 1');
      service.success('Success 1');
      service.error('Error 2');

      expect(snackBarSpy.open).toHaveBeenCalledTimes(3);
      expect(snackBarSpy.open).toHaveBeenNthCalledWith(1, 'Error 1', 'Error', expect.any(Object));
      expect(snackBarSpy.open).toHaveBeenNthCalledWith(2, 'Success 1', 'Success', expect.any(Object));
      expect(snackBarSpy.open).toHaveBeenNthCalledWith(3, 'Error 2', 'Error', expect.any(Object));
    });
  });

  describe('Edge cases', () => {
    it('should handle null message gracefully', () => {
      service.showNotification(null as any);

      expect(snackBarSpy.open).toHaveBeenCalled();
    });

    it('should handle undefined message gracefully', () => {
      service.showNotification(undefined as any);

      expect(snackBarSpy.open).toHaveBeenCalled();
    });

    it('should handle numeric message', () => {
      service.showNotification(123 as any);

      expect(snackBarSpy.open).toHaveBeenCalled();
    });
  });
});
