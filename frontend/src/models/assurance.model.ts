export interface CategorieVehiculeOption {
	code: string;
	libelle: string;
	description: string;
}

export interface ProduitAssuranceOption {
	code: string;
	nom: string;
	description: string;
	categoriesEligibles: string[];
}

export interface GarantiePrime {
	code: string;
	libelle: string;
	montant: number;
}

export interface SimulationRequest {
	produitCode: string;
	categorieCode: string;
	datePremiereMiseEnCirculation: string;
	puissanceFiscale: number;
	valeurNeuve: number;
	valeurVenale: number;
}

export interface SimulationResponse {
	id: number;
	quoteReference: string;
	endDate: string;
	produitCode: string;
	produitNom: string;
	categorieCode: string;
	datePremiereMiseEnCirculation: string;
	puissanceFiscale: number;
	valeurNeuve: number;
	valeurVenale: number;
	price: number;
	garanties: GarantiePrime[];
	utilisateurId?: number;
	utilisateurNom?: string;
	souscrite: boolean;
	modifiable: boolean;
}

export interface AssurePayload {
	adresse: string;
	telephone: string;
	nom: string;
	prenom: string;
	numeroCarteIdentite: string;
	ville: string;
}

export interface VehiculePayload {
	numeroImmatriculation: string;
	couleur: string;
	nombreSieges: number;
	nombrePortes: number;
}

export interface SouscriptionRequest {
	simulationId: number;
	assure: AssurePayload;
	vehicule: VehiculePayload;
}

export interface SouscriptionResponse {
	id: number;
	subscriptionReference: string;
	quoteReference: string;
	numeroAttestation: string;
	statut: string;
	dateSouscription: string | number[];
	price: number;
	utilisateurId?: number;
	utilisateurNom?: string;
}

export interface SouscriptionStatus {
	id: number;
	subscriptionReference: string;
	statut: string;
}

export interface AssureResponse {
	id: number;
	adresse: string;
	telephone: string;
	nom: string;
	prenom: string;
	numeroCarteIdentite: string;
	ville: string;
}

export type RoleUtilisateur = 'ADMIN' | 'AMAZONE';
export type StatutUtilisateur = 'ACTIF' | 'INACTIF';

export interface UtilisateurRequest {
	username: string;
	password?: string;
	nom: string;
	prenoms: string;
	role: RoleUtilisateur;
	statut: StatutUtilisateur;
}

export interface UtilisateurResponse {
	id: number;
	username: string;
	nom: string;
	prenoms: string;
	role: RoleUtilisateur;
	statut: StatutUtilisateur;
	mustChangePassword: boolean;
}

export interface ChangementMotDePasseRequest {
	ancienMotDePasse: string;
	nouveauMotDePasse: string;
	confirmationMotDePasse: string;
}

export interface ErreurApi {
	code?: string | number;
	message?: string;
	messageAvecCode?: string;
	details?: string[];
}
