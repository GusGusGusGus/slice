import { Component, EventEmitter, Input, OnInit, Renderer2 } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-reset-password-modal',
  templateUrl: './reset-password-modal.component.html',
  styleUrl: './reset-password-modal.component.css'
})
export class ResetPasswordModalComponent implements OnInit {


  @Input() resetEmail = new EventEmitter();
  email: string = ''; 
  result: boolean;
  resetForm: FormGroup;
  validationErrors: string[] = [];


  constructor(
    public bsModalRef: BsModalRef, 
    private fb: FormBuilder,
    private toastr: ToastrService,
    private bsModalService: BsModalService,
    private renderer: Renderer2  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }

    sendResetPasswordLink() {
      this.result = true;
      
      if (this.resetForm.invalid) {
        console.log('Invalid form');
      }
      this.email = this.resetForm.get('email').value;
      this.resetEmail.emit(this.email);
      this.bsModalRef.hide();

      
    }

}
