import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'cliente',
    pathMatch: 'full'
  },
  {
    path: 'cliente',
    loadChildren: () => import('./pages/cliente/cliente.module').then( m => m.ClientePageModule)
  },
  {
    path: 'vendedor',
    loadChildren: () => import('./pages/vendedor/vendedor.module').then( m => m.VendedorPageModule)
  },
  {
    path: 'bodeguero',
    loadChildren: () => import('./pages/bodeguero/bodeguero.module').then( m => m.BodegueroPageModule)
  },
  {
    path: 'contador',
    loadChildren: () => import('./pages/contador/contador.module').then( m => m.ContadorPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'registrar',
    loadChildren: () => import('./pages/registrar/registrar.module').then( m => m.RegistrarPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/p404/p404.module').then( m => m.P404PageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
