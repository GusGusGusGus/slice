import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { BusyService } from '../_services/busy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private busyService: BusyService ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Show loading spinner or perform any other loading-related tasks before the request is sent

    this.busyService.busy();

    return next.handle(request).pipe(
      delay(1000), // Simulate a delay of 1 second
      finalize(() => {
        // Hide loading spinner or perform any other loading-related tasks after the request is sent
        this.busyService.idle();
      })
    );
  }
}