import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[] = [];

  /**
   *
   */
  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router) {
  }
  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    //block selection of dates that are less than 18 years ago
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['female'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
      email: ['', [Validators.required, Validators.email]],
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : {isMatching: true}
    }
  }

  register() {
    this.accountService.register(this.registerForm.value).subscribe( 
      {
        next: (response) => {
          this.toastr.toastrConfig.timeOut = 180000;
          this.toastr.toastrConfig.extendedTimeOut = 180000;
          this.toastr.toastrConfig.positionClass = 'toast-bottom-center';
          this.toastr.success("<p><strong>Registration successful. Please check your email for a confirmation link.</strong></p> <p>Didn't receive a reset password email? Check your spam folder or click here to get a new link.</p>", 'Success 🥳')
          .onTap
          .pipe(take(1))
          .subscribe(() => this.toasterClickedHandler());
          
          this.cancelRegister.emit(false);
        },
        error: (e) => {
          this.validationErrors = e;
        },
      }
    );
  }

  toasterClickedHandler() {
    this.accountService.resendConfirmationEmail(this.registerForm.get('email').value).subscribe(() => {
      this.toastr.toastrConfig.timeOut = 180000;
      this.toastr.toastrConfig.extendedTimeOut = 180000;
      this.toastr.toastrConfig.positionClass = 'toast-bottom-center';
      this.toastr.success("<p><strong>A new confirmation link was just sent to your email!</strong></p> <p>Didn't receive a reset password email? Check your spam folder or click here to get a new link.</p>", 'Success 🥳')
      .onTap
      .pipe(take(1))
      .subscribe(() => this.toasterClickedHandler());
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
