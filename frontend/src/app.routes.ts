import {Routes} from '@angular/router';
import {AppLayout} from '@/layout/components/app.layout';

export const appRoutes: Routes = [
	{
		path: '',
		component: AppLayout,
		children: [
			{path: '', redirectTo: '/connexion', pathMatch: 'full'},
			{
				path: 'administration',
				data: {breadcrumb: 'Administration'},
				loadChildren: () => import('@/administration/administration.routes')
			},
			{
				path: 'assurance',
				data: {breadcrumb: 'Assurance'},
				loadChildren: () => import('@/assurance/assurance.routes')
			},
			{
				path: 'mot-de-passe',
				data: {breadcrumb: 'Mot de passe'},
				loadComponent: () => import('@/utilisateur/changement-mot-de-passe/changement-mot-de-passe').then((c) => c.ChangementMotDePasse)
			}
		]
	},
	{
		path: 'connexion',
		loadComponent: () => import('@/login/login').then((c) => c.Login)
	},
	{
		path: 'notfound',
		loadComponent: () => import('@/pages/notfound/notfound').then((c) => c.Notfound)
	},
	{path: '**', redirectTo: '/notfound'}
];
