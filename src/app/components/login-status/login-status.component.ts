import {Component, Inject, OnInit} from '@angular/core';
import {OKTA_AUTH, OktaAuthStateService} from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string;
  userEmail: string;

  storage: Storage = sessionStorage;

  constructor(private oktaAuthService: OktaAuthStateService,
              @Inject(OKTA_AUTH)
              public oktaAuth: OktaAuth) { }




  ngOnInit(): void {

    // Subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        console.log(result, 'aqui')
        this.isAuthenticated =  result.isAuthenticated;
        this.getUserDetails();
      }
    )
  }

  private getUserDetails() {
    if (this.isAuthenticated){
      // fetch the logged in user details (users claim)
      //
      // user full name is exposed as a property name
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name;
          this.userEmail = res.email;

          // retrieve the user's email form authentication response
          const theEmail = res.email;

          // now store the email in browser
          this.storage.setItem('userEmail', JSON.stringify(theEmail));
        }
      );
    }
  }

  logout () {
    // terminates the session with Okta and removes current tokens.
    this.oktaAuth.signOut();
  }

}
