import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../shared-services/auth.service';
import { RestAPIService } from '../shared-services/restAPI.service';
import { PathConstants } from '../constants/path.constants';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-menu',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  items?: MenuItem[];
  isUser = false;
  roleId: any;
  mappingId: any;
  username: string;
  password: any;
  isLoggedIn: boolean;
  canShowMenu: boolean;
  homeLink: any;

  constructor(private restApiService: RestAPIService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.roleId = this.authService.checkLoggedInUserId();
    this.mappingId = JSON.parse(this.authService.getUserAccessible().mappingId);
    let id = new HttpParams().append('roleId', this.mappingId);
      this.restApiService.getByParameters(PathConstants.MENU, id).subscribe((res: any[]) => {
        if (res !== undefined) {
          this.items = res;
          this.items.forEach(x => {
            if (x.label === 'Home') {
              this.homeLink = x.routerLink;
              let index = this.items.findIndex(i => i.label === 'Home');
              this.items.splice(index, 1);
            } 
          })
        this.authService.setMenu(JSON.stringify(this.items));
        } 
      });
      if (this.items === undefined || this.items.length === 0) {
      this.items = JSON.parse(this.authService.getMenu());
      }
  }

}

