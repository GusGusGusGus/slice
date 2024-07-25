import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent {

  baseUrl = environment.apiUrl;
  validationErrors: string[] = [];

  constructor(private http: HttpClient) {
  }

  get404Error() {
    this.http.get(this.baseUrl + 'buggy/not-found').subscribe(
      {
        next: (response) => {
          console.log(response);
          
        },
        error: (e) => {
          console.log(e);
          
        }
      }
    );
  }
  get400Error() {
    this.http.get(this.baseUrl + 'buggy/bad-request').subscribe(
      {
        next: (response) => {
          console.log(response);
          
        },
        error: (e) => {
          console.log(e);
          
        }
      }
    );
  }

  get500Error() {
    this.http.get(this.baseUrl + 'buggy/server-error').subscribe(
      {
        next: (response) => {
          console.log(response);
          
        },
        error: (e) => {
          console.log(e);
          
        }
      }
    );
  }

  get401Error() {
    this.http.get(this.baseUrl + 'buggy/auth').subscribe(
      {
        next: (response) => {
          console.log(response);
          
        },
        error: (e) => {
          console.log(e);
          
        }
      }
    );
  }

  get400ValidationError() {
    this.http.post(this.baseUrl + 'account/register', {}).subscribe(
      {
        next: (response) => {
          console.log(response);
        },
        error: (e) => {
          console.log(e);
          this.validationErrors = e;
          
        }
      }
    );
  }

}
