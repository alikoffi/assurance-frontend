import {NgIf} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from 'primeng/ripple';
import {InputGroup} from 'primeng/inputgroup';
import {InputGroupAddon} from 'primeng/inputgroupaddon';
import {MessageModule} from 'primeng/message';
import {ApplicationErreur} from '../../models/application-erreur.model';
import {LoginPassword} from '../../models/login-password.model';
import {AuthService} from '../../services/auth.service';
import {NavigationService} from '../../services/navigation.service';
import {CustomValidators} from '../../validators/custom-validators';

@Component({
	selector: 'app-login-2',
	standalone: true,
	imports: [
		ButtonModule,
		InputTextModule,
		RouterModule,
		RippleModule,
		InputGroup,
		InputGroupAddon,
		ReactiveFormsModule,
		MessageModule,
		NgIf
	],
	templateUrl: './login.html',
	styleUrl: './login.scss'
})
export class Login implements OnInit {
	formAuthentification = new FormGroup({
		username: new FormControl('', CustomValidators.notBlank),
		password: new FormControl('', CustomValidators.notBlank)
	});

	messageErreur?: ApplicationErreur;
	chargement = false;

	constructor(
		private readonly authService: AuthService,
		private readonly navigationService: NavigationService
	) {
	}

	ngOnInit(): void {
		if (this.authService.isAuthenticated()) {
			this.authService.updateUtilisateurConnecte();
			this.navigationService.goToHome();
		}
	}

	authentifier(): void {
		if (this.formAuthentification.invalid) {
			this.formAuthentification.markAllAsTouched();
			return;
		}

		this.chargement = true;
		this.messageErreur = undefined;
		this.authService.authentifier(new LoginPassword(this.formAuthentification.value)).subscribe({
			next: (data) => {
				AuthService.updateAccessToken(data.token);
				AuthService.updateMustChangePassword(data.mustChangePassword === true);
				this.authService.updateUtilisateurConnecte();
				this.chargement = false;
				if (data.mustChangePassword === true) {
					this.navigationService.goTo('/mot-de-passe');
					return;
				}
				this.navigationService.goToHome();
			},
			error: (err) => {
				this.messageErreur = err.error;
				this.chargement = false;
			}
		});
	}
}
