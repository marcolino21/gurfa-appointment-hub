# Gurfa Appointment Hub

Sistema di gestione appuntamenti con calendario personalizzato e integrazione Supabase.

## Configurazione

1. Clona il repository:
```bash
git clone https://github.com/marcolino21/gurfa-appointment-hub.git
cd gurfa-appointment-hub
```

2. Installa le dipendenze:
```bash
npm install --legacy-peer-deps
```

3. Crea un file `.env` nella root del progetto con le seguenti variabili:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Configura il database Supabase:
- Vai al tuo progetto Supabase
- Apri l'editor SQL
- Copia e incolla il contenuto del file `supabase/migrations/20240505_init.sql`
- Esegui le query

5. Avvia il server di sviluppo:
```bash
npm run dev
```

## Struttura del Progetto

- `src/features/calendar/`: Componenti del calendario
  - `components/`: Componenti React
    - `CalendarView.tsx`: Vista principale del calendario
    - `AppointmentModal.tsx`: Modal per la creazione/modifica degli appuntamenti
    - `DraggableEvent.tsx`: Componente per gli eventi trascinabili
- `src/lib/`: Utility e configurazioni
  - `supabase.ts`: Configurazione client Supabase
- `src/types/`: Definizioni TypeScript
  - `calendar.ts`: Tipi per il calendario e gli appuntamenti

## Funzionalità

- Vista calendario giornaliera, settimanale e mensile
- Drag & drop degli appuntamenti
- Creazione e modifica appuntamenti
- Integrazione real-time con Supabase
- Gestione staff e servizi
- Sistema di ruoli e permessi
- Notifiche in tempo reale

## Sviluppo

Per contribuire al progetto:

1. Crea un nuovo branch:
```bash
git checkout -b feature/nome-feature
```

2. Fai le tue modifiche e committa:
```bash
git add .
git commit -m "feat: descrizione delle modifiche"
```

3. Pusha le modifiche:
```bash
git push origin feature/nome-feature
```

4. Apri una Pull Request su GitHub
