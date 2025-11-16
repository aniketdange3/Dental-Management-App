<img width="720" height="2781" alt="screencapture-localhost-5173-2025-11-16-09_59_29" src="https://github.com/user-attachments/assets/d92d46d4-a97f-4efc-b88d-dadd63d61652" /># Dental Clinic Dashboard

**A clean, modern dashboard for managing a dental clinic — patients, appointments, expenses, and reports.**

---

## Project Overview

This repository contains a React-based admin dashboard designed to help small dental clinics track patients, appointments, expenses, and generate visual reports & exports (PDF/Word). The UI is responsive, uses Tailwind CSS for styling, Recharts for charts, Framer Motion for subtle animations, and integrates with a simple REST API (example endpoints used: `/api/patients`, `/api/expenses`).

## Key Features

* Patient management (list, add, edit)
* Appointment scheduling and tracking
* Expense management with categories (Staff, Rent, Equipment, Supplies, Utilities, Supplements, Other)
* Reports & Analytics page with:

  * Monthly overview (patients vs expenses)
  * Expense distribution (pie chart)
  * Top categories and breakdown table
  * Export PDF / Word report
* Search + time-range filters
* Clean, mobile-friendly dashboard layout

## Tech Stack

* React (Vite / Create React App compatible)
* Tailwind CSS
* Recharts (charts)
* Framer Motion (animations)
* Axios (HTTP client)
* jsPDF + html2canvas (PDF export)

## Screenshots

> The project screenshots are included in the workspace. If you opened this README inside the project container, the images will render inline below.

### Overview / Dashboard

![Overview Screenshot]
<img width="720" height="1080" alt="screencapture-localhost-5173-2025-11-16-09_59_29" src="https://github.com/user-attachments/assets/d92d46d4-a97f-4efc-b88d-dadd63d61652" />

### Reports & Analytics

![Reports Screenshot](/mnt/data/screencapture-localhost-5173-reports-2025-11-16-09_51_55.png)

## Getting Started (Local)

Follow these steps to run the dashboard locally.

1. **Clone repository**

```bash
git clone <your-repo-url>
cd your-repo-folder
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Start development server**

```bash
npm run dev
# or
npm start
```

The app will open at `http://localhost:5173` (or another port if configured).

## API / Sample Data

This project expects two JSON endpoints by default:

* `GET /api/patients` → returns patients array
* `GET /api/expenses` → returns expenses array

You can use the sample JSON files included (generated during development):

* `/mnt/data/patients_50.json` — 50 sample patients
* `/mnt/data/expenses_for_patients_50.json` — 50 expenses tied to patients
* `/mnt/data/salaries_and_expenses_2022-2025.json` — recurring salaries & rent + randomized expenses (2022–2025)

To quickly serve these locally, use a simple static server or JSON server. Example using `json-server`:

```bash
npm install -g json-server
json-server --watch /path/to/samples/db.json --port 5000
```

Where `db.json` could look like:

```json
{
  "patients": [ /* paste patients_50.json content */ ],
  "expenses": [ /* paste expenses_for_patients_50.json content */ ]
}
```

## Importing Sample Data into MySQL (optional)

If you prefer a relational database, use the provided SQL file:

* `/mnt/data/patients_50_insert.sql`

Open your MySQL client and run:

```sql
SOURCE /path/to/patients_50_insert.sql;
```

Then adapt the `expenses` inserts similarly or import the `expenses_for_patients_50.json` via a server-side script.

## PDF / Word Export

The dashboard uses `html2canvas` + `jsPDF` for client-side PDF exports. Word export is scaffolded (button available) — for full Word (.docx) export use a library like `docx` or implement server-side rendering.

## Notes & Tips

* Date parsing: the sample JSON uses `dd-mm-yyyy hh:mm AM/PM` for expenses and ISO `YYYY-MM-DD` for patient DOB/registered/appointment fields. Adjust parsing logic as needed in your API/server.
* Category normalization: the client contains helper functions to normalize and infer categories (e.g., treat `Salary` as `Staff`, `Electric Bill` as `Utilities`).
* Sunday rule: sample recurring salary/rent data avoids Sunday dates (moved forward to next non-Sunday).

## Next Steps / Improvements

* Add authentication (JWT) and role-based access (admin, receptionist)
* Add CRUD UI for expenses & bulk import (CSV upload)
* Server-side Word/PDF generation for higher fidelity exports
* Tests (unit + integration) and CI pipeline

## License

MIT — feel free to reuse and adapt.

---

If you want, I can:

* commit this README to your repo (provide git remote URL),
* produce a downloadable `README.md` file, or
* regenerate screenshots (mock a different theme) and embed them. Which would you like next?
