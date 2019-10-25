import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'about', loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule) },
  { path: 'scanner', loadChildren: () => import('./scanner/scanner.module').then( m => m.ScannerPageModule) },
  { path: 'main', loadChildren: './main/main.module#MainPageModule' },
  { path: 'recinfo', loadChildren: './recinfo/recinfo.module#RecinfoPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
