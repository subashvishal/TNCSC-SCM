import { Injectable } from '@angular/core';
import { RestAPIService } from '../shared-services/restAPI.service';
import { PathConstants } from '../constants/path.constants';
import { AuthService } from '../shared-services/auth.service';


@Injectable({
    providedIn: 'root'
})

export class RoleBasedService {
    instance?: any;
    scheme_data?: any;
    loggedInRegion: any;
    roleId: any;
    gCode: any;
    rCode: any;
    regionsData: any = [];
    godownsList: any = [];
    constructor(private restApiService: RestAPIService, private authService: AuthService) { }

    /// All Godowns
    getGodowns() {
        this.godownsList = [];
        let godowns;
        this.restApiService.get(PathConstants.GODOWN_MASTER).subscribe((res: any) => {
            res.forEach(x => {
                godowns = x.list;
                godowns.forEach(data => { this.godownsList.push({ 'GName': data.Name, 'GCode': data.GCode, 'RCode': data.Code }) });
            });
        })
        return this.godownsList;
    }

    ///End

    /// All regions
    getRegions() {
        this.regionsData = [];
        this.restApiService.get(PathConstants.GODOWN_MASTER).subscribe((res: any) => {
            res.forEach(x => {
                this.regionsData.push({ 'RName': x.Name, 'RCode': x.Code });
            });
        })
        return this.regionsData;
    }
    ///End

    /// Godowns and Regions according to user role 
    getInstance() {
        this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
        this.gCode = this.authService.getUserAccessible().gCode;
        this.rCode = this.authService.getUserAccessible().rCode;
        let godownList = [];
        this.instance = [];
        this.restApiService.get(PathConstants.GODOWN_MASTER).subscribe((res: any) => {
            res.forEach(x => {
                if (this.roleId === 1) {
                    godownList = x.list;
                    godownList.forEach(value => {
                        this.instance.push({ 'RName': x.Name, 'RCode': value.Code, 'GName': value.Name, 'GCode': value.GCode });
                    });
                } else if (this.roleId === 2) {
                    if (x.Code === this.rCode) {
                        godownList = x.list;
                        godownList.forEach(value => {
                            this.instance.push({ 'RName': x.Name, 'RCode': value.Code, 'GName': value.Name, 'GCode': value.GCode });
                        });
                    }
                } else {
                    if (x.Code === this.rCode) {
                        godownList = x.list.filter(y => {
                            return y.GCode === this.gCode;
                        });
                        godownList.forEach(value => {
                            this.instance.push({ 'RName': x.Name, 'RCode': value.Code, 'GName': value.Name, 'GCode': value.GCode });
                        });
                    }
                }
            });

        });
        return this.instance;
    }
    ///End

    /// Scheme Master Data
    getSchemeData() {
        if (this.scheme_data === undefined) {
            this.scheme_data = [];
            this.restApiService.get(PathConstants.SCHEMES).subscribe((res: any) => {
                if (res !== undefined) {
                    res.forEach(value => {
                        this.scheme_data.push({ 'SName': value.Name, 'SCode': value.SCCode });
                    })
                }
            });
        }
        return this.scheme_data;
    }
    ///End

}