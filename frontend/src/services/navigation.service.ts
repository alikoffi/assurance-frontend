import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class NavigationService {
	readonly URL_CONNEXION = 'connexion';

	constructor(private readonly router: Router) {
	}

	public async goTo(route: string): Promise<void> {
		await this.router.navigate([route]);
	}

	isLogin(): boolean {
		return this.router.url === `/${this.URL_CONNEXION}`;
	}

	isPassword(): boolean {
		return this.router.url.includes('/mot-de-passe');
	}

	goToHome(): void {
		this.goTo('/assurance/simulation');
	}

	goTologin(): void {
		this.goTo(this.URL_CONNEXION);
	}

	getCurrentUrl(): string {
		return this.router.url;
	}

	getHostname(): string {
		return window.location.hostname;
	}

	isHome(): boolean {
		return this.router.url.includes('/assurance');
	}
}
