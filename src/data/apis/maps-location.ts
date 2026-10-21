import { ApiEntry } from '../../types/api';

export const mapsLocationApis: ApiEntry[] = [
  {
    id: 'google-maps',
    name: 'Google Maps Platform APIs',
    description: 'Comprehensive global geospatial platform comprising Geocoding, Places API (New), Directions, Distance Matrix, Maps JavaScript API, and Street View.',
    shortDescription: 'The global standard for Places, Geocoding, Directions, and interactive Maps.',
    category: 'maps-location',
    tags: ['maps-location', 'maps', 'places', 'geocoding', 'directions', 'navigation', 'google'],
    website: 'https://mapsplatform.google.com',
    docsUrl: 'https://developers.google.com/maps/documentation',
    apiReferenceUrl: 'https://developers.google.com/maps/documentation/places/web-service/op-overview',
    baseUrl: 'https://maps.googleapis.com/maps/api',
    authMethod: 'api-key',
    authSetupGuide: 'Enable APIs in Google Cloud Console, create restricted API key, and pass as ?key=<API_KEY> query parameter.',
    pricing: 'pay-as-you-go',
    pricingDetails: '$200 monthly free credit across Maps, Routes, and Places products.',
    sdks: [
      { language: 'Node.js', package: '@googlemaps/google-maps-services-js', installCommand: 'npm install @googlemaps/google-maps-services-js' },
      { language: 'React', package: '@vis.gl/react-google-maps', installCommand: 'npm install @vis.gl/react-google-maps' }
    ],
    quickstart: `import { Client } from '@googlemaps/google-maps-services-js';
const client = new Client({});

const response = await client.geocode({
  params: {
    address: '1600 Amphitheatre Parkway, Mountain View, CA',
    key: process.env.GOOGLE_MAPS_API_KEY!,
  },
});
console.log(response.data.results[0].geometry.location);`,
    endpoints: [
      {
        method: 'GET',
        path: '/geocode/json',
        summary: 'Geocode Address',
        description: 'Converts addresses to geographic coordinates (latitude and longitude) and vice versa.'
      },
      {
        method: 'POST',
        path: '/place/textSearch/json',
        summary: 'Places Text Search',
        description: 'Finds business listings, establishments, and points of interest matching search query.'
      },
      {
        method: 'GET',
        path: '/directions/json',
        summary: 'Directions Service',
        description: 'Calculates driving, transit, bicycling, or walking navigation routes.'
      }
    ],
    useCases: ['Property address autocomplete in checkout or real estate forms', 'Store locator maps', 'Delivery route calculation'],
    alternatives: ['mapbox', 'radar', 'tomtom'],
    lastUpdated: '2026-02-28'
  },
  {
    id: 'mapbox',
    name: 'Mapbox Web Services API',
    description: 'Custom vector tile maps, 3D terrain rendering, Mapbox GL JS, turn-by-turn navigation SDKs, geocoding, and custom visual map style design with Mapbox Studio.',
    shortDescription: 'Custom styled vector maps, 3D terrain, navigation, and geocoding.',
    category: 'maps-location',
    tags: ['maps-location', 'mapbox', 'vector-tiles', 'gl-js', 'geocoding', 'studio', 'custom-styling'],
    website: 'https://www.mapbox.com',
    docsUrl: 'https://docs.mapbox.com',
    apiReferenceUrl: 'https://docs.mapbox.com/api/search/geocoding/',
    baseUrl: 'https://api.mapbox.com',
    authMethod: 'api-key',
    authSetupGuide: 'Create public and secret tokens in Mapbox account. Pass as ?access_token=pk.xxx.',
    pricing: 'freemium',
    pricingDetails: 'Generous free tier: 50,000 web map loads/month, 100,000 geocoding requests/month.',
    sdks: [
      { language: 'Web GL', package: 'mapbox-gl', installCommand: 'npm install mapbox-gl' },
      { language: 'Geocoding SDK', package: '@mapbox/mapbox-sdk', installCommand: 'npm install @mapbox/mapbox-sdk' }
    ],
    quickstart: `import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_ACCESS_TOKEN! });

const response = await geocodingClient.forwardGeocode({
  query: 'Paris, France',
  limit: 2,
}).send();
console.log(response.body.features[0].center);`,
    endpoints: [
      {
        method: 'GET',
        path: '/geocoding/v5/mapbox.places/{query}.json',
        summary: 'Forward Geocoding',
        description: 'Searches coordinates for text query.'
      },
      {
        method: 'GET',
        path: '/styles/v1/{username}/{style_id}',
        summary: 'Get Style',
        description: 'Retrieves Mapbox Studio visual style specification.'
      }
    ],
    useCases: ['Dark mode luxury real estate map styling', 'Interactive data visualization heatmaps', 'Mobile turn-by-turn navigation'],
    alternatives: ['google-maps', 'here-maps'],
    lastUpdated: '2026-02-12'
  }
];
