# OP-Katalog Logger

A web application for tracking surgical operations according to the **SIWF (Swiss Institute for Medical Education) Orthopedic Surgery and Traumatology** training requirements.

## Features

- **Complete SIWF Catalog**: All procedures from the 2022 training program
- **Multi-Category Classification**: One operation can count as multiple procedures
- **Anatomical Region Tracking**: Track operations by body region
- **Role Differentiation**: Log operations as Operateur or Assistent
- **Progress Dashboard**: Visual progress toward the 650 required operations
- **Multiple Export Formats**:
  - **Pro CSV**: For statistical analysis (Python, Excel)
  - **JSON Backup**: Full data backup/restore
  - **eLog Format**: Formatted for SIWF eLogbook copy-paste
  - **Sunburst Summary**: Counts for department tracking

## Requirements

According to SIWF Weiterbildungsprogramm 2022:
- **450 operations as Operateur**
- **200 operations as Assistent**
- **650 total operations**

Distributed across:
| Category | Min (Op) | Max (Op) | Assistent |
|----------|----------|----------|-----------|
| Prothetik | 30 | 90 | 30 |
| Osteotomien/Arthrodesen | 15 | 50 | 15 |
| Rekonstruktive Eingriffe | 70 | 140 | 70 |
| Osteosynthesen | 65 | 240 | 65 |
| Diverses | 15 | 260 | 20 |

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- localStorage persistence

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Deployment

Configured for Render.com static site deployment via `render.yaml`.

## Data Storage

All data is stored locally in your browser's localStorage. Use the JSON backup feature to export and restore your data.

## Author

Samuel Friedrich Schaible

## License

Private - For personal use in SIWF orthopedic surgery training documentation.
