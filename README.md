# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/7b17b3ec-1d07-4648-b328-a4680d13bcc4

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7b17b3ec-1d07-4648-b328-a4680d13bcc4) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7b17b3ec-1d07-4648-b328-a4680d13bcc4) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

# Múnda AI - Intelligence for Farmers

**Tagline:** *Intelligence for Farmers. Clarity for Markets. Confidence for the Future.*

Múnda AI is a climate-smart agriculture platform designed specifically for Kenya's smallholder farmers. The name derives from the Akamba word "shamba" (land), reflecting our deep commitment to empowering farmers by turning their data into economic power.

## Platform Overview

### Core Mission & Three Pillars

1. **Climate Risk Anticipation** - AI-powered predictions for drought, floods, and optimal planting windows
2. **Food Waste Reduction** - Storage optimization, spoilage prediction, and market timing advisory
3. **Agrifinance Access** - Microloans, parametric insurance, and dynamic credit scoring

---

## Modules & Features

### 1. Authentication & User Management

**Location:** `src/contexts/AuthContext.tsx`, `src/pages/Login.tsx`, `src/pages/Signup.tsx`

- Role-based access control (Farmers, Cooperatives, Extension Officers, Admins)
- Email-based authentication with auto-confirm
- User profile management with avatar support
- Session persistence and auto-refresh tokens

**User Roles:**
| Role | Access Level |
|------|--------------|
| Farmer | Personal climate alerts, food waste tracking, loan/insurance applications |
| Cooperative | Aggregated farm-level analytics |
| Extension Officer | Farm risk maps, soil/vegetation overlays, yield-risk analytics |
| Admin | User management, AI model retraining, report generation |

### 2. Farm Registration Module

**Location:** `src/pages/FarmRegistration.tsx`

- Kenya-specific farm serial numbers (format: `KE-NKR-YYYY-XXXX`)
- Support for three farm types: Crop, Livestock, Mixed
- Geolocation capture for farm coordinates
- County and sub-county selection (Kenya administrative units)
- Crop and livestock inventory management

**Database Tables:**
- `farms` - Farm details, location, size, type
- `crops` - Crop types, planting dates, expected harvest
- `livestock` - Animal types, quantities, health records

### 3. Climate Alerts Module

**Location:** `src/pages/ClimateAlerts.tsx`

- Real-time weather warnings (drought, flood, frost)
- 7-day weather forecasts
- AI-generated farming recommendations
- Planting window optimization
- Rainfall and temperature predictions

**Data Sources:**
- CHIRPS (Climate Hazards Group InfraRed Precipitation with Station data)
- ERA5 (ECMWF Reanalysis v5)
- NDVI (Normalized Difference Vegetation Index)

### 4. Food Storage & Waste Reduction Module

**Location:** `src/pages/FoodStorage.tsx`

- Inventory tracking with spoilage prediction
- Storage condition monitoring (temperature, humidity)
- AI-powered spoilage risk assessment
- Market timing recommendations
- Loss prevention alerts

**Key Metrics:**
- Spoilage risk percentage
- Days until optimal sale
- Storage efficiency score
- Waste reduction trends

### 5. Credit Score & Agrifinance Module

**Location:** `src/pages/CreditScore.tsx`, `src/pages/Finance.tsx`

- Dynamic credit scoring algorithm
- Loan application processing
- Parametric insurance automation
- Grant opportunity matching
- Payment history tracking

**Database Tables:**
- `loan_applications` - Loan requests, status, amounts
- `insurance_policies` - Policy details, coverage, premiums
- `profiles` - Financial history, credit factors

**Credit Score Factors:**
| Factor | Weight |
|--------|--------|
| Farm Registration | 15% |
| Land Size | 10% |
| Crop Diversity | 15% |
| Payment History | 25% |
| Loan History | 20% |
| Insurance History | 15% |

### 6. Market Intelligence Module

**Location:** `src/pages/Market.tsx`, `src/components/market/MarketMap.tsx`

- Interactive market map (Leaflet + OpenStreetMap)
- Real-time commodity prices
- Price trend analysis
- Market location discovery
- Yield-based sales recommendations

**Features:**
- Geolocation-based market discovery
- Price comparison across regions
- Best selling time recommendations
- Transportation cost estimates

### 7. Voice Bot & AI Advisory

**Location:** `src/components/VoiceBot.tsx`, `src/utils/RealtimeAudio.ts`

- OpenAI Realtime API integration
- Multilingual voice support (English, Swahili)
- Real-time agricultural advisory
- Voice-based climate alerts
- Low-literacy user accessibility

**Edge Function:** `supabase/functions/realtime-session/`

### 8. Dashboard & Analytics

**Location:** `src/pages/Dashboard.tsx`

- Farm overview statistics
- Weather summary widgets
- Quick action cards
- Recent activity feed
- Performance metrics

---

## Data Architecture

### Database Schema (Supabase/PostgreSQL)

```
┌─────────────────┐     ┌─────────────────┐
│     profiles    │     │      farms      │
├─────────────────┤     ├─────────────────┤
│ id (UUID)       │────▶│ id (UUID)       │
│ user_id (UUID)  │     │ user_id (UUID)  │
│ full_name       │     │ name            │
│ avatar_url      │     │ county          │
│ phone           │     │ sub_county      │
│ county          │     │ size_acres      │
│ created_at      │     │ farm_type       │
└─────────────────┘     │ latitude        │
                        │ longitude       │
                        │ serial_number   │
                        └─────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      crops      │     │    livestock    │     │ loan_applications│
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (UUID)       │     │ id (UUID)       │     │ id (UUID)       │
│ farm_id (UUID)  │     │ farm_id (UUID)  │     │ user_id (UUID)  │
│ name            │     │ type            │     │ amount          │
│ variety         │     │ breed           │     │ purpose         │
│ planting_date   │     │ quantity        │     │ status          │
│ expected_harvest│     │ health_status   │     │ created_at      │
│ area_acres      │     │ created_at      │     └─────────────────┘
└─────────────────┘     └─────────────────┘
                                                ┌─────────────────┐
                                                │insurance_policies│
                                                ├─────────────────┤
                                                │ id (UUID)       │
                                                │ user_id (UUID)  │
                                                │ policy_type     │
                                                │ coverage_amount │
                                                │ premium         │
                                                │ status          │
                                                └─────────────────┘
```

### Row Level Security (RLS)

All tables implement RLS policies ensuring:
- Users can only access their own data
- Authenticated users required for all operations
- Admin override capabilities where applicable

---

## External Integrations

### Required API Keys & Secrets

| Secret | Service | Purpose |
|--------|---------|---------|
| `OPENAI_API_KEY` | OpenAI | Voice bot, AI recommendations |
| `TWILIO_ACCOUNT_SID` | Twilio | SMS notifications |
| `TWILIO_AUTH_TOKEN` | Twilio | SMS authentication |
| `TWILIO_PHONE_NUMBER` | Twilio | Outbound SMS sender |

### Geospatial Data Sources

- **NDVI** - Vegetation health monitoring
- **CHIRPS** - Rainfall estimation
- **ERA5** - Weather reanalysis data
- **OpenStreetMap** - Base mapping tiles

---

## Project Structure

```
src/
├── assets/              # Static images and assets
├── components/
│   ├── landing/         # Landing page sections
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── CTASection.tsx
│   ├── layout/          # Layout components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── market/          # Market-specific components
│   │   └── MarketMap.tsx
│   ├── ui/              # shadcn/ui components
│   ├── FloatingVoiceButton.tsx
│   ├── NavLink.tsx
│   └── VoiceBot.tsx
├── contexts/
│   └── AuthContext.tsx  # Authentication state
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── integrations/
│   └── supabase/
│       ├── client.ts    # Supabase client
│       └── types.ts     # Database types
├── pages/
│   ├── Index.tsx        # Landing page
│   ├── Login.tsx        # Authentication
│   ├── Signup.tsx       # Registration
│   ├── Dashboard.tsx    # User dashboard
│   ├── FarmRegistration.tsx
│   ├── ClimateAlerts.tsx
│   ├── FoodStorage.tsx
│   ├── CreditScore.tsx
│   ├── Finance.tsx
│   ├── Market.tsx
│   └── NotFound.tsx
├── utils/
│   └── RealtimeAudio.ts # Voice bot utilities
├── App.tsx              # Route configuration
├── main.tsx             # App entry point
└── index.css            # Global styles & design tokens

supabase/
├── config.toml          # Supabase configuration
├── functions/
│   └── realtime-session/
│       └── index.ts     # Voice bot edge function
└── migrations/          # Database migrations
```

---

## Ethical Principles

Múnda AI is built on strong ethical foundations:

1. **Ethical Data Sourcing** - Open datasets wherever possible, clear consent for farmer data
2. **Equity-First Design** - No community excluded, accessible to low-literacy users
3. **Explainable AI** - Simple, human-readable insights
4. **Bias Prevention** - Fair outcomes across regions and demographic groups
5. **Data Sovereignty** - Farmers own their data

---

## Kenya-Specific Localization

- Farm serial numbers follow Kenya Bureau of Statistics standards
- County and sub-county administrative boundaries
- Local crop varieties and farming calendars
- Swahili language support in voice bot
- Kenya market locations and pricing data

---

## Future Roadmap

- [ ] Satellite imagery integration for crop health monitoring
- [ ] WhatsApp bot for notifications
- [ ] Cooperative analytics dashboard
- [ ] Extension officer mobile app
- [ ] Offline-first PWA capabilities
- [ ] Integration with M-Pesa for loan disbursement

---

## Support

For questions or issues, please visit the [Lovable Discord community](https://discord.com/channels/1119885301872070706/1280461670979993613) or refer to the [Lovable documentation](https://docs.lovable.dev/).
