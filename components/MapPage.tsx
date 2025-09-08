import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { UserProfile, PlaceResult } from '../types';
import { Header } from './Header';
import { Footer } from './Footer';
import { MapPinIcon } from './icons/MapPinIcon';
import { StarIcon } from './icons/StarIcon';
import { LinkIcon } from './icons/LinkIcon';
import { LogoIcon } from './icons/LogoIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

declare global {
  interface Window {
    google?: any;
    initMap?: () => void;
  }
}

interface MapPageProps {
  initialQuery: string;
  apiKey: string;
  onSearch: (query: string) => void;
  onHome: () => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve();
      return;
    }
    const scriptId = 'google-maps-script';
    if (document.getElementById(scriptId)) {
      // If script is already in the DOM, just wait for it to load
      const checkInterval = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,core,marker&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error('Failed to load Google Maps script.'));
    
    window.initMap = () => {
      resolve();
      delete window.initMap;
    };

    document.head.appendChild(script);
  });
};


export const MapPage: React.FC<MapPageProps> = ({ initialQuery, apiKey, onSearch, onHome, ...headerProps }) => {
  const [query, setQuery] = useState(initialQuery);
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);

  useEffect(() => {
    loadGoogleMapsScript(apiKey)
      .then(() => setScriptLoaded(true))
      .catch(err => {
        console.error(err);
        setError('Could not load Google Maps. Please check your API key and network connection.');
        setIsLoading(false);
      });
  }, [apiKey]);

  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim() || !mapInstanceRef.current) return;
    
    setIsLoading(true);
    setError(null);
    setPlaces([]);
    setActivePlaceId(null);
    
    const placesService = new window.google.maps.places.PlacesService(mapInstanceRef.current);
    const request = {
      query: searchQuery,
      fields: ['place_id', 'name', 'formatted_address', 'geometry', 'rating', 'user_ratings_total', 'photos', 'website', 'price_level'],
    };

    placesService.textSearch(request, (results: PlaceResult[], status: string) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        setPlaces(results);
      } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        setPlaces([]);
      } else {
        setError(`Map search failed: ${status}`);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (scriptLoaded && mapRef.current && !mapInstanceRef.current) {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 34.0522, lng: -118.2437 }, // Default to LA
        zoom: 8,
        mapId: 'SILO_SEARCH_MAP'
      });
    }

    if (scriptLoaded && mapInstanceRef.current && initialQuery) {
      performSearch(initialQuery);
    }
  }, [scriptLoaded, initialQuery, performSearch]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear old markers
    markersRef.current.forEach(marker => marker.map = null);
    markersRef.current = [];

    if (places.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    places.forEach(place => {
      if (place.geometry?.location) {
        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          position: place.geometry.location,
          map: mapInstanceRef.current,
          title: place.name,
        });

        marker.addListener('click', () => {
          setActivePlaceId(place.place_id);
          const resultEl = document.getElementById(`place-${place.place_id}`);
          resultEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        
        markersRef.current.push(marker);
        bounds.extend(place.geometry.location);
      }
    });

    if (places.length > 1) {
      mapInstanceRef.current.fitBounds(bounds);
    } else if (places.length === 1 && places[0].geometry?.location) {
      mapInstanceRef.current.setCenter(places[0].geometry.location);
      mapInstanceRef.current.setZoom(14);
    }

  }, [places]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  const renderStars = (rating?: number) => {
      if (!rating) return <span className="text-sm text-gray-500">No rating</span>;
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 >= 0.5;
      const stars = [];
      for (let i = 0; i < fullStars; i++) stars.push(<StarIcon key={`full-${i}`} className="w-4 h-4 text-yellow-400" />);
      // Note: half star implementation omitted for simplicity
      return <div className="flex items-center">{stars} <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span></div>;
  };
  
  const renderPriceLevel = (level?: number) => {
    if (!level) return null;
    return <span className="text-gray-700">{'$'.repeat(level)}</span>;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header {...headerProps} onHome={onHome} showHomeButton={true} />
      <main className="flex-grow flex flex-col lg:flex-row">
        {/* Results Panel */}
        <div className="w-full lg:w-1/3 xl:w-1/4 h-1/2 lg:h-auto flex flex-col bg-white border-r border-gray-200">
          <div className="p-4 border-b">
            <form onSubmit={handleFormSubmit} className="flex items-center w-full p-1 pl-4 rounded-full bg-gray-100 border border-gray-200 focus-within:ring-2 focus-within:ring-black">
              <SearchIcon className="text-gray-500" />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for places..." className="w-full h-full px-2 bg-transparent outline-none" />
              <button type="submit" className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800"><ArrowRightIcon /></button>
            </form>
          </div>
          <div className="flex-grow overflow-y-auto p-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-full"><LogoIcon className="w-12 h-12 animate-spin" /></div>
            ) : error ? (
              <div className="p-4 text-center text-red-600">{error}</div>
            ) : places.length > 0 ? (
              <ul className="space-y-2">
                {places.map(place => (
                  <li key={place.place_id} id={`place-${place.place_id}`}>
                    <button 
                        onClick={() => {
                            if (place.geometry?.location) {
                                mapInstanceRef.current.panTo(place.geometry.location);
                                mapInstanceRef.current.setZoom(15);
                                setActivePlaceId(place.place_id);
                            }
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${activePlaceId === place.place_id ? 'bg-gray-100 border-gray-400 shadow-md' : 'border-transparent hover:bg-gray-50 hover:border-gray-200'}`}
                    >
                      {place.photos?.[0] && (
                        <img src={place.photos[0].getUrl()} alt={place.name} className="w-full h-32 object-cover rounded-md mb-3" />
                      )}
                      <h3 className="font-bold text-gray-800">{place.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        {renderStars(place.rating)}
                        {renderPriceLevel(place.price_level)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{place.formatted_address}</p>
                      {place.website && (
                          <a href={place.website} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center space-x-1 text-sm text-blue-600 hover:underline">
                              <LinkIcon className="w-4 h-4"/>
                              <span>Website</span>
                          </a>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">No results found for "{query}".</div>
            )}
          </div>
        </div>
        
        {/* Map Panel */}
        <div ref={mapRef} className="w-full lg:w-2/3 xl:w-3/4 h-1/2 lg:h-auto flex-grow"></div>
      </main>
    </div>
  );
};
