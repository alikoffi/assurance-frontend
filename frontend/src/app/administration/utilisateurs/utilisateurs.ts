import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {MessageModule} from 'primeng/message';
import {PasswordModule} from 'primeng/password';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {RippleModule} from 'primeng/ripple';
import {SelectModule} from 'primeng/select';
import {Table, TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {
	ErreurApi,
	RoleUtilisateur,
	StatutUtilisateur,
	UtilisateurRequest,
	UtilisateurResponse
} from '../../../models/assurance.model';
import {UtilisateurApiService} from '../../../services/utilisateur-api.service';

@Component({
	selector: 'app-utilisateurs',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		ButtonModule,
		CardModule,
		DialogModule,
		IconFieldModule,
		InputIconModule,
		InputTextModule,
		MessageModule,
		PasswordModule,
		ProgressSpinnerModule,
		RippleModule,
		SelectModule,
		TableModule,
		TagModule
	],
	templateUrl: './utilisateurs.html',
	styleUrl: './utilisateurs.scss'
})
export class Utilisateurs implements OnInit {
	utilisateurs: UtilisateurResponse[] = [];
	utilisateurSelectionne?: UtilisateurResponse;
	dialogVisible = false;
	chargement = false;
	enregistrement = false;
	messageErreur = '';

	roles = [
		{label: 'Administrateur', value: 'ADMIN'},
		{label: 'Amazone', value: 'AMAZONE'}
	];

	statuts = [
		{label: 'Actif', value: 'ACTIF'},
		{label: 'Inactif', value: 'INACTIF'}
	];

	form = new FormGroup({
		username: new FormControl('', Validators.required),
		password: new FormControl(''),
		nom: new FormControl('', Validators.required),
		prenoms: new FormControl('', Validators.required),
		role: new FormControl<RoleUtilisateur>('AMAZONE', Validators.required),
		statut: new FormControl<StatutUtilisateur>('ACTIF', Validators.required)
	});

	constructor(private readonly utilisateurApiService: UtilisateurApiService) {
	}

	ngOnInit(): void {
		this.charger();
	}

	charger(): void {
		this.chargement = true;
		this.messageErreur = '';
		this.utilisateurApiService.lister().subscribe({
			next: (utilisateurs) => {
				this.utilisateurs = utilisateurs;
				this.chargement = false;
			},
			error: (err) => {
				this.messageErreur = this.extraireMessageErreur(err.error);
				this.chargement = false;
			}
		});
	}

	ouvrirCreation(): void {
		this.utilisateurSelectionne = undefined;
		this.form.reset({
			username: '',
			password: '',
			nom: '',
			prenoms: '',
			role: 'AMAZONE',
			statut: 'ACTIF'
		});
		this.dialogVisible = true;
	}

	ouvrirModification(utilisateur: UtilisateurResponse): void {
		this.utilisateurSelectionne = utilisateur;
		this.form.reset({
			username: utilisateur.username,
			password: '',
			nom: utilisateur.nom,
			prenoms: utilisateur.prenoms,
			role: utilisateur.role,
			statut: utilisateur.statut
		});
		this.dialogVisible = true;
	}

	enregistrer(): void {
		this.messageErreur = '';

		if (this.form.invalid || (!this.utilisateurSelectionne && !this.form.controls.password.value?.trim())) {
			this.form.markAllAsTouched();
			this.messageErreur = this.utilisateurSelectionne
				? 'Veuillez renseigner les champs obligatoires.'
				: 'Le mot de passe initial est obligatoire à la création.';
			return;
		}

		this.enregistrement = true;
		const requete = this.toPayload();
		const appel = this.utilisateurSelectionne
			? this.utilisateurApiService.modifier(this.utilisateurSelectionne.id, requete)
			: this.utilisateurApiService.creer(requete);

		appel.subscribe({
			next: () => {
				this.dialogVisible = false;
				this.enregistrement = false;
				this.charger();
			},
			error: (err) => {
				this.messageErreur = this.extraireMessageErreur(err.error);
				this.enregistrement = false;
			}
		});
	}

	onGlobalFilter(table: Table, event: Event): void {
		table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
	}

	libelleRole(role: RoleUtilisateur): string {
		return role === 'ADMIN' ? 'Administrateur' : 'Amazone';
	}

	severiteStatut(statut: StatutUtilisateur): 'success' | 'danger' {
		return statut === 'ACTIF' ? 'success' : 'danger';
	}

	private toPayload(): UtilisateurRequest {
		return {
			username: this.form.controls.username.value?.trim() ?? '',
			password: this.form.controls.password.value?.trim() || undefined,
			nom: this.form.controls.nom.value?.trim() ?? '',
			prenoms: this.form.controls.prenoms.value?.trim() ?? '',
			role: this.form.controls.role.value ?? 'AMAZONE',
			statut: this.form.controls.statut.value ?? 'ACTIF'
		};
	}

	private extraireMessageErreur(erreur?: ErreurApi): string {
		return erreur?.messageAvecCode || erreur?.message || 'Impossible de traiter les utilisateurs.';
	}
}
