# Personal Knowledge Base AI Assistant

## Opis aplikacije

Personal Knowledge Base AI Assistant je veb aplikacija koja korisnicima omogućava da učitaju svoja tekstualna dokumenta, organizuju ih pomoću tagova, i postavljaju pitanja o njihovom sadržaju kroz chat interfejs omogućen uz pomoć lokalno pokrenutog velikog jezičkog modela.

Aplikacija koristi RAG (Retrieval-Augmented Generation) arhitekturu. Na korisničke upite model odgovara isključivo na osnovu prethodno učitanih dokumenata iz potpuno izolovane i lične baze znanja korisnika. Ovime se izbegava izloženost velikoj količini irelevantnih informacija i obezbeđuje da odgovori budu specijalizovani za korisnikovu ličnu bazu znanja. 

Ciljna grupa aplikacije su pre svega studenti i istraživači koji žele brz i efikasan pristup informacijama iz svojih beleški, bez preterane izloženosti velikom broju nefiltriranih informacija. Takođe, moguć je rad bez oslanjanja na Cloud servise, već uz stoprocentno osigurana privatnost podataka.

### Ključne funkcionalnosti

- Upload, izmena, brisanje i tagovanje dokumenata
- Pretraga i filtriranje dokumenata po nazivu, tagu i tipu fajla
- Chat interfejs za postavljanje pitanja o sadržaju dokumenata
- Prikaz izvornih dokumenata iz kojih je odgovor izvučen
- Čuvanje i ponovno otvaranje prethodnih konverzacija
- Autentifikacija korisnika (registracija, login, JWT sesije)
- Administratorska uloga sa uvidom u korisničke naloge (bez pristupa sadržaju dokumenata)

## Tehnologije

### Frontend
- **React** (Vite) — biblioteka za izgradnju korisničkog interfejsa
- **Tailwind CSS v4** — stilizacija
- **Axios** — komunikacija sa backend API-jem
- **React Router** — rutiranje

### Backend
- **Django** + **Django REST Framework** — REST API
- **Simple JWT** — autentifikacija putem access/refresh tokena
- **LangChain** — orkestracija RAG (Retrieval-Augmented Generation) pipeline-a
- **pypdf** — parsiranje PDF dokumenata

### AI / Baze podataka
- **Ollama** — lokalno pokretanje jezičkog modela (`llama3.2`) i embedding modela (`nomic-embed-text`)
- **Chroma** — vektorska baza podataka za čuvanje embeddinga dokumenata
- **SQLite** — relaciona baza za korisnike, dokumente, tagove i konverzacije

### DevOps
- **Docker** / **docker-compose** — kontejnerizacija aplikacije
- **Git** — verzionisanje koda

## Pokretanje aplikacije lokalno (bez Dockera)

### Preduslovi

- Python 3.13+
- Node.js 20+
- [Ollama](https://ollama.com/download) instalirana i pokrenuta

### 1. Preuzimanje potrebnih LLM modela

```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

### 2. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate       # Windows
source .venv/bin/activate    # macOS/Linux

pip install -r requirements.txt
```

Napravi `.env` fajl u `backend/backend/` sa sledećim promenljivama:

```
DJANGO_SECRET_KEY="tvoj-tajni-kljuc"
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:latest
CORS_ALLOWED_ORIGIN=http://localhost:5173
```

Pokreni migracije i server:

```bash
python manage.py migrate
python manage.py runserver
```

Backend je dostupan na `http://localhost:8000`.

### 3. Frontend

U novom terminalu:

```bash
cd frontend
npm install
```

Napravi `.env` fajl u `frontend/`:

```
VITE_API_URL=http://localhost:8000
```

Pokreni razvojni server **i** Tailwind CSS watch proces (u dva odvojena terminala):

```bash
npm run dev
npm run tailwind
```

Frontend je dostupan na `http://localhost:5173`.

## Pokretanje aplikacije pomoću Dockera i docker-compose-a

### Preduslovi

- Docker Desktop instaliran i pokrenut
- Ollama instalirana i pokrenuta **na host računaru** (Ollama servis namerno nije uključen u `docker-compose.yml` zbog visokih hardverskih zahteva LLM modela)

### 1. Preuzimanje LLM modela (na host računaru, van Dockera)

```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

### 2. Pokretanje svih servisa

Iz root direktorijuma projekta:

```bash
docker-compose up --build
```

Ova komanda pokreće tri kontejnera u zajedničkoj Docker mreži:

| Servis | Opis | Port |
|---|---|---|
| `backend` | Django REST API | `8000` |
| `frontend` | React aplikacija servirana preko nginx-a | `5173` |
| `chroma` | Vektorska baza podataka | `8001` |

Backend kontejner komunicira sa Ollama servisom na host mašini preko `host.docker.internal` adrese, i sa Chroma kontejnerom preko internog Docker mrežnog imena `chroma`.

### 3. Pristup aplikaciji

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8000](http://localhost:8000)

### Gašenje kontejnera

```bash
docker-compose down
```

## Struktura projekta

```
.
├── backend/            # Django REST API
│   ├── api/
│   │   ├── services/    # RAG pipeline, parsiranje, embedding, Chroma integracija
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   └── Dockerfile
├── frontend/            # React aplikacija
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── api.js
│   └── Dockerfile
└── docker-compose.yml
```
