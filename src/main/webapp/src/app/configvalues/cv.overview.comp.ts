import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ConfigValue, ConfigValueHttpService } from '../util/http/configValue.http.service';
import { Sorter } from '../util/sorters.util';
import { Validator } from '../util/validator.util';
import { AlertService } from '../util/alert/alert.service';

/**
 * Copyright 2017 Cinovo AG<br>
 * <br>
 *
 * @author psigloch
 */
interface ConfigValueTreeNode {
  name: string;
  kvs: Array<ConfigValue>;
  icon: string;
}

@Component({
  selector: 'cv-overview',
  templateUrl: './cv.overview.comp.html'
})
export class ConfigValueOverview implements OnInit, OnDestroy {

  private _searchQuery: string = null;
  private routeSub: Subscription;

  public template: string;
  public kvLoaded = false;
  public edit: Array<boolean> = [];
  public tree: Array<ConfigValueTreeNode> = [];

  private filterData(cf: ConfigValue, query: string): boolean {
    if (cf.service == "VARIABLES") {
      return true;
    }
    if (Validator.notEmpty(query)) {
      for (let field in cf) {
        if (cf[field].indexOf(query.trim()) >= 0) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  constructor(private configHttp: ConfigValueHttpService,
              private route: ActivatedRoute,
              private router: Router,
              private alerts: AlertService) {
  };

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((paramMap) => {
      this.template = paramMap.get('template');
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  get searchQuery(): string {
    return this._searchQuery;
  }

  set searchQuery(value: string) {
    this._searchQuery = value;
    this.loadData();
  }

  protected deleteCurrentTemplate(): void {
    this.configHttp.deleteForTemplate(this.template)
      .subscribe(
        () => {
          this.alerts.success(`All config values for template '${this.template}' were deleted successfully!`);
          this.router.navigate(['config']);
        },
        (err) => {
          this.alerts.danger(`Error deleting config values for template '${this.template}'!`);
          console.error(err);
        }
      );
  }

  protected deleteService(serviceName: string): void {
    this.configHttp.deleteForService(this.template, serviceName)
      .subscribe(
        () => {
          this.alerts.success(`Successfully deleted all configuration values for service '${serviceName}'`);
          this.loadData();
        },
        (err) => {
          this.alerts.danger(`Error deleting configuration values for service '${serviceName}'!`);
          console.error(err);
        }
      );
  }

  protected triggerEdit(kv: ConfigValue): void {
    if (!this.edit[kv.service + kv.key]) {
      this.edit[kv.service + kv.key] = false;
    }
    this.edit[kv.service + kv.key] = true;
  }

  protected triggerEditDone(kv: ConfigValue): void {
    if (this.edit[kv.service + kv.key]) {
      this.edit[kv.service + kv.key] = false;
    }
  }

  private doDelete(kv: ConfigValue) {
    this.deleteKey(kv).subscribe(
      () => {
        let element: ConfigValueTreeNode;
        for (let nodeIndex in this.tree) {
          if (this.tree[nodeIndex].name === kv.service) {
            element = this.tree[nodeIndex];
          }
        }
        for (let i in element.kvs) {
          if (element.kvs[i].key === kv.key) {
            element.kvs.splice(+i, 1);
          }
        }
        if (element.kvs.length < 1) {
          this.tree.splice(this.tree.indexOf(element), 1);
        }
      },
      (err) => {
        this.alerts.danger(`Error deleting config pair '${kv.key}-${kv.value}'`);
        console.error(err);
      }
    );
  }

  private deleteKey(kv: ConfigValue): Observable<boolean> {
    return this.configHttp.deleteValue(kv);
  }

  private generateTree(result: Array<ConfigValue>): void {
    let temp: { [name: string]: Array<ConfigValue>; } = {};
    for (let cf of result) {
      if (this.filterData(cf, this._searchQuery)) {
        continue;
      }
      if (!cf.service) {
        cf.service = '';
      }
      if (!temp[cf.service]) {
        temp[cf.service] = [];
      }
      temp[cf.service].push(cf);
    }

    this.tree = [];
    for (let key in temp) {
      if (temp.hasOwnProperty(key)) {
        temp[key] = temp[key].sort(Sorter.configValue);
        this.tree.push({name: key, kvs: temp[key], icon: key.trim() === '' ? 'fa-institution' : 'fa-flask'});
      }
    }

    this.tree = this.tree.sort(Sorter.nameField);
  }

  private loadData() {
    this.configHttp.getValues(this.template).subscribe((result) => {
      this.generateTree(result);
      this.kvLoaded = true;
    }, (err) => {
      this.alerts.danger(`Error loading config values for template '${this.template}'!`);
      console.error(err);
      this.kvLoaded = true;
    });
  }

  protected goToDetail(cv: ConfigValue) {
    if (cv) {
      this.router.navigate(['config', cv.template, cv.service, cv.key]);
    }
  }

  protected save(kv: ConfigValue, event: any) {
    const oldVal = kv.value;
    kv.value = event;
    this.configHttp.save(kv).subscribe((success) => {
        this.alerts.success("Modified value for key : " + kv.key);
      }, (error) => {
        kv.value = oldVal;
        this.alerts.success("Failed to modify value for key : " + kv.key);
      }
    );
  }

}
