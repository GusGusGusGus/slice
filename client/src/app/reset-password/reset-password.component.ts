import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  @Output() cancelResetPassword = new EventEmitter();
  resetPasswordForm: FormGroup;
  token: string;
  email: string;
  message: string;
  validationErrors: string[] = [];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {
  }
  
  private initializeForm() {
    this.resetPasswordForm = this.fb.group({
      email: [this.email, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      });
  }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
      if (!this.token) {
        this.message = 'Invalid reset password parameters.';
      }
    });
    this.initializeForm();
  }
  
  
  resetPassword() {
    const formValue = this.resetPasswordForm.value;
      this.accountService.resetPassword({
        email: formValue.email,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword,
        token: this.token
      }).subscribe(
        {
          next: (response) => {
            this.toastr.toastrConfig.positionClass = 'toast-bottom-center';
            this.toastr.success('Password reset successful.', 'Success 🥳');
            //delay for 3 seconds before redirecting to home page
            setTimeout(() => {
              this.router.navigateByUrl('/');
            }, 3000);
          },
          error: (e) => {
            if (e.error && e.error.text === "The password has been reset.") {
              this.toastr.toastrConfig.timeOut = 0;
              this.toastr.toastrConfig.extendedTimeOut = 0;
              this.toastr.toastrConfig.positionClass = 'toast-bottom-center';
              this.toastr.success('ERROR HANDLED: Password reset successful.', 'Success 🥳');
              // Delay for 3 seconds before redirecting to home page
              setTimeout(() => {
                this.router.navigateByUrl('/');
              }, 3000);
            } else if (e.some(error => error.code === 'InvalidToken')) {
              this.toastr.error('Please retry with a different password!!', 'Error');
            } else {
              this.validationErrors = e;
           
            }
          },
        }
      );
  }

  cancel() {
    this.cancelResetPassword.emit(false);
  }
}
