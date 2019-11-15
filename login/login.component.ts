import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared-services/auth.service';
import { RestAPIService } from '../shared-services/restAPI.service';
import { PathConstants } from '../constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { LoginService } from './login.service';
import { MessageService } from 'primeng/api';
import { StatusMessage } from '../constants/Messages';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  roleId: number;
  godownCode: any;
  regionCode: any;
  godownName: any;
  regionName: any;
  openPanel: boolean;
  userName: string;
  password: any;
  isChecked: boolean;
  form: any = [];
  mappingId: any;
  mappingName: any;
  @Output() loggingIn = new EventEmitter<boolean>();

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService,
    private restApiService: RestAPIService, private loginService: LoginService,
    private messageService: MessageService) {

  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      pswd: ['', Validators.required]
    })
    this.isChecked = JSON.parse(this.authService.getKeepMeLoggedInStatus());
    // if (this.isChecked) {
    //   this.userName =  (this.authService.getCredentials() !== null) ? this.authService.getCredentials() : this.userName;
    //  }
  }

  get formControls() {
    return this.loginForm.controls;
  }

  onSignIn() {
    if (this.loginForm.invalid) {
      this.messageService.clear();
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ValidCredentialsErrorMessage });
      return;
    } else {
      let username = new HttpParams().append('userName', this.userName);
      this.restApiService.getByParameters(PathConstants.LOGIN, username).subscribe(credentials => {
        if (credentials !== undefined && credentials !== null && credentials.length !== 0) {
          if (this.userName.toLowerCase() === credentials[0].UserName.toLowerCase() && this.password === credentials[0].Pwd) {
            this.router.navigate(['Home']);
            this.roleId = credentials[0].RoleId;
            this.mappingId = credentials[0].MappingId;
            this.mappingName = credentials[0].MappingName;
            this.godownCode = (credentials[0].GodownCode !== '' && credentials[0].GodownCode !== undefined) ? credentials[0].GodownCode : 0;
            this.regionCode = (credentials[0].Regioncode !== '' && credentials[0].Regioncode !== undefined) ? credentials[0].Regioncode : 0;
            this.godownName = (credentials[0].GodownName !== null && credentials[0].GodownName !== undefined) ? credentials[0].GodownName : '';
            this.regionName = (credentials[0].RegionName !== null && credentials[0].RegionName !== undefined) ? credentials[0].RegionName : '';
            this.loginService.setValue(this.roleId);
            this.loginService.setValue(this.mappingId);
            this.loginService.setUsername(this.userName);
            const params = {
              RoleId: this.roleId,
              GCode: this.godownCode,
              RCode: this.regionCode,
              GName: this.godownName,
              RName: this.regionName,
              MappingId: this.mappingId,
              MappingName: this.mappingName
            }
            this.authService.login(this.loginForm.value, params);
          } else {
            this.clearFields();
            this.messageService.clear();
            this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ValidCredentialsErrorMessage });
          }
        } else {
          // this.clearFields();
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ValidCredentialsErrorMessage });
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        }
      });
    }
  }

  toggleVisibility(e) {
    this.authService.isKeepMeLoggedIn(e.target.checked);
    let check: any = this.authService.getKeepMeLoggedInStatus();
    this.isChecked = (check !== undefined &&
      check !== null) ? check : false;

  }

  clearFields() {
    this.userName = this.password = '';
  }
}
