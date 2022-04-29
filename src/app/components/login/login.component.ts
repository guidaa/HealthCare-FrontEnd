import {Component, Inject, OnInit} from '@angular/core';
import myAppConfig from '../../config/my-app-config'
import * as OktaSignIn from '@okta/okta-signin-widget';
import {OKTA_AUTH, OktaAuthStateService} from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor(private oktaAuthService: OktaAuthStateService,
              @Inject(OKTA_AUTH)
              public oktaAuth: OktaAuth) {

    this.oktaSignin = new OktaSignIn (
      {
        logo: '/assets/images/logopharm.png',
        features: {
          registration: true
        },
        baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
        clientId: myAppConfig.oidc.clientId,
        redirectUri: myAppConfig.oidc.redirectUri,
        authParams: {
          pkce: true,
          issuer: myAppConfig.oidc.issuer,
          scopes: myAppConfig.oidc.scopes
        }
      }

    );
  }

  ngOnInit(): void {
    this.oktaSignin.remove();
    console.log('ola')

    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'}, // this name should be same as div tag in login.component.html
      (response) => {
      console.log('login', response)
      if (response.status === 'SUCCESS'){
        this.oktaAuth.signInWithRedirect();
      }
      },
      (error) => {
      console.log('error login')
      throw error;
      }
    );
  }

}