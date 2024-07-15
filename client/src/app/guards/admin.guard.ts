import { Inject, Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(private accountService: AccountService, private toastr: ToastrService) {}

  canActivate() : Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map(user => {
        if (user.roles.includes('Admin') || user.roles.includes('Moderator')) return true;
        this.toastr.error('You shall not pass!');
        return false;
      })
    );
  }
  
}