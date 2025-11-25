# WordGym

WordGym je interaktivna spletna igra, ki pomaga osnovnošolcem vaditi črkovanje angleških besed skozi igrive runde, glasovno izgovorjavo in zbiranje značk. Aplikacija je zgrajena v Reactu s TypeScriptom in vsebina v celoti uporablja slovenske napise.

## Ključne funkcionalnosti
- **Dva načina igre** – *Poslušaj in črkuj* uporablja Web Speech API za izgovarjavo besed, *Izberi pravilno* pa ponuja tri možne zapise.
- **Točke in napredek** – vsaka runda vsebuje 10 naključnih besed različnih težavnosti, pa tudi serije, popolne runde in skupne točke, ki se shranjujejo v `localStorage`.
- **Značke in nagrade** – datoteka `src/data/badges.ts` definira pogoje (npr. popolna runda, 7 dni zapored); nove značke sprožijo posebne animacije in zvoke.
- **Prijazen zvok in govor** – `useSpeech` in `useSound` skrbita za Web Speech in Web Audio, z možnostjo izklopa zvoka in odpornimi mehanizmi, ko brskalnik API-jev ne podpira.
- **Dostopnost in i18n** – skip-linki, sr-only napotki, velike ciljne površine ter centralizirana sporočila v `src/data/messages.ts`.

## Tehnološki sklad
- React 19 + TypeScript
- Vite 7 kot razvojni strežnik in gradnik
- Tailwind CSS za oblikovanje komponent
- Vitest + Testing Library + jsdom za testiranje hookov in logike
- ESLint 9 (typescript-eslint, React Hooks) za kakovost kode

## Predpogoji
- Node.js 20 ali novejši (priporočeno)
- npm 10 (nameščen z Node)

## Namestitev in zagon
```bash
npm install        # namesti odvisnosti
npm run dev        # razvojni strežnik na http://localhost:5173
```
Vite omogoča HMR, zato spremembe v `src/` osvežijo zaslon brez ročnega ponovnega nalaganja.

## Scripts
- `npm run dev` – zažene razvojni strežnik z HMR.
- `npm run build` – zaporedno poganja `tsc -b` za preverjanje tipov in `vite build` za optimiziran paket v `dist/`.
- `npm run preview` – služi statični build za končni pregled.
- `npm run lint` – preveri celoten projekt z ESLint konfiguracijo.
- `npm run test` – poganja Vitest v načinu CI (brez watcherja).
- `npm run test:watch` – Vitest v interaktivnem načinu z `--watch`.

## Testiranje
Vitest je nastavljen za okolje jsdom, zato lahko preizkuša logiko hookov (`src/hooks/*.test.ts`). Poleg osnovnih asercij Testing Library zagotavlja helperje za interakcije z DOM. Priporočena zaporedja:
```bash
npm run test          # enkratno preverjanje (CI)
npm run test:watch    # lokalni razvoj testov
```

## Struktura projekta
```
learn/
├─ public/                # statične datoteke in ikone
├─ src/
│  ├─ components/         # UI gradniki (screens, ui)
│  ├─ data/               # besedni seznam, značke, sporočila
│  ├─ hooks/              # useGameState, useProgress, useSpeech, useSound
│  ├─ types/              # tipovne definicije igre
│  ├─ utils/              # točkovanje, shranjevanje, izbiranje besed
│  ├─ App.tsx             # usmerjevalnik zaslonov
│  └─ main.tsx            # React vstopna točka
├─ index.html             # korenski dokument Vite
├─ tailwind.config.js     # tema in barvna paleta
├─ vite.config.ts         # konfiguracija razvojnega strežnika
└─ package.json
```

## Prilagajanje vsebine
- **Besede** – dodajte ali posodobite zapise v `src/data/words.ts` (id, prevod, težavnost, napačni zapisi). `useGameState` vedno izbere 10 naključnih besed na rundo.
- **Sporočila** – vsi teksti so v `src/data/messages.ts`; spremembe se samodejno odrazijo na zaslonih.
- **Značke** – pogoje je mogoče razširiti v `src/data/badges.ts`. Vsaka značka vsebuje ID, ime, opis, ikono in funkcijo `condition`.

## Shramba in dovoljenja brskalnika
Napredek se zapisuje v `localStorage`. Če brskalnik ne dovoli dostopa (npr. zasebno brskanje), se aplikacija obnaša degradirano in na začetnem zaslonu prikaže opozorilo. Web Speech in Web Audio API-ji so uporabljeni progresivno – če niso na voljo, se gumbi in napotki prilagodijo.

## Gradnja in objava
1. `npm run build` ustvari optimiziran `dist/` katalog.
2. `npm run preview` lokalno preveri produkcijski paket.
3. Vsebino `dist/` lahko nato objavite na poljubnem statičnem gostovanju (GitHub Pages, Netlify ...). Repo že vsebuje `CNAME`, zato pri GitHub Pages pustite obstoječo datoteko.

## Koristni namigi
- Ker igra uporablja zvok, brskalniki pogosto zahtevajo prvi klik, preden lahko Web Audio predvaja ton. `useSound` to obravnava, vendar vseeno svetujte uporabnikom interakcijo.
- V inkognito načinu ali na starejših napravah brez Web Speech API bo način *Poslušaj in črkuj* prikazal opozorilo, zato načrtujte ročni vnos besed.

Veselo črkovanje! 💪
