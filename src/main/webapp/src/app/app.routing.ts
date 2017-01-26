import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.comp";
import { ConfigValueOverview } from "./configvalues/cv.overview.comp";
import { ConfigValueEdit } from "./configvalues/cs.edit.comp";
import { ServiceOverview } from "./service/service.overview.comp";
import { ServiceDetail } from "./service/service.detail.comp";
import { SettingsOverview } from "./settings/settings.overview.comp";
import { PackageOverview } from "./packages/package.overview.comp";
import { PackageDetail } from "./packages/package.detail.comp";
import { RepoOverview } from "./repo/repo.overview.comp";
import { RepoEdit } from "./repo/repo.edit.comp";
import { MirrorEdit } from "./repo/mirror.edit.comp";
import { TemplateOverview } from "./template/template.overview.comp";
import { TemplateDetail } from "./template/template.detail.comp";
import { TemplateNew } from "./template/template.new.comp";

/**
 * Copyright 2017 Cinovo AG<br>
 * <br>
 *
 * @author psigloch
 */
export const APP_ROUTES: Routes = [

  {path: 'home', component: HomeComponent},

  {path: 'host', component: HomeComponent},

  {path: 'template', component: TemplateOverview},
  {path: 'template/new', component: TemplateNew},
  {path: 'template/:templateName', component: TemplateDetail},

  {path: 'config/:template', component: ConfigValueOverview},
  {path: 'config/:template/:service/new', component: ConfigValueEdit},
  {path: 'config/:template/:service/:key', component: ConfigValueEdit},

  {path: 'file', component: HomeComponent},

  {path: 'directory', component: HomeComponent},

  {path: 'service', component: ServiceOverview},
  {path: 'service/:serviceName', component: ServiceDetail},
  {path: 'service/new', component: ServiceDetail},

  {path: 'package', component: PackageOverview},
  {path: 'package/:packageName', component: PackageDetail},

  {path: 'repo', component: RepoOverview},
  {path: 'repo/new', component: RepoEdit},
  {path: 'repo/:repoName', component: RepoEdit},
  {path: 'repo/:repoName/mirror/new', component: MirrorEdit},
  {path: 'repo/:repoName/mirror/:mirrorid', component: MirrorEdit},

  {path: 'ssh', component: HomeComponent},

  {path: 'settings', component: SettingsOverview},

  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: '/home', pathMatch: 'full'},
];

export const ROUTED_COMPONENTS = () => {
  let res = [];
  for (let route of APP_ROUTES) {
    if (route.component) {
      res.push(route.component);
    }
  }
  return res;
};
