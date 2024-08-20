import { Component, HostListener, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ResetPasswordModalComponent } from '../modals/reset-password-modal/reset-password-modal.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrollFunction();
  }

  model: any = {
    usernameOrEmail: '',
    password: ''
  }

  validateAndCreateModel() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(this.model.usernameOrEmail);

    if (isEmail) {
      const { password } = this.model;
      this.model = { email: this.model.usernameOrEmail, password, username: '' };
    } else {
      const { password } = this.model;
      this.model = { username: this.model.usernameOrEmail, password, email: '' };
    }
  }
  bsModalRef: any;

  constructor(public accountService: AccountService, 
    private toastr: ToastrService,
    private router: Router,
    private modalService: BsModalService
    ) {
  }

  ngOnInit() : void {
    }

  login() {
    this.validateAndCreateModel();
    // const headers = new HttpHeaders().set('Skip-Global-Error-Handler', 'true');
    this.accountService.login(this.model).subscribe(
      {
        next: (response) => {
          this.router.navigateByUrl('members');

        },
        error: (error) => {
          console.log("Nav error: " + error);
        }
      })
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  openResetPasswordModal() {
    const config: ModalOptions = {
      class: 'modal-dialog-centered',
    };
    this.bsModalRef = this.modalService.show(ResetPasswordModalComponent, config);
    this.bsModalRef.content.resetEmail.subscribe(email => {
      this.accountService.sendResetPasswordLink(email).subscribe(() => {
        this.toastr.toastrConfig.timeOut = 20000;
        this.toastr.toastrConfig.extendedTimeOut = 20000;
        this.toastr.toastrConfig.positionClass = 'toast-bottom-center';
        this.toastr.success("<p><strong>A new reset-password link was just sent to your email!</strong></p> <p> Didn't receive a reset password email? Check your spam folder or click here to get a new link.</p>", 'Success 🥳')
        .onTap
        .pipe(take(1))
        .subscribe(() => this.toasterClickedHandler());
      });
    });
  }

  toasterClickedHandler() {
    this.bsModalRef.hide();
    this.openResetPasswordModal();
  }
  


  scrollFunction() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      document.getElementById("navbar").style.padding = "14px 16px";
      document.getElementById("logo").style.fontSize = "20px";
      const navLinks = document.getElementsByClassName("nav-link");
      for (let i = 0; i < navLinks.length; i++) {
        const navLink = navLinks[i] as HTMLElement;
        navLink.style.fontSize = "17px";
      }
      // console.log('scrolled to bottom');
    } else {
      document.getElementById("navbar").style.padding = "25px 10px";
      document.getElementById("logo").style.fontSize = "25px";
      const navLinks = document.getElementsByClassName("nav-link");
      for (let i = 0; i < navLinks.length; i++) {
        const navLink = navLinks[i] as HTMLElement;
        navLink.style.fontSize = "20px";
      }
      // console.log('scrolled to top');
    }
  }

}
