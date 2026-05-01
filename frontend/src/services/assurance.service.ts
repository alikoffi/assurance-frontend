import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
	CategorieVehiculeOption,
	ProduitAssuranceOption,
	SimulationRequest,
	SimulationResponse,
	AssureResponse,
	SouscriptionRequest,
	SouscriptionResponse,
	SouscriptionStatus
} from '../models/assurance.model';
import {Observable, of} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AssuranceService {
	private readonly simulationUrl = '/api/v1/simulations';
	private readonly souscriptionUrl = '/api/v1/subscriptions';
	private readonly assureUrl = '/api/v1/assures';

	private readonly categories: CategorieVehiculeOption[] = [
		{code: '201', libelle: 'Promenade et Affaire', description: 'Usage personnel'},
		{code: '202', libelle: 'Vehicules motorises a 2 ou 3 roues', description: 'Motocycle, tricycles'},
		{code: '203', libelle: 'Transport public de voyage', description: 'Vehicule transport de personnes'},
		{code: '204', libelle: 'Vehicule de transport avec taximetres', description: 'Taxis'}
	];

	private readonly produits: ProduitAssuranceOption[] = [
		{code: 'PAPILLON', nom: 'Papillon', description: 'RC, Dommages, Vol', categoriesEligibles: ['201']},
		{code: 'DOUBY', nom: 'Douby', description: 'RC, Dommages, Tierce Collision', categoriesEligibles: ['202']},
		{code: 'DOUYOU', nom: 'Douyou', description: 'RC, Dommages, Collision, Incendie', categoriesEligibles: ['201', '202']},
		{code: 'TOUTOURISQUOU', nom: 'Toutourisquou', description: 'Toutes garanties', categoriesEligibles: ['201']}
	];

	constructor(private readonly http: HttpClient) {
	}

	listerCategories(): Observable<CategorieVehiculeOption[]> {
		return of(this.categories);
	}

	listerProduits(): Observable<ProduitAssuranceOption[]> {
		return of(this.produits);
	}

	listerSimulations(): Observable<SimulationResponse[]> {
		return this.http.get<SimulationResponse[]>(this.simulationUrl);
	}

	creerSimulation(request: SimulationRequest): Observable<SimulationResponse> {
		return this.http.post<SimulationResponse>(this.simulationUrl, request);
	}

	modifierSimulation(id: number, request: SimulationRequest): Observable<SimulationResponse> {
		return this.http.put<SimulationResponse>(`${this.simulationUrl}/${id}`, request);
	}

	rechercherSimulation(id: number): Observable<SimulationResponse> {
		return this.http.get<SimulationResponse>(`${this.simulationUrl}/${id}`);
	}

	souscrire(request: SouscriptionRequest): Observable<SouscriptionResponse> {
		return this.http.post<SouscriptionResponse>(this.souscriptionUrl, request);
	}

	listerSouscriptions(): Observable<SouscriptionResponse[]> {
		return this.http.get<SouscriptionResponse[]>(this.souscriptionUrl);
	}

	listerAssures(): Observable<AssureResponse[]> {
		return this.http.get<AssureResponse[]>(this.assureUrl);
	}

	rechercherSouscription(id: number): Observable<SouscriptionResponse> {
		return this.http.get<SouscriptionResponse>(`${this.souscriptionUrl}/${id}`);
	}

	statutSouscription(id: number): Observable<SouscriptionStatus> {
		return this.http.get<SouscriptionStatus>(`${this.souscriptionUrl}/status/${id}`);
	}

	telechargerAttestation(id: number): Observable<Blob> {
		return this.http.get(`${this.souscriptionUrl}/${id}/attestation`, {responseType: 'blob'});
	}
}
