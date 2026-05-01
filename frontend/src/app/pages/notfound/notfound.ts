import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';

@Component({
	selector: 'app-notfound',
	standalone: true,
	imports: [CommonModule, ButtonModule, RouterModule],
	template: `
		<div class="notfound-page">
			<div class="notfound-card">
				<span>404</span>
				<h1>Page introuvable</h1>
				<p>La page demandée n’existe pas.</p>
				<a pButton routerLink="/" label="Retour à l’accueil"></a>
			</div>
		</div>
	`,
	styles: [`
		.notfound-page {
			align-items: center;
			background: var(--surface-ground);
			display: flex;
			min-height: 100vh;
			justify-content: center;
			padding: 2rem;
		}

		.notfound-card {
			background: var(--surface-card);
			border: 1px solid var(--surface-border);
			border-radius: 1.25rem;
			box-shadow: var(--card-shadow);
			max-width: 30rem;
			padding: 2rem;
			text-align: center;
			width: 100%;
		}

		.notfound-card span {
			color: var(--primary-color);
			font-size: 4rem;
			font-weight: 800;
		}

		.notfound-card h1 {
			margin: .5rem 0;
		}

		.notfound-card p {
			color: var(--text-color-secondary);
			margin-bottom: 1.5rem;
		}
	`]
})
export class Notfound {
}
