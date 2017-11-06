import { Component, Input, EventEmitter, Output } from '@angular/core';

/**
 * Copyright 2017 Cinovo AG<br>
 * <br>
 *
 * @author psigloch
 */
@Component({
  selector: 'cc-title',
  templateUrl: './cctitle.comp.html'
})
export class CCTitle {

  @Input() reloadable: boolean = false;
  @Input() title: string;
  @Input() titleIcon: string;
  @Input() subtitle: string;
  @Output() onReload: EventEmitter<any> = new EventEmitter();

  private autorefesh: boolean = false;

  constructor() { };

  private reload(): void {
    this.onReload.emit(true);
  }
}
