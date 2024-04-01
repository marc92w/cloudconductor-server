import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TitleStrategy } from "@angular/router";

import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { JwtModule } from "@auth0/angular-jwt";

import { CoreModule } from './app/core/core.module';
import { SharedModule } from './app/shared/shared.module';

import { AlertComponent } from './app/util/alert/alert.comp';
import { AppComponent } from './app/app.comp';
import { FooterComponent } from './app/footer/footer.comp';
import { NavComponent } from './app/nav/nav.comp';
import { TopNavComponent } from './app/nav/topNav.comp';
import { routing } from './app/app.routing';
import { CCTitleStrategy } from "./app/cc.title";

/**
 * Copyright 2017 Cinovo AG<br>
 * <br>
 *
 * @author psigloch, mweise
 */
@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'),
        disallowedRoutes: [/\/api\/auth$/],
      },
    }),
    BrowserAnimationsModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    ConfirmationPopoverModule.forRoot(),
    CoreModule,
    SharedModule,
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    NavComponent,
    TopNavComponent,
    FooterComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: TitleStrategy,
      useClass: CCTitleStrategy
    },
  ]
})
export class AppModule {}
