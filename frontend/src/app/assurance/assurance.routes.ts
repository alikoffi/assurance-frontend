import {Routes} from '@angular/router';

export default [
	{
		path: '',
		redirectTo: 'simulation',
		pathMatch: 'full'
	},
	{
		path: 'simulation',
		data: {breadcrumb: 'Simulation'},
		loadComponent: () => import('./simulation/simulation').then((c) => c.Simulation)
	},
	{
		path: 'simulation/:id',
		data: {breadcrumb: 'Modifier une simulation'},
		loadComponent: () => import('./simulation/simulation').then((c) => c.Simulation)
	},
	{
		path: 'simulations',
		data: {breadcrumb: 'Simulations'},
		loadComponent: () => import('./simulations/simulations').then((c) => c.Simulations)
	},
	{
		path: 'souscription',
		data: {breadcrumb: 'Souscription'},
		loadComponent: () => import('./souscription/souscription').then((c) => c.Souscription)
	},
	{
		path: 'souscriptions',
		data: {breadcrumb: 'Souscriptions'},
		loadComponent: () => import('./souscriptions/souscriptions').then((c) => c.Souscriptions)
	},
	{
		path: 'assures',
		data: {breadcrumb: 'Assurés'},
		loadComponent: () => import('./assures/assures').then((c) => c.Assures)
	}
] as Routes;
