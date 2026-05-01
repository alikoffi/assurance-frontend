# Action'Elles Assurance - Frontend

Application Angular de gestion des simulations et souscriptions d'assurance automobile pour Action'Elles.

Le frontend permet aux amazones de réaliser des simulations, créer des souscriptions, consulter les assurés liés à leur activité et télécharger les attestations PDF. L'administrateur dispose en plus d'un espace de gestion des utilisateurs.

## Stack technique

- Angular 19
- TypeScript
- PrimeNG 19
- Tailwind CSS
- JWT avec `@auth0/angular-jwt`
- API REST Spring Boot

## Prérequis

- Node.js compatible avec Angular 19
- npm
- Backend Action'Elles Assurance démarré sur `http://localhost:8075`

## Installation

Depuis le dossier `frontend` :

```bash
npm install
```

## Lancement local

```bash
npm start
```

L'application est disponible sur :

```text
http://localhost:4600
```

## Configuration

La configuration locale se trouve dans :

```text
environments/environment.ts
```

Valeurs attendues en local :

```ts
export const environment = {
    production: false,
    apiUrl: 'http://localhost:8075',
    url: 'http://localhost:4600'
};
```

Les appels API passent par l'intercepteur HTTP :

```text
src/interceptors/api.interceptor.ts
```

Il ajoute le token JWT aux requêtes authentifiées.

## Authentification

La connexion se fait depuis :

```text
/connexion
```

Après connexion, l'utilisateur est redirigé vers :

```text
/assurance/simulation
```

Comptes de test disponibles si les données Flyway du backend sont chargées :

| Login | Rôle |
| --- | --- |
| admin | ADMIN |
| amazone1 | AMAZONE |
| amazone2 | AMAZONE |

Mot de passe initial :

```text
eburtis2020
```

## Fonctionnalités

### Assurance

- Simulation de prime automobile.
- Consultation des simulations.
- Modification d'une simulation tant qu'elle n'est pas souscrite.
- Souscription à partir d'une simulation valide.
- Parcours de souscription en étapes avec sélection d'un devis disponible.
- Consultation des souscriptions.
- Téléchargement de l'attestation PDF.
- Consultation des assurés.

### Administration

- Création d'un utilisateur.
- Modification d'un utilisateur.
- Activation ou désactivation selon les règles exposées par l'API.
- Gestion des rôles `ADMIN` et `AMAZONE`.

## Rôles

| Rôle | Accès |
| --- | --- |
| ADMIN | Gère les utilisateurs et consulte l'ensemble des données. |
| AMAZONE | Crée des simulations, souscrit et consulte uniquement ses propres souscriptions et assurés. |

## Routes principales

| Route | Description |
| --- | --- |
| `/connexion` | Page de connexion. |
| `/mot-de-passe` | Changement de mot de passe. |
| `/assurance/simulation` | Simulation d'assurance automobile. |
| `/assurance/simulations` | Liste des simulations. |
| `/assurance/simulation/:id` | Modification d'une simulation ouverte. |
| `/assurance/souscription` | Souscription en étapes. |
| `/assurance/souscriptions` | Liste des souscriptions. |
| `/assurance/assures` | Liste des assurés. |
| `/administration/utilisateurs` | Gestion des utilisateurs. |

## Parcours de souscription

La souscription se fait depuis :

```text
/assurance/souscription
```

Le parcours contient 4 étapes :

| Étape | Rôle |
| --- | --- |
| Devis | Sélection d'une simulation ouverte, non expirée et non encore souscrite. |
| Véhicule | Saisie des informations du véhicule assuré. |
| Assuré | Saisie des informations du client assuré. |
| Validation | Contrôle du récapitulatif et création de la souscription. |

L'utilisateur ne saisit pas l'identifiant technique de simulation. Il choisit un devis dans une liste filtrable affichant la référence, le produit, la prime et la date de validité.

Depuis la page des simulations, le bouton de souscription redirige vers :

```text
/assurance/souscription?simulationId={id}
```

Si le devis est encore disponible, il est présélectionné automatiquement.

## Services principaux

| Fichier | Rôle |
| --- | --- |
| `src/services/auth.service.ts` | Authentification et gestion du token. |
| `src/services/assurance.service.ts` | Simulations, souscriptions, assurés et attestations. |
| `src/services/utilisateur-api.service.ts` | Gestion des utilisateurs. |
| `src/services/navigation.service.ts` | Redirections et navigation applicative. |
| `src/services/message-service.service.ts` | Messages utilisateur. |

## Modèles

Les modèles métier sont centralisés dans :

```text
src/models/assurance.model.ts
```

Ils couvrent principalement :

- les simulations ;
- les souscriptions ;
- les assurés ;
- les véhicules ;
- les utilisateurs ;
- les erreurs API.

## Scripts utiles

```bash
npm start
```

Démarre l'application en local sur le port `4600`.

```bash
npm run build
```

Génère le build de production.

```bash
npm test
```

Lance les tests Angular.

```bash
npm run format
```

Formate les fichiers TypeScript, JavaScript et HTML.

## Build

```bash
npm run build
```

Le résultat est généré dans :

```text
dist/action-elles
```

## Structure utile

```text
src/app/assurance              Écrans métier assurance
src/app/administration         Écrans d'administration
src/app/login                  Connexion
src/app/layout                 Layout, menu et navigation
src/interceptors               Intercepteurs HTTP
src/models                     Modèles TypeScript
src/services                   Services Angular
public/images/app              Images de l'application
```

## Backend attendu

Le frontend consomme l'API backend Action'Elles Assurance.

URL locale :

```text
http://localhost:8075/api/v1
```

Endpoints utilisés principalement :

```text
POST /api/v1/securite/auth
GET  /api/v1/simulations
POST /api/v1/simulations
GET  /api/v1/simulations/{id}
PUT  /api/v1/simulations/{id}
GET  /api/v1/subscriptions
POST /api/v1/subscriptions
GET  /api/v1/subscriptions/{id}/attestation
GET  /api/v1/assures
GET  /api/v1/utilisateurs
POST /api/v1/utilisateurs
PUT  /api/v1/utilisateurs/{id}
PUT  /api/v1/utilisateurs/me/mot-de-passe
```

## Notes

- Le token JWT est stocké côté navigateur et utilisé par l'intercepteur HTTP.
- Les erreurs API sont affichées au front avec le message renvoyé par le backend.
- Les dates venant du backend peuvent être normalisées côté frontend lorsqu'elles arrivent sous forme de tableau.
