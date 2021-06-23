import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'reg-prosp-ini',
    loadChildren: () => import('./reg-prosp-ini/reg-prosp-ini.module').then( m => m.RegProspIniPageModule)
  },
  {
    path: 'prospectos-list',
    loadChildren: () => import('./prospectos-list/prospectos-list.module').then( m => m.ProspectosListPageModule)
  },
  {
    path: 'add-visita',
    loadChildren: () => import('./add-visita/add-visita.module').then( m => m.AddVisitaPageModule)
  },
  {
    path: 'add-cliente',
    loadChildren: () => import('./add-cliente/add-cliente.module').then( m => m.AddClientePageModule)
  },
  {
    path: 'add-obra',
    loadChildren: () => import('./add-obra/add-obra.module').then( m => m.AddObraPageModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./clientes/clientes.module').then( m => m.ClientesPageModule)
  },
  {
    path: 'obras',
    loadChildren: () => import('./obras/obras.module').then( m => m.ObrasPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
