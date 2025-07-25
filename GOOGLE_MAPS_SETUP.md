# Google Maps Integration Setup

## Required Dependencies

```bash
# Install Google Maps packages
npm install @googlemaps/js-api-loader
npm install -D @types/google.maps

# Alternative: Use React Google Maps library
npm install @react-google-maps/api
```

## Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Google Cloud Console Setup

1. **Enable APIs**:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Maps Static API (optional)

2. **Create API Key**:
   - Go to Google Cloud Console
   - Navigate to APIs & Services > Credentials
   - Create API Key
   - Restrict key to your domains

3. **Set API Restrictions**:
   - HTTP referrers: `localhost:3000/*`, `your-domain.com/*`
   - API restrictions: Enable only required APIs

## Usage in Components

```tsx
import HeritageMap from '@/components/heritage/HeritageMap'

const sites = [
  {
    id: '1',
    name: 'Borobudur Temple',
    latitude: -7.6079,
    longitude: 110.2038,
    // ... other properties
  }
]

<HeritageMap 
  sites={sites}
  onSiteSelect={(site) => console.log('Selected:', site)}
/>
```
