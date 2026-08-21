# Alive Connect – MVP prototyp

Klikací prototyp postavený z Figma souboru "B2B ordering" (sekce MVP), ověřený proti skutečnému
klikacímu prototypu ve Figmě – navigace a propojení obrazovek odpovídá tomu, co je opravdu
proklikatelné ve Figma prototypu, ne jen odhadu podle názvů.

## Spuštění

```bash
npm install
npm run dev
```

Otevři http://localhost:5173 – automaticky tě to přesměruje na přihlašovací obrazovku.
Přihlášení nekontroluje heslo (jde o prototyp), stačí kliknout "Přihlásit se".

## Co je hotové

- Přihlášení
- **Přípravna dat** – prázdný stav i naplněný seznam osob s tabulkou (Jméno, Narozen, Třída,
  Ročník, Průkaz, Status, Platba, Smaže se za), filtry a akce Formuláře / Sběr podkladů / Objednat
  průkazy, přesně podle skutečné obrazovky v prototypu
- **Import dat** – volba metody (Bakaláři / ruční nahrání), nahrání souborů (simulované), kontrola
  dat, výsledek kontroly
- **Sběr podkladů k průkazům** – přehled probíhajících/ukončených kampaní, vytvoření nové kampaně
  (3kroková wizard: Nastavení → Obsah zprávy → Shrnutí a odeslání), navázané na tlačítko "Sběr
  podkladů" z Přípravny dat
- **Objednávka průkazů** – 3kroková wizard (Výběr produktu → Kontrola dat → Shrnutí), navázaná na
  tlačítko "Objednat průkazy" z Přípravny dat, po odeslání přistane na obrazovce Objednávky se
  stejným potvrzujícím oznámením jako v prototypu
- **Objednávky** – přehled odeslaných objednávek (tabulka Jméno objednávky / ID / Typ produktu /
  Stav / Vytvořeno / Objednáno)
- Modální okna "Jak to funguje?" / "Zjistit, jak to funguje" / "Jak sbírat podklady" – místo
  neaktivních odkazů skutečně otevírají overlay s náhledem videa, tak jako v prototypu
- Sdílený sidebar + top nav podle designu, se zpřístupněnou položkou Objednávky

## Co v prototypu (zatím) není

Ve Figma souboru je celkem 14 samostatných prototype flows. Tento prototyp pokrývá **Import osob**,
**kampaň (sběr podkladů)** a **objednávku z přípravny dat** – tedy přesně to propojení, které chybělo
v předchozí verzi. Zatím nejsou rozpracované: objednávka bez přípravny dat (varianta s výběrem osob),
duplikát průkazu a prodloužení platnosti jako samostatné wizardy. Dej vědět, který z nich je pro další
kolo user testingu nejdůležitější.

## Nasazení na live doménu

Aplikace je čistě klientská (žádný backend) a používá hash routing (`#/pripravna` apod.), takže jde
nasadit na jakýkoli static hosting bez speciální konfigurace přesměrování.

### Varianta A – GitHub Pages (automaticky přes GitHub Actions)

V repozitáři je připravený workflow `.github/workflows/deploy.yml`, který při každém pushi do větve
`main` appku sestaví a nasadí.

1. Založ nový repozitář na GitHub a nahraj do něj obsah této složky:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<tvuj-ucet>/<nazev-repa>.git
   git push -u origin main
   ```
2. V repozitáři na GitHubu jdi do **Settings → Pages** a u "Build and deployment" nastav **Source:
   GitHub Actions** (stačí jednou).
3. Po pushi se automaticky spustí akce "Deploy to GitHub Pages" (vidíš ji v záložce **Actions**). Po
   dokončení najdeš živou URL buď přímo v Settings → Pages, nebo v souhrnu doběhlé akce.
   Adresa bude typicky `https://<tvuj-ucet>.github.io/<nazev-repa>/`.
4. Každý další `git push` do `main` appku znovu nasadí – není potřeba nic ručně spouštět.

### Varianta B – Netlify / Vercel (propojení s GitHub repem)

Pokud chceš raději rychlejší preview odkazy pro každou branch/PR, nebo se ti nechce řešit GitHub
Actions:

1. Nahraj kód do GitHub repozitáře (kroky 1 výše).
2. Na [netlify.com](https://app.netlify.com) nebo [vercel.com](https://vercel.com/new) zvol "Import
   from GitHub" a vyber repozitář.
3. Obě služby automaticky rozpoznají Vite projekt – build command `npm run build`, output adresář
   `dist`. Stačí potvrdit a nasadit.
4. Dostaneš stabilní URL (a u obou služeb i automatický deploy při každém pushi).

Obě varianty fungují se stejným kódem beze změn – díky `base: './'` v `vite.config.ts` a hash
routingu appka nepotřebuje vědět, na jaké podcestě běží.
