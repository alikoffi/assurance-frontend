import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {DividerModule} from 'primeng/divider';
import {InputTextModule} from 'primeng/inputtext';
import {MessageModule} from 'primeng/message';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {RippleModule} from 'primeng/ripple';
import {SelectModule} from 'primeng/select';
import {StepsModule} from 'primeng/steps';
import {ErreurApi, SimulationResponse, SouscriptionRequest, SouscriptionResponse} from '../../../models/assurance.model';
import {AssuranceService} from '../../../services/assurance.service';

@Component({
	selector: 'app-souscription',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		ButtonModule,
		CardModule,
		DividerModule,
		InputTextModule,
		MessageModule,
		ProgressSpinnerModule,
		RippleModule,
		SelectModule,
		StepsModule
	],
	templateUrl: './souscription.html',
	styleUrl: './souscription.scss'
})
export class Souscription implements OnInit {
	activeIndex = 0;
	chargement = false;
	chargementSimulations = false;
	messageErreur = '';
	simulationsDisponibles: SimulationResponse[] = [];
	simulation?: SimulationResponse;
	souscription?: SouscriptionResponse;

	steps: MenuItem[] = [
		{label: 'Devis'},
		{label: 'Véhicule'},
		{label: 'Assuré'},
		{label: 'Validation'}
	];

	formDevis = new FormGroup({
		simulationId: new FormControl<number | null>(null, Validators.required)
	});

	formVehicule = new FormGroup({
		numeroImmatriculation: new FormControl('', Validators.required),
		couleur: new FormControl('', Validators.required),
		nombreSieges: new FormControl(5, [Validators.required, Validators.min(1)]),
		nombrePortes: new FormControl(4, [Validators.required, Validators.min(1)])
	});

	formAssure = new FormGroup({
		adresse: new FormControl('', Validators.required),
		telephone: new FormControl('', Validators.required),
		nom: new FormControl('', Validators.required),
		prenom: new FormControl('', Validators.required),
		numeroCarteIdentite: new FormControl('', Validators.required),
		ville: new FormControl('', Validators.required)
	});

	constructor(
		private readonly assuranceService: AssuranceService,
		private readonly route: ActivatedRoute
	) {
	}

	ngOnInit(): void {
		this.chargerSimulationsDisponibles();
	}

	chargerSimulationsDisponibles(): void {
		this.chargementSimulations = true;
		this.messageErreur = '';
		this.assuranceService.listerSimulations().subscribe({
			next: (simulations) => {
				this.simulationsDisponibles = simulations.filter((simulation) => this.estSelectionnable(simulation));
				this.chargementSimulations = false;
				this.preselectionnerSimulationDepuisUrl();
			},
			error: (err) => {
				this.messageErreur = this.extraireMessageErreur(err.error);
				this.chargementSimulations = false;
			}
		});
	}

	chargerSimulation(): void {
		this.messageErreur = '';
		this.souscription = undefined;

		if (this.formDevis.invalid) {
			this.formDevis.markAllAsTouched();
			this.messageErreur = 'Veuillez sélectionner un devis disponible.';
			return;
		}

		const simulation = this.simulationsDisponibles.find((item) => item.id === Number(this.formDevis.controls.simulationId.value));
		if (!simulation) {
			this.messageErreur = 'Ce devis n’est plus disponible pour une souscription.';
			return;
		}

		this.simulation = simulation;
		this.activeIndex = 1;
	}

	validerVehicule(): void {
		this.messageErreur = '';
		if (this.formVehicule.invalid) {
			this.formVehicule.markAllAsTouched();
			this.messageErreur = 'Veuillez renseigner les informations du véhicule.';
			return;
		}
		this.activeIndex = 2;
	}

	validerAssure(): void {
		this.messageErreur = '';
		if (this.formAssure.invalid) {
			this.formAssure.markAllAsTouched();
			this.messageErreur = 'Veuillez renseigner les informations de l’assuré.';
			return;
		}
		this.activeIndex = 3;
	}

	confirmer(): void {
		this.messageErreur = '';
		if (!this.simulation) {
			this.messageErreur = 'Aucun devis chargé pour la souscription.';
			this.activeIndex = 0;
			return;
		}

		this.chargement = true;
		this.assuranceService.souscrire(this.toPayload()).subscribe({
			next: (souscription) => {
				this.souscription = souscription;
				this.chargement = false;
			},
			error: (err) => {
				this.messageErreur = this.extraireMessageErreur(err.error);
				this.chargement = false;
			}
		});
	}

	telechargerAttestation(): void {
		if (!this.souscription) {
			return;
		}

		this.assuranceService.telechargerAttestation(this.souscription.id).subscribe({
			next: (blob) => {
				const url = URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = `attestation-${this.souscription?.numeroAttestation}.pdf`;
				link.click();
				URL.revokeObjectURL(url);
			},
			error: (err) => this.messageErreur = this.extraireMessageErreur(err.error)
		});
	}

	retour(etape: number): void {
		this.messageErreur = '';
		this.activeIndex = etape;
	}

	libelleSimulation(simulation: SimulationResponse): string {
		return `${simulation.quoteReference} - ${simulation.produitNom} - ${this.formatMontant(simulation.price)} - valable jusqu'au ${this.formaterDate(simulation.endDate)}`;
	}

	formatMontant(valeur: number): string {
		return new Intl.NumberFormat('fr-FR', {
			style: 'currency',
			currency: 'XOF',
			maximumFractionDigits: 0
		}).format(valeur || 0);
	}

	private preselectionnerSimulationDepuisUrl(): void {
		const simulationId = Number(this.route.snapshot.queryParamMap.get('simulationId'));
		if (!simulationId) {
			return;
		}

		const simulation = this.simulationsDisponibles.find((item) => item.id === simulationId);
		if (!simulation) {
			this.messageErreur = 'Le devis demandé est introuvable, expiré ou déjà souscrit.';
			return;
		}

		this.formDevis.patchValue({simulationId});
		this.chargerSimulation();
	}

	private estSelectionnable(simulation: SimulationResponse): boolean {
		return !simulation.souscrite && !this.estExpiree(simulation);
	}

	private estExpiree(simulation: SimulationResponse): boolean {
		const fin = new Date(simulation.endDate);
		fin.setHours(23, 59, 59, 999);
		return fin.getTime() < Date.now();
	}

	private formaterDate(date: string): string {
		return new Intl.DateTimeFormat('fr-FR').format(new Date(date));
	}

	private toPayload(): SouscriptionRequest {
		const vehicule = this.formVehicule.value;
		const assure = this.formAssure.value;

		return {
			simulationId: this.simulation?.id ?? 0,
			vehicule: {
				numeroImmatriculation: vehicule.numeroImmatriculation ?? '',
				couleur: vehicule.couleur ?? '',
				nombreSieges: Number(vehicule.nombreSieges),
				nombrePortes: Number(vehicule.nombrePortes)
			},
			assure: {
				adresse: assure.adresse ?? '',
				telephone: assure.telephone ?? '',
				nom: assure.nom ?? '',
				prenom: assure.prenom ?? '',
				numeroCarteIdentite: assure.numeroCarteIdentite ?? '',
				ville: assure.ville ?? ''
			}
		};
	}

	private extraireMessageErreur(erreur?: ErreurApi): string {
		return erreur?.messageAvecCode || erreur?.message || 'Une erreur est survenue pendant la souscription.';
	}
}
