

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


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
=======
Below is a polished, detailed, creative README for **Múnda AI**. Clear, human, and built to stand out.

---

# Múnda AI

Intelligence for Farmers. Clarity for Markets. Confidence for the Future.

Múnda comes from the Akamba word *shamba*, meaning land. The land is the farmer’s foundation, and Múnda AI is built to protect it, understand it, and turn its data into real economic power.

This platform brings climate intelligence, market forecasting, and inclusive finance into one practical tool that any smallholder farmer can use.

---

## What Múnda AI Does

Múnda AI starts on the farm. Each farmer receives a **Climate Smart Agric Kit** that captures real-time soil conditions, weather signals, and environmental stress. The system then builds a complete, verifiable risk profile of the farm.

With that foundation, Múnda AI moves into prediction. The platform analyzes climate patterns, market trends, and yield history to forecast prices and sales paths for specific crops in specific counties. A tomato farmer in Nakuru can predict market behavior before harvest and choose the best buyer.

At the same time, the system builds a **dynamic credit score**. It uses climate resilience, projected yield, and farm efficiency to unlock fair and fast agrifinance from partner institutions.

The entire experience is accessible through local-language chatbots, USSD, and a map-based web interface designed for low bandwidth regions.

---

## Key Features

### Climate Smart Agric Kit

Compact and easy to install, this kit streams:

* Soil moisture and temperature
* Real-time rainfall trends
* Drought and flood indicators
* Weather anomalies

The kit turns daily farm activity into structured intelligence.
The models learn over time, improving their accuracy as conditions shift.

### Parametric Insurance Automation

Múnda AI supports insurance partners with clean, explainable triggers.

* When rainfall or vegetation indices cross risk thresholds, payouts initiate automatically.
* No waiting for field inspections.
* No manual assessments.
  The system minimizes basis risk and speeds up recovery for farmers.

### Market and Yield Intelligence

Farmers often produce blindly, hoping the market works out. Múnda AI changes that.
It predicts:

* Future crop prices in specific counties
* Buyer demand and oversupply pockets
* Seasonal trends across horticulture and staple crops
* Expected yields based on acreage, vegetation, and climate conditions

Insights arrive through SMS, WhatsApp, USSD, or voice for easy access.


### Dynamic Credit Scoring

As the system learns the farmer’s climate resilience and predicted yield, it builds a live credit score.
This score:

* Speeds up loan approvals
* Allows partners to tailor products
* Reduces paperwork and delays
* Creates a financial identity for farmers with no prior records

### Access for All

* **Voice bots** in local dialects through Rag models
* **USSD** for low-network areas
* **Web UI** with geographic mapping of markets, roads, soil patterns, and finance institutions

---

## Who Múnda AI Serves

### Smallholder Farmers

Rain-fed farmers growing maize, beans, potatoes, vegetables, and horticultural crops in counties such as Nakuru, Nyandarua, Narok, and Kajiado.

### Cooperatives and Producer Groups

They use risk maps and yield forecasts to negotiate better insurance and coordinate collective sales.

### Extension Officers

They combine field insights with satellite overlays to give accurate, location-specific advice.

### Financial and Insurance Partners

They use real-time credit scoring and automated triggers to derisk portfolios.

---

## Why This Matters

Farmers face unpredictable rainfall, extreme droughts, sudden floods, and unstable markets. Most still make decisions without early warnings or price forecasts. As a result, poor timing, low farm-gate prices, and post-harvest losses keep incomes down year after year.

Múnda AI changes this pattern by giving farmers the same level of intelligence used by large agribusinesses.
The platform transforms risk into clarity, data into planning, and planning into higher income.

---

## Ethical and Fair by Design

Múnda AI follows clear principles:

* **Ethical data sourcing** with open datasets wherever possible
* **Clear consent** for farmer data
* **Equity-first design** so no community is excluded
* **Explainable models** with simple, human-readable insights
* **Bias checks** to ensure fair outcomes across regions and groups

---

## AI and Geospatial Foundation

The system uses:

* Satellite imagery (NDVI, NDWI, soil moisture)
* Weather datasets (CHIRPS, ERA5, radar feeds)
* On-farm sensors
* Historical market prices
* LSTM and regression models for prediction
* Rag-based chatbots for local-language conversation

All outputs are simplified for farmers while remaining detailed enough for cooperatives, insurers, and financial partners.

---

## Vision

A continent where a farmer can predict tomorrow, protect their harvest, negotiate better prices, and access fair finance without leaving their shamba.

Múnda AI turns intelligence into impact and puts that power directly in the farmer’s hands.

---

If you want, I can also create a shorter README, a GitHub-optimized version with badges and sections, or a full documentation structure.
>>>>>>> 2a59f69663bf8dbf6ed40269d5acf18b3f55b305
