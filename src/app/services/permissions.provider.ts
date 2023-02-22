import { Injectable } from "@angular/core";
import * as _ from "lodash";
import { UserAccessData } from "src/server";
import { SecurityManagerServiceService } from "src/server/api/securityManagerService.service";

@Injectable()
export class PermissionsProvider {

  public allResources: Array<any> = [];
  public combinedResources: Array<any> = [];
  public openResources: Array<String> = [];
  public createResources: Array<String> = [];
  public editResources: Array<String> = [];
  public deleteResources: Array<String> = [];


  constructor(private securityService: SecurityManagerServiceService) {

  }


  getPermissions = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.securityService.getUserAccessData().subscribe({
        next: (data) => {
          this.allResources = data;
          this.categorisePermissions();
          resolve(data);
        }
      });
    });
  }

  categorisePermissions = () => {
    this.combinedResources.splice(0);
    this.openResources.splice(0);
    this.createResources.splice(0);
    this.editResources.splice(0);
    this.deleteResources.splice(0);
   
    _.forEach(this.allResources, (resource: UserAccessData) => {
      if (resource.accessOpen && resource.resourceKey) {
        this.openResources.push(resource.resourceKey);
      }
      if (resource.accessCreate && resource.resourceKey) {
        this.createResources.push(resource.resourceKey);
      }
      if (resource.accessEdit && resource.resourceKey) {
        this.editResources.push(resource.resourceKey);
      }
      if (resource.accessDelete && resource.resourceKey) {
        this.deleteResources.push(resource.resourceKey);
      }
      if (resource.accessOpen || resource.accessCreate || resource.accessEdit || resource.accessDelete) {
        this.combinedResources.push(resource.resourceKey);
      }
    });
  }

  canAccess = (permissions: Array<string>): boolean => {
    if (permissions.length === 0) {
      return true;
    }
    
    return _.some(permissions, (permission: any) => {
      return _.indexOf(this.combinedResources, permission) > -1 ? true : false;
    });
  }

  canCreate = (permission: string): boolean => {
    return _.indexOf(this.createResources, permission) > -1 ? true : false;
  }

  canEdit = (permission: string): boolean => {
    return _.indexOf(this.editResources, permission) > -1 ? true : false;
  }

  canDelete = (permission: string): boolean => {
    return _.indexOf(this.deleteResources, permission) > -1 ? true : false;
  }
}