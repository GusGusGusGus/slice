import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode: boolean = false;
  resetPasswordMode: boolean = false;

  constructor(private route: ActivatedRoute,
      private toastr: ToastrService
  ) {
  }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['emailConfirmed'] === 'true') {
        this.toastr.toastrConfig.positionClass = 'toast-bottom-center';
        this.toastr.success("<p><strong>Email confirmed. </strong></p> <p>You can now login.</p>", 'Success 🥳');
      }
    });
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }


  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }

  cancelResetPasswordMode(event: boolean) {
    this.resetPasswordMode = event;
  }

 
}
