import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {MessageModule} from 'primeng/message';
import {Table, TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {TooltipModule} from 'primeng/tooltip';
import {ErreurApi, SimulationResponse} from '../../../models/assurance.model';
import {AssuranceService} from '../../../services/assurance.service';

@Component({
	selector: 'app-simulations',
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
		TagModule,
		TooltipModule
	],
	templateUrl: './simulations.html',
	styleUrl: './simulations.scss'
})
export class Simulations implements OnInit {
	simulations: SimulationResponse[] = [];
	chargement = false;
	messageErreur = '';

	constructor(
		private readonly assuranceService: AssuranceService,
		private readonly router: Router
	) {
	}

	ngOnInit(): void {
		this.charger();
	}

	charger(): void {
		this.chargement = true;
		this.messageErreur = '';
		this.assuranceService.listerSimulations().subscribe({
			next: (simulations) => {
				this.simulations = simulations;
				this.chargement = false;
			},
			error: (err) => {
				this.messageErreur = this.extraireMessageErreur(err.error);
				this.chargement = false;
			}
		});
	}

	modifier(simulation: SimulationResponse): void {
		if (!simulation.modifiable) {
			return;
		}
		this.router.navigate(['/assurance/simulation', simulation.id]);
	}

	souscrire(simulation: SimulationResponse): void {
		if (!this.peutSouscrire(simulation)) {
			return;
		}
		this.router.navigate(['/assurance/souscription'], {queryParams: {simulationId: simulation.id}});
	}

	onGlobalFilter(table: Table, event: Event): void {
		table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
	}

	peutSouscrire(simulation: SimulationResponse): boolean {
		return !simulation.souscrite && !this.estExpiree(simulation);
	}

	estExpiree(simulation: SimulationResponse): boolean {
		const fin = new Date(simulation.endDate);
		fin.setHours(23, 59, 59, 999);
		return fin.getTime() < Date.now();
	}

	statutLibelle(simulation: SimulationResponse): string {
		if (simulation.souscrite) {
			return 'Souscrite';
		}
		if (this.estExpiree(simulation)) {
			return 'Expirée';
		}
		return 'Ouverte';
	}

	statutSeverity(simulation: SimulationResponse): 'success' | 'info' | 'warn' | 'danger' {
		if (simulation.souscrite) {
			return 'success';
		}
		if (this.estExpiree(simulation)) {
			return 'danger';
		}
		return 'info';
	}

	formatMontant(valeur: number): string {
		return new Intl.NumberFormat('fr-FR', {
			style: 'currency',
			currency: 'XOF',
			maximumFractionDigits: 0
		}).format(valeur || 0);
	}

	private extraireMessageErreur(erreur?: ErreurApi): string {
		return erreur?.messageAvecCode || erreur?.message || 'Impossible de charger les simulations.';
	}
}
