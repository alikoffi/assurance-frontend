import {CommonModule} from '@angular/common';
import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {AuthService} from '../../../services/auth.service';
import {AppMenuitem} from './app.menuitem';

@Component({
	selector: 'app-menu, [app-menu]',
	standalone: true,
	imports: [CommonModule, AppMenuitem, RouterModule],
	template: `
		<ul class="layout-menu" #menuContainer>
			<ng-container *ngFor="let item of model; let i = index">
				<li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
				<li *ngIf="item.separator" class="menu-separator"></li>
			</ng-container>
		</ul>`
})
export class AppMenu implements OnInit {
	el: ElementRef = inject(ElementRef);
	private readonly authService = inject(AuthService);

	@ViewChild('menuContainer') menuContainer!: ElementRef;

	model: MenuItem[] = [];

	ngOnInit(): void {
		this.model = [
			{
				label: 'Assurance automobile',
				items: [
					{
						label: 'Simulation',
						icon: 'fa fa-calculator',
						routerLink: ['/assurance/simulation']
					},
					{
						label: 'Simulations',
						icon: 'fa fa-history',
						routerLink: ['/assurance/simulations']
					},
					{
						label: 'Souscription',
						icon: 'fa fa-file-text-o',
						routerLink: ['/assurance/souscription']
					},
					{
						label: 'Souscriptions',
						icon: 'fa fa-list',
						routerLink: ['/assurance/souscriptions']
					},
					{
						label: 'Assurés',
						icon: 'fa fa-address-book-o',
						routerLink: ['/assurance/assures']
					}
				]
			},
			...(this.authService.isAdmin() ? [{
				label: 'Administration',
				items: [
					{
						label: 'Utilisateurs',
						icon: 'fa fa-users',
						routerLink: ['/administration/utilisateurs']
					}
				]
			}] : [])
		];
	}
}
