import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { ConfigValue, ConfigValueHttpService } from '../util/http/configValue.http.service';
import { AlertService } from '../util/alert/alert.service';
import { forbiddenNameValidator } from '../util/validator.util';
import { ServiceHttpService } from '../util/http/service.http.service';
import { Sorter } from '../util/sorters.util';

/**
 * Copyright 2017 Cinovo AG<br>
 * <br>
 *
 * @author psigloch
 */
@Component({
  selector: 'cs-edit',
  templateUrl: './cs.edit.comp.html'
})
export class ConfigValueEdit implements OnInit {

  public kvForm: FormGroup;

  public template: string;
  public templates: Array<String> = [];
  public services: Array<String> = [];

  constructor(private configHttp: ConfigValueHttpService,
              private route: ActivatedRoute,
              private alerts: AlertService,
              private router: Router,
              private serviceHttp: ServiceHttpService,
              private fb: FormBuilder) {
    this.kvForm = this.fb.group({
      key: ['', [Validators.required, forbiddenNameValidator('new')]],
      value: ['', Validators.required],
      template: '',
      service: ''
    });
  };

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let template = params['template'] || '';
      const service = params['service'] || '';
      const key = params['key'] || '';
      const value = params['value'] || '';

      this.template = template;

      if (template === 'newTemplate') {
        template = '';
      }
      let formObj = {key, value, template, service};
      this.kvForm.setValue(formObj);
    });
    this.configHttp.templates.subscribe((result) => this.templates = result);
    this.serviceHttp.getServices().subscribe((result) => {
      this.services = result.sort(Sorter.service).map((val) => val.name);
    });
  }

  public save(newConfigPair: ConfigValue): void {
    let check: Observable<boolean> = this.configHttp.existsConfigValue(newConfigPair.template, newConfigPair.service, newConfigPair.key);
    check.flatMap(exists => {
      if (exists) {
        return Observable.throw(`Configuration for '${newConfigPair.key}' does already exist!`);
      } else {
        return this.configHttp.save(newConfigPair);
      }
    }).subscribe(
      () => {
        this.alerts.success(`Successfully created key-value pair: '${newConfigPair.key} - ${newConfigPair.value}'.`);
        this.router.navigate(['/config', newConfigPair.template])
      }, (err) => {
        this.alerts.danger(`Error creating new key-value pair '${newConfigPair.key} - ${newConfigPair.value}': ${err}`);
        console.error(err);
      }
    );
  }

}
