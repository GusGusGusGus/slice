import { Component, HostListener, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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

  model: any = {}

  constructor(public accountService: AccountService, 
    private toastr: ToastrService,
    private router: Router) {
  }

  ngOnInit() : void {
    }

  login() {
    this.accountService.login(this.model).subscribe(
      {
        next: (response) => {
          this.router.navigateByUrl('members');

        }
      })
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
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
