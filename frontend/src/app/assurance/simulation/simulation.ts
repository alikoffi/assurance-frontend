import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {DividerModule} from 'primeng/divider';
import {InputTextModule} from 'primeng/inputtext';
import {MessageModule} from 'primeng/message';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {RippleModule} from 'primeng/ripple';
import {ErreurApi, SimulationRequest, SimulationResponse, CategorieVehiculeOption, ProduitAssuranceOption} from '../../../models/assurance.model';
import {AssuranceService} from '../../../services/assurance.service';

@Component({
	selector: 'app-simulation',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule,
		ButtonModule,
		CardModule,
		DividerModule,
		InputTextModule,
		MessageModule,
		ProgressSpinnerModule,
		RippleModule
	],
	templateUrl: './simulation.html',
	styleUrl: './simulation.scss'
})
export class Simulation implements OnInit {
	produits: ProduitAssuranceOption[] = [];
	categories: CategorieVehiculeOption[] = [];
	simulation?: SimulationResponse;
	messageErreur = '';
	chargement = false;
	simulationId?: number;

	formSimulation = new FormGroup({
		produitCode: new FormControl('', Validators.required),
		categorieCode: new FormControl('', Validators.required),
		datePremiereMiseEnCirculation: new FormControl('', Validators.required),
		puissanceFiscale: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
		valeurNeuve: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
		valeurVenale: new FormControl<number | null>(null, [Validators.required, Validators.min(1)])
	});

	constructor(
		private readonly assuranceService: AssuranceService,
		private readonly router: Router,
		private readonly route: ActivatedRoute
	) {
	}

	ngOnInit(): void {
		this.assuranceService.listerProduits().subscribe((produits) => this.produits = produits);
		this.assuranceService.listerCategories().subscribe((categories) => this.categories = categories);

		const id = Number(this.route.snapshot.paramMap.get('id'));
		if (id) {
			this.simulationId = id;
			this.chargerSimulation(id);
		}
	}

	enregistrer(): void {
		this.messageErreur = '';
		this.simulation = undefined;

		if (this.formSimulation.invalid) {
			this.formSimulation.markAllAsTouched();
			this.messageErreur = 'Veuillez renseigner tous les champs obligatoires.';
			return;
		}

		this.chargement = true;
		const requete = this.simulationId
			? this.assuranceService.modifierSimulation(this.simulationId, this.toPayload())
			: this.assuranceService.creerSimulation(this.toPayload());

		requete.subscribe({
			next: (simulation) => {
				this.simulation = simulation;
				this.simulationId = simulation.id;
				this.chargement = false;
			},
			error: (err) => {
				this.messageErreur = this.extraireMessageErreur(err.error);
				this.chargement = false;
			}
		});
	}

	allerSouscription(): void {
		if (!this.simulation || this.simulation.souscrite) {
			return;
		}
		this.router.navigate(['/assurance/souscription'], {queryParams: {simulationId: this.simulation.id}});
	}

	allerListe(): void {
		this.router.navigate(['/assurance/simulations']);
	}

	nouvelleSimulation(): void {
		this.simulationId = undefined;
		this.simulation = undefined;
		this.messageErreur = '';
		this.formSimulation.reset();
		this.router.navigate(['/assurance/simulation']);
	}

	produitSelectionne(): ProduitAssuranceOption | undefined {
		const code = this.formSimulation.controls.produitCode.value;
		return this.produits.find((produit) => produit.code === code);
	}

	formatMontant(valeur: number): string {
		return new Intl.NumberFormat('fr-FR', {
			style: 'currency',
			currency: 'XOF',
			maximumFractionDigits: 0
		}).format(valeur || 0);
	}

	libelleAction(): string {
		return this.simulationId ? 'Enregistrer les modifications' : 'Calculer le devis';
	}

	titrePage(): string {
		return this.simulationId ? 'Modifier une simulation' : 'Simulation assurance automobile';
	}

	private chargerSimulation(id: number): void {
		this.chargement = true;
		this.assuranceService.rechercherSimulation(id).subscribe({
			next: (simulation) => {
				this.simulation = simulation;
				this.formSimulation.patchValue({
					produitCode: simulation.produitCode,
					categorieCode: simulation.categorieCode,
					datePremiereMiseEnCirculation: simulation.datePremiereMiseEnCirculation,
					puissanceFiscale: simulation.puissanceFiscale,
					valeurNeuve: simulation.valeurNeuve,
					valeurVenale: simulation.valeurVenale
				});
				if (!simulation.modifiable) {
					this.formSimulation.disable();
					this.messageErreur = 'Cette simulation est déjà souscrite et ne peut plus être modifiée.';
				}
				this.chargement = false;
			},
			error: (err) => {
				this.messageErreur = this.extraireMessageErreur(err.error);
				this.chargement = false;
			}
		});
	}

	private toPayload(): SimulationRequest {
		const valeur = this.formSimulation.getRawValue();
		return {
			produitCode: valeur.produitCode ?? '',
			categorieCode: valeur.categorieCode ?? '',
			datePremiereMiseEnCirculation: valeur.datePremiereMiseEnCirculation ?? '',
			puissanceFiscale: Number(valeur.puissanceFiscale),
			valeurNeuve: Number(valeur.valeurNeuve),
			valeurVenale: Number(valeur.valeurVenale)
		};
	}

	private extraireMessageErreur(erreur?: ErreurApi): string {
		return erreur?.messageAvecCode || erreur?.message || 'Une erreur est survenue pendant la simulation.';
	}
}
