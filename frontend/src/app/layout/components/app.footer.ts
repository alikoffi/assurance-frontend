import {Component, inject} from '@angular/core';
import {LayoutService} from "@/layout/service/layout.service";
import {NgClass} from "@angular/common";

@Component({
	standalone: true,
	selector: '[app-footer]',
	imports: [NgClass],
	template: `
		<span class="font-medium text-lg text-muted-color titre-logo">
			<span [ngClass]="{'text-white': layoutService.isDarkTheme(), 'text-red-700': !layoutService.isDarkTheme()}">Action'Elles</span>
		</span>
		<div></div>`,
	host: {
		class: 'layout-footer'
	},
	styles: `
		.titre-logo span {
			font-family: "Bauhaus 93", serif;
			font-weight: normal;
			font-size: 20px;
		}
	`
})
export class AppFooter {
	layoutService = inject(LayoutService);
}
