# Agenda Familiare su 6 telefoni - dati salvati su GitHub

## Come funziona

- **Repository 1 `agenda-famiglia` (pubblico)**: contiene i file dell'app. GitHub Pages li pubblica e i telefoni li installano.
- **Repository 2 `agenda-dati` (PRIVATO)**: contiene solo il file `data.json` con tutti i dati (appuntamenti, casa, spesa, bollette, scadenze, colori).
- Ogni telefono usa un **token GitHub** (la "chiave") per leggere e scrivere `data.json`.
  Il token si inserisce una volta sola sul telefono e **non è scritto nel codice**.
- **Scrittura**: ogni modifica viene inviata a GitHub dopo circa 1 secondo (un commit per gruppo di modifiche).
- **Lettura**: ogni **10 secondi** l'app controlla se ci sono novità (quando l'app è aperta).
- **Offline**: le modifiche restano nel telefono e partono appena torna la rete.

Pallino in basso a sinistra: 🟢 sincronizzato · 🟡 invio in corso · 🟠 offline · 🔴 errore · ⚪ non collegato.
**Toccandolo** si apre la schermata per inserire/cambiare il token o forzare la sincronizzazione.

## Passo 1 - Repository dei dati (privato)

1. Su https://github.com → **New repository** → nome `agenda-dati` → **Private**
   → spunta **Add a README file** → Create.

## Passo 2 - Token (la chiave)

1. GitHub → foto profilo → **Settings** → in fondo **Developer settings** →
   **Personal access tokens → Fine-grained tokens → Generate new token**.
2. Nome `agenda-famiglia`, scadenza **1 anno** (poi andrà rigenerato e reinserito sui telefoni).
3. **Repository access → Only select repositories → `agenda-dati`** (solo quello!).
4. **Permissions → Repository permissions → Contents: Read and write**.
5. **Generate token** e copia il codice `github_pat_...` (si vede una volta sola).
   Conservalo in un posto sicuro per poterlo inserire sui 6 telefoni.

## Passo 3 - Pubblicare l'app

> `index.html` è un file unico e autonomo (come il tuo originale). Per provarlo basta aprirlo, ma per usarlo sui telefoni
> e installarlo come app va pubblicato con GitHub Pages come qui sotto.

1. Apri `github-config.js` e sostituisci `INCOLLA_QUI_il_tuo_nome_utente_GitHub` con il tuo nome utente GitHub.
2. Nuovo repository **pubblico** `agenda-famiglia` → **Add file → Upload files** →
   carica TUTTO il contenuto dello zip (`index.html`, `github-config.js`,
   `sw.js`, `manifest.webmanifest` e la cartella `icons`) → Commit.
3. **Settings → Pages** → Source: *Deploy from a branch* → `main` / `(root)` → Save.
4. Dopo 1-2 minuti l'app è su `https://TUO-NOME.github.io/agenda-famiglia/`.

## Passo 4 - Primo avvio e installazione

1. Sul **primo telefono** apri l'indirizzo: appare la schermata di collegamento → incolla il token → **Collega**.
   Il pallino diventa verde e l'app crea `data.json` con gli appuntamenti iniziali.
2. Installa l'app:
   - **Android (Chrome)**: menu ⋮ → *Installa app*
   - **iPhone (Safari)**: Condividi → *Aggiungi a Home* (deve essere Safari)
3. Sugli altri 5 telefoni: stessa cosa, incollando lo stesso token alla prima apertura.
   Poi ognuno sceglie il proprio profilo e password come prima.

## Aggiornare l'app in futuro

Su GitHub, nel repository `agenda-famiglia`, apri `index.html` → matita → incolla la nuova versione → Commit.
I telefoni la scaricano alla successiva apertura (a volte serve chiudere e riaprire l'app).
I dati non si toccano: stanno nell'altro repository.

## Cose da sapere

- **Aggiornamento ogni 10 secondi solo con l'app aperta e visibile.** A telefono bloccato o app in background
  il sistema sospende i controlli; appena riapri l'app si aggiorna subito.
- **Modifiche contemporanee**: se due persone modificano la *stessa* cosa nello stesso momento vince la più recente.
  Appuntamenti diversi non si disturbano. Attenzione però a **Spesa, Casa e Bollette**: ognuna è un'unica lista,
  quindi se due persone la modificano negli stessi secondi, una delle due modifiche può andare persa.
- **Limiti GitHub**: i controlli senza novità non consumano il limite; l'uso di 6 persone è ampiamente nei limiti.
- **Ogni gruppo di modifiche è un commit** nella cronologia di `agenda-dati`: utile perché puoi anche tornare
  a una versione precedente dei dati da GitHub, se qualcuno cancella per errore.
- **Token perso o scaduto**: crea un token nuovo (Passo 2) e inseriscilo sui telefoni toccando il pallino in basso.
  Se un telefono viene perso, revoca il token su GitHub e creane uno nuovo.

## Privacy

- I **dati** sono in un repository privato: solo chi ha il token può leggerli o scriverli.
- Il **codice dell'app** invece è in un repository pubblico (Pages gratuito lo richiede) e contiene la password
  di Patrizio e le date di nascita usate come password dei familiari: sono leggibili da chiunque trovi il repository.
  Quelle password proteggono solo da un uso casuale tra i familiari, non da un estraneo che abbia il token.
- Non condividere il token fuori dalla famiglia: chi lo possiede può leggere e modificare tutti i dati.
