import {CommonModule} from '@angular/common';
import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LayoutService} from '@/layout/service/layout.service';

@Component({
	selector: '[app-topbar]',
	standalone: true,
	imports: [RouterModule, CommonModule],
	templateUrl: './app.topbar.html',
	host: {
		class: 'layout-topbar'
	},
	styleUrl: 'app.topbar.scss'
})
export class AppTopbar {
	layoutService = inject(LayoutService);

	@ViewChild('menuButton') menuButton!: ElementRef<HTMLButtonElement>;

	@ViewChild('mobileMenuButton') mobileMenuButton!: ElementRef<HTMLButtonElement>;

	onMenuButtonClick() {
		this.layoutService.onMenuToggle();
	}

	onTopbarMenuToggle() {
		this.layoutService.layoutState.update((val) => ({...val, topbarMenuActive: !val.topbarMenuActive}));
	}
}
