import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {BehaviorSubject, Observable} from 'rxjs';
import {LoginPassword} from "../models/login-password.model";
import {Token} from "../models/token.model";
import {Utilisateur} from "../models/utilisateur.model";

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private url = '/api/v1/securite';

	utilisateur = new BehaviorSubject(null as Utilisateur);
	utilisateurObservable = this.utilisateur.asObservable();

	constructor(
		private http: HttpClient,
		private jwtHelper: JwtHelperService
	) {
	}

	static updateAccessToken(token: string): void {
		localStorage.removeItem('access_token');
		localStorage.setItem('access_token', token);
	}

	static updateMustChangePassword(mustChangePassword: boolean): void {
		localStorage.setItem('must_change_password', String(mustChangePassword));
	}

	getUtilisateurConnecte(): Utilisateur {
		if (this.isAuthenticated()) {
			return this.decodeToken(this.getToken());
		}
		return null;
	}

	decodeToken(jwt: string): Utilisateur {
		const utilisateur = new Utilisateur();
		const token = this.jwtHelper.decodeToken(jwt);
		utilisateur.id = token.id;
		utilisateur.nom = token.nom;
		utilisateur.prenoms = token.prenoms;
		utilisateur.login = token.username;
		utilisateur.role = token.role;
		utilisateur.fonctionnalites = token.fonctionnalites;
		utilisateur.statut = token.statut;
		utilisateur.mustChangePassword = this.mustChangePasswordValue(token.mustChangePassword === true);
		return utilisateur;
	}

	getRole(): string {
		return this.getUtilisateurConnecte() ? this.getUtilisateurConnecte().role : null;
	}

	isAdmin(): boolean {
		return this.getRole() === 'ADMIN';
	}

	mustChangePassword(): boolean {
		const utilisateur = this.getUtilisateurConnecte();
		return this.mustChangePasswordValue(utilisateur?.mustChangePassword === true);
	}

	getFonctionnalites(): string[] {
		return this.getUtilisateurConnecte() ? this.getUtilisateurConnecte().fonctionnalites : [];
	}

	authentifier(loginPassword: LoginPassword): Observable<Token> {
		return this.http.post<Token>(this.url + '/auth', loginPassword);
	}

	isAuthenticated(): boolean {
		const token = localStorage.getItem('access_token');
		return token && !this.jwtHelper.isTokenExpired(token);
	}

	private getToken(): string {
		const token = localStorage.getItem('access_token');
		return token ? token : '';
	}

	private mustChangePasswordValue(tokenValue: boolean): boolean {
		const storedValue = localStorage.getItem('must_change_password');
		return storedValue === null ? tokenValue : storedValue === 'true';
	}

	updateUtilisateurConnecte() {
		this.utilisateur.next(this.getUtilisateurConnecte());
	}

	hasFonctionnalite(codeFonctionnalite: string): boolean {
		return this.getFonctionnalites().includes(codeFonctionnalite);
	}
}
