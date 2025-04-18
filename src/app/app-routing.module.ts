import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: '', redirectTo: 'welcome', pathMatch: 'full'},
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)},
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)},
  {
    path: 'admin-view',
    loadChildren: () => import('./pages/admin-view/admin-view.module').then( m => m.AdminViewPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
