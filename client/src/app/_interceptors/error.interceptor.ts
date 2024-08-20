import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (request.headers.get('Skip-Global-Error-Handler')) {
          return throwError(() => new Error(error));
        }

        if (error) {
          switch (error.status) {
           
            case 400:
              if (error.error.errors) {

                //flatten nested errors that are within response and push them to this array
                const modalStateErrors = [];
                for (const key in error.error.errors) {
                  if(error.error.errors[key]) {
                    modalStateErrors.push(error.error.errors[key])
                  }
                }
                throw modalStateErrors.flat();
              }
              else if (typeof(error.error) === 'object') {
                this.toastr.error(error.statusText, error.status)
              
              } else {
                this.toastr.error(error.error, error.status);
              }
              break;
            case 401: 
              this.toastr.toastrConfig.timeOut = 15_000;
              this.toastr.toastrConfig.positionClass = 'toast-bottom-center';
              this.toastr.error("Ups... " + error.error); 
              // this.toastr.error("error.statusText: " +error.statusText, " error.status: " + error.status);
              break;
            case 404: 
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {state: {error: error.error}};
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;

            default:
              this.toastr.error('Something unexpected went wrong!');
         
              break;
          }
        }
        return throwError(() =>  new Error(error));
      })
    );
  }
}
