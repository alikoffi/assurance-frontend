import {Routes} from '@angular/router';

export default [
	{path: '', redirectTo: '/administration/utilisateurs', pathMatch: 'full'},
	{
		path: 'utilisateurs',
		data: {breadcrumb: 'Utilisateurs'},
		loadComponent: () => import('./utilisateurs/utilisateurs').then((c) => c.Utilisateurs)
	},
	{path: '**', redirectTo: '/notfound'}
] as Routes;
