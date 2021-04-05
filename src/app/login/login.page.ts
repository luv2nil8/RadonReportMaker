import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, Platform } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { IntentDataService } from '../services/intent-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string;
  password: string;
  reportForm: FormGroup;
  back: any;
  badCredentials = false;

  constructor(
    public formBuilder: FormBuilder,
    private platform: Platform,
    public auth: AuthService,
    public nav: NavController

  ) { }

  ngOnInit() {
    this.back = this.platform.backButton.subscribeWithPriority(1, () => {
      // tslint:disable-next-line: no-string-literal
      navigator['app'].exitApp();
  });
    this.reportForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required]],
    });
    this.reportForm.controls.username.valueChanges.subscribe( val => {
      this.badCredentials = false;
      this.username = val;

    });
    this.reportForm.controls.password.valueChanges.subscribe( val => {
      this.badCredentials = false;
      this.password = val;


    });

  }
  async login(){
    const success = await this.auth.login({
      key: this.username,
      secret: this.password
    });
    if (success) {
      this.nav.navigateRoot('home');
    } else {
      this.reportForm.controls.username.markAsDirty();
      this.reportForm.controls.password.markAsDirty();
      this.badCredentials = true;
    }
  }

}
