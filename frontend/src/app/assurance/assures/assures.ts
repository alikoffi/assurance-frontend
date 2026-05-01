import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {CardModule} from 'primeng/card';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {MessageModule} from 'primeng/message';
import {Table, TableModule} from 'primeng/table';
import {AssuranceService} from '../../../services/assurance.service';
import {AssureResponse, ErreurApi} from '../../../models/assurance.model';

@Component({
	selector: 'app-assures',
	standalone: true,
	imports: [
		CommonModule,
		CardModule,
		IconFieldModule,
		InputIconModule,
		InputTextModule,
		MessageModule,
		TableModule
	],
	templateUrl: './assures.html',
	styleUrl: './assures.scss'
})
export class Assures implements OnInit {
	assures: AssureResponse[] = [];
	chargement = false;
	messageErreur = '';

	constructor(private readonly assuranceService: AssuranceService) {
	}

	ngOnInit(): void {
		this.charger();
	}

	charger(): void {
		this.chargement = true;
		this.messageErreur = '';
		this.assuranceService.listerAssures().subscribe({
			next: (assures) => {
				this.assures = assures;
				this.chargement = false;
			},
			error: (err) => {
				this.messageErreur = this.extraireMessageErreur(err.error);
				this.chargement = false;
			}
		});
	}

	onGlobalFilter(table: Table, event: Event): void {
		table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
	}

	private extraireMessageErreur(erreur?: ErreurApi): string {
		return erreur?.messageAvecCode || erreur?.message || 'Impossible de charger les assurés.';
	}
}
