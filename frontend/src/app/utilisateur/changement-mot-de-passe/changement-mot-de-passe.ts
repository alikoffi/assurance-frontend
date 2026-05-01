import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {MessageModule} from 'primeng/message';
import {PasswordModule} from 'primeng/password';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {RippleModule} from 'primeng/ripple';
import {ErreurApi} from '../../../models/assurance.model';
import {AuthService} from '../../../services/auth.service';
import {UtilisateurApiService} from '../../../services/utilisateur-api.service';

@Component({
	selector: 'app-changement-mot-de-passe',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		ButtonModule,
		CardModule,
		InputTextModule,
		MessageModule,
		PasswordModule,
		ProgressSpinnerModule,
		RippleModule
	],
	templateUrl: './changement-mot-de-passe.html',
	styleUrl: './changement-mot-de-passe.scss'
})
export class ChangementMotDePasse {
	chargement = false;
	messageErreur = '';
	messageSucces = '';

	form = new FormGroup({
		ancienMotDePasse: new FormControl('', Validators.required),
		nouveauMotDePasse: new FormControl('', [Validators.required, Validators.minLength(6)]),
		confirmationMotDePasse: new FormControl('', Validators.required)
	});

	constructor(
		private readonly utilisateurApiService: UtilisateurApiService,
		private readonly authService: AuthService,
		private readonly router: Router
	) {
	}

	changer(): void {
		this.messageErreur = '';
		this.messageSucces = '';

		if (this.form.invalid) {
			this.form.markAllAsTouched();
			this.messageErreur = 'Veuillez renseigner les trois champs. Le nouveau mot de passe doit contenir au moins 6 caractères.';
			return;
		}

		if (this.form.controls.nouveauMotDePasse.value !== this.form.controls.confirmationMotDePasse.value) {
			this.messageErreur = 'Le nouveau mot de passe et sa confirmation doivent être identiques.';
			return;
		}

		this.chargement = true;
		this.utilisateurApiService.changerMotDePasse({
			ancienMotDePasse: this.form.controls.ancienMotDePasse.value ?? '',
			nouveauMotDePasse: this.form.controls.nouveauMotDePasse.value ?? '',
			confirmationMotDePasse: this.form.controls.confirmationMotDePasse.value ?? ''
		}).subscribe({
			next: () => {
				AuthService.updateMustChangePassword(false);
				this.authService.updateUtilisateurConnecte();
				this.messageSucces = 'Mot de passe modifié. Redirection vers la simulation.';
				this.chargement = false;
				setTimeout(() => this.router.navigate(['/assurance/simulation']), 700);
			},
			error: (err) => {
				this.messageErreur = this.extraireMessageErreur(err.error);
				this.chargement = false;
			}
		});
	}

	private extraireMessageErreur(erreur?: ErreurApi): string {
		return erreur?.messageAvecCode || erreur?.message || 'Impossible de modifier le mot de passe.';
	}
}
