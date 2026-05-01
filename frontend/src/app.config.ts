import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {ApplicationConfig, LOCALE_ID} from '@angular/core';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling} from '@angular/router';
import {providePrimeNG} from 'primeng/config';
import {appRoutes} from './app.routes';
import Material from '@primeng/themes/material';
import {definePreset} from '@primeng/themes';
import {JWT_OPTIONS, JwtHelperService, JwtInterceptor} from "@auth0/angular-jwt";
import {apiInterceptor} from "./interceptors/api.interceptor";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";

const MyPreset = definePreset(Material, {
	semantic: {
		primary: {
			50: '{red.50}',
			100: '{red.100}',
			200: '{red.200}',
			300: '{red.300}',
			400: '{red.400}',
			500: '{red.500}',
			600: '{red.600}',
			700: '{red.700}',
			800: '{red.800}',
			900: '{red.900}',
			950: '{red.950}'
		}
	}
});

export const httpInterceptorsProviders = [
	{provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
];

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(
			appRoutes,
			withInMemoryScrolling({
				anchorScrolling: 'enabled',
				scrollPositionRestoration: 'enabled'
			}),
			withEnabledBlockingInitialNavigation()
		),
		JwtHelperService,
		httpInterceptorsProviders,
		provideHttpClient(withFetch(), withInterceptors([apiInterceptor])),
		provideAnimationsAsync(),
		providePrimeNG({
			ripple: true,
			inputStyle: 'filled',
			theme: {preset: MyPreset, options: {darkModeSelector: '.app-dark'}}
		}),
		{ provide: LocationStrategy, useClass: HashLocationStrategy },
		{ provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
		// { provide: LOCALE_ID, useValue: 'fr-FR' }
	]
};
