import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {MessageModule} from 'primeng/message';
import {Table, TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {ErreurApi, SouscriptionResponse} from '../../../models/assurance.model';
import {AssuranceService} from '../../../services/assurance.service';

@Component({
	selector: 'app-souscriptions',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		ButtonModule,
		CardModule,
		IconFieldModule,
		InputIconModule,
		InputTextModule,
		MessageModule,
		TableModule,
		TagModule
	],
	templateUrl: './souscriptions.html',
	styleUrl: './souscriptions.scss'
})
export class Souscriptions implements OnInit {
	souscriptions: SouscriptionResponse[] = [];
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
		this.assuranceService.listerSouscriptions().subscribe({
			next: (souscriptions) => {
				this.souscriptions = souscriptions.map((souscription) => ({
					...souscription,
					dateSouscription: this.normaliserDate(souscription.dateSouscription)
				}));
				this.chargement = false;
			},
			error: (err) => {
				this.messageErreur = this.extraireMessageErreur(err.error);
				this.chargement = false;
			}
		});
	}

	telechargerAttestation(souscription: SouscriptionResponse): void {
		this.assuranceService.telechargerAttestation(souscription.id).subscribe({
			next: (blob) => {
				const url = URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = `attestation-${souscription.numeroAttestation}.pdf`;
				link.click();
				URL.revokeObjectURL(url);
			},
			error: (err) => this.messageErreur = this.extraireMessageErreur(err.error)
		});
	}

	onGlobalFilter(table: Table, event: Event): void {
		table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
	}

	formatMontant(valeur: number): string {
		return new Intl.NumberFormat('fr-FR', {
			style: 'currency',
			currency: 'XOF',
			maximumFractionDigits: 0
		}).format(valeur || 0);
	}

	private extraireMessageErreur(erreur?: ErreurApi): string {
		return erreur?.messageAvecCode || erreur?.message || 'Impossible de charger les souscriptions.';
	}

	private normaliserDate(date: string | number[]): string {
		if (!Array.isArray(date)) {
			return date;
		}

		const [annee, mois, jour, heure = 0, minute = 0, seconde = 0] = date;
		return new Date(annee, mois - 1, jour, heure, minute, seconde).toISOString();
	}
}
