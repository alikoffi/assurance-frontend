import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
	ChangementMotDePasseRequest,
	UtilisateurRequest,
	UtilisateurResponse
} from '../models/assurance.model';

@Injectable({
	providedIn: 'root'
})
export class UtilisateurApiService {
	private readonly url = '/api/v1/utilisateurs';

	constructor(private readonly http: HttpClient) {
	}

	lister(): Observable<UtilisateurResponse[]> {
		return this.http.get<UtilisateurResponse[]>(this.url);
	}

	creer(request: UtilisateurRequest): Observable<UtilisateurResponse> {
		return this.http.post<UtilisateurResponse>(this.url, request);
	}

	modifier(id: number, request: UtilisateurRequest): Observable<UtilisateurResponse> {
		return this.http.put<UtilisateurResponse>(`${this.url}/${id}`, request);
	}

	changerMotDePasse(request: ChangementMotDePasseRequest): Observable<UtilisateurResponse> {
		return this.http.put<UtilisateurResponse>(`${this.url}/me/mot-de-passe`, request);
	}
}
