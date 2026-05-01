import {CommonModule} from '@angular/common';
import {Component, computed, ElementRef, inject, OnDestroy, ViewChild} from '@angular/core';
import {LayoutService} from '@/layout/service/layout.service';
import {AppMenu} from './app.menu';
import {AppMenuProfile} from '@/layout/components/app.menuprofile';

@Component({
	selector: '[app-sidebar]',
	standalone: true,
	imports: [AppMenuProfile, AppMenu, CommonModule],
	template: `<div class="layout-sidebar" (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
		<div class="layout-sidebar-top">
			<a href="/" class="assurance-sidebar-logo">
				<span>Action'Elles</span>
			</a>
			<button class="layout-sidebar-anchor" type="button" (click)="anchor()"></button>
		</div>
		<div app-menu-profile #menuProfileStart *ngIf="menuProfilePosition() === 'start'"></div>
		<div #menuContainer class="layout-menu-container">
			<div app-menu></div>
		</div>
		<div app-menu-profile #menuProfileEnd *ngIf="menuProfilePosition() === 'end'"></div>
	</div>`,
	styles: `
		.assurance-sidebar-logo {
			color: var(--topbar-item-text-color);
			font-family: "Bauhaus 93", serif;
			font-size: 1.35rem;
			text-decoration: none;
		}
	`
})
export class AppSidebar implements OnDestroy {
	el = inject(ElementRef);

	layoutService = inject(LayoutService);

	@ViewChild(AppMenu) appMenu!: AppMenu;

	@ViewChild('menuContainer') menuContainer!: ElementRef;

	overlayMenuActive = computed(() => this.layoutService.layoutState().overlayMenuActive);

	menuProfilePosition = computed(() => this.layoutService.layoutConfig().menuProfilePosition);

	anchored = computed(() => this.layoutService.layoutState().anchored);

	timeout: ReturnType<typeof setTimeout> | null = null;

	resetOverlay() {
		if (this.overlayMenuActive()) {
			this.layoutService.layoutState.update((val) => ({...val, overlayMenuActive: false}));
		}
	}

	onMouseEnter() {
		if (!this.anchored()) {
			if (this.timeout) {
				clearTimeout(this.timeout);
				this.timeout = null;
			}
			this.layoutService.layoutState.update((val) => ({...val, sidebarActive: true}));
		}
	}

	onMouseLeave() {
		if (!this.anchored() && !this.timeout) {
			this.timeout = setTimeout(() => this.layoutService.layoutState.update((val) => ({...val, sidebarActive: false})), 300);
		}
	}

	anchor() {
		this.layoutService.layoutState.update((val) => ({...val, anchored: !val.anchored}));
	}

	ngOnDestroy() {
		this.resetOverlay();
	}
}
