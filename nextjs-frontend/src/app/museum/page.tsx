'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Museum, Artifact, Tour } from '@/types';
import { MuseumDashboard } from '@/components/museum/MuseumDashboard';
import { GuideInterface } from '@/components/museum/GuideInterface';
import { MuseumService } from '@/services/museumService';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Building, 
  Users, 
  MapPin, 
  Clock,
  Play,
  Settings,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Home
} from 'lucide-react';

interface MuseumPageProps {
  params: {
    id?: string;
  };
}

type ViewMode = 'dashboard' | 'guide' | 'preview';

export default function MuseumPage({ params }: MuseumPageProps) {
  const [museum, setMuseum] = useState<Museum | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // For demo purposes, we'll use the National Museum we created
  const DEMO_MUSEUM_ID = 'demo-national-museum';

  useEffect(() => {
    loadMuseumData();
  }, []);

  const loadMuseumData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For demo purposes, create mock data based on our seed data
      const mockMuseum: Museum = {
        id: DEMO_MUSEUM_ID,
        name: 'National Museum of Indonesia',
        address: 'Jl. Medan Merdeka Barat No.12, Gambir',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        description: 'The National Museum of Indonesia, also known as Museum Gajah (Elephant Museum), is an archaeological, historical, ethnological, and geographical museum located in Jakarta.',
        floorPlanImage: '/images/museum/national-museum-floorplan.jpg',
        floorPlanWidth: 150,
        floorPlanHeight: 100,
        openingHours: 'Tuesday-Sunday: 08:00-16:00, Closed on Monday',
        contactInfo: '+62 21 3868172',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const mockArtifacts: Artifact[] = [
        {
          id: 'artifact-1',
          museumId: DEMO_MUSEUM_ID,
          name: 'Yupa Stone Inscription',
          description: 'Ancient stone inscription from the Kutai Kingdom (4th century CE), one of the oldest written records in Indonesia.',
          category: 'MANUSCRIPT',
          origin: 'East Kalimantan',
          period: '4th century CE',
          materials: ['Stone', 'Sanskrit inscription'],
          significance: 'Earliest evidence of Hindu influence and written culture in Indonesia',
          talkingPoints: [
            'Oldest written record in Indonesia',
            'Shows early Hindu-Buddhist influence',
            'Kutai Kingdom connection',
            'Sanskrit language usage'
          ],
          images: ['/images/artifacts/yupa-stone.jpg'],
          xPosition: 25.0,
          yPosition: 30.0,
          floor: 1,
          estimatedDuration: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'artifact-2',
          museumId: DEMO_MUSEUM_ID,
          name: 'Borobudur Relief Model',
          description: 'Scale model of the famous Buddhist temple reliefs depicting the journey to enlightenment.',
          category: 'SCULPTURE',
          origin: 'Central Java',
          period: '8th-9th century CE',
          materials: ['Stone', 'Sandstone'],
          significance: 'Represents pinnacle of Buddhist art and architecture in Indonesia',
          talkingPoints: [
            'Buddhist cosmology representation',
            'Architectural masterpiece',
            'UNESCO World Heritage Site',
            'Mandala symbolism'
          ],
          images: ['/images/artifacts/borobudur-relief.jpg'],
          xPosition: 45.0,
          yPosition: 40.0,
          floor: 1,
          estimatedDuration: 15,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'artifact-3',
          museumId: DEMO_MUSEUM_ID,
          name: 'Traditional Batak Ulos Textile',
          description: 'Sacred ceremonial textile from North Sumatra, woven with traditional patterns and used in important life ceremonies.',
          category: 'TEXTILE',
          origin: 'North Sumatra',
          period: '19th-20th century',
          materials: ['Cotton', 'Gold thread', 'Natural dyes'],
          significance: 'Represents cultural identity and spiritual beliefs of Batak people',
          talkingPoints: [
            'Sacred ceremonial purpose',
            'Traditional weaving techniques',
            'Cultural symbolism',
            'Life cycle ceremonies'
          ],
          images: ['/images/artifacts/batak-ulos.jpg'],
          xPosition: 30.0,
          yPosition: 60.0,
          floor: 1,
          estimatedDuration: 8,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'artifact-4',
          museumId: DEMO_MUSEUM_ID,
          name: 'Majapahit Terracotta Figure',
          description: 'Ancient terracotta figurine from the Majapahit period, representing Hindu-Javanese artistic traditions.',
          category: 'SCULPTURE',
          origin: 'East Java',
          period: '13th-15th century CE',
          materials: ['Terracotta', 'Clay'],
          significance: 'Shows synthesis of Hindu and local Javanese artistic styles',
          talkingPoints: [
            'Majapahit Empire legacy',
            'Hindu-Javanese synthesis',
            'Artistic craftsmanship',
            'Religious symbolism'
          ],
          images: ['/images/artifacts/majapahit-terracotta.jpg'],
          xPosition: 70.0,
          yPosition: 25.0,
          floor: 1,
          estimatedDuration: 12,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'artifact-5',
          museumId: DEMO_MUSEUM_ID,
          name: 'Traditional Keris Blade',
          description: 'Sacred ceremonial dagger with intricate patterns, embodying Javanese spiritual and artistic traditions.',
          category: 'WEAPON',
          origin: 'Central Java',
          period: '18th-19th century',
          materials: ['Steel', 'Iron', 'Gold inlay'],
          significance: 'Sacred weapon with spiritual significance in Javanese culture',
          talkingPoints: [
            'Spiritual significance',
            'Metallurgy mastery',
            'Cultural symbolism',
            'Ceremonial importance'
          ],
          images: ['/images/artifacts/keris-blade.jpg'],
          xPosition: 85.0,
          yPosition: 50.0,
          floor: 1,
          estimatedDuration: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'artifact-6',
          museumId: DEMO_MUSEUM_ID,
          name: 'Batik Royal Court Pattern',
          description: 'Exquisite batik textile featuring royal court patterns from the Yogyakarta Sultanate.',
          category: 'TEXTILE',
          origin: 'Yogyakarta',
          period: '19th century',
          materials: ['Cotton', 'Natural wax', 'Natural dyes'],
          significance: 'Represents the pinnacle of Javanese textile artistry and royal culture',
          talkingPoints: [
            'Royal court tradition',
            'Wax-resist dyeing technique',
            'Cultural patterns',
            'UNESCO recognition'
          ],
          images: ['/images/artifacts/batik-royal.jpg'],
          xPosition: 60.0,
          yPosition: 75.0,
          floor: 1,
          estimatedDuration: 12,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'artifact-7',
          museumId: DEMO_MUSEUM_ID,
          name: 'Dayak Traditional Shield',
          description: 'Ornately carved wooden shield from Borneo Dayak warriors, decorated with traditional motifs.',
          category: 'WEAPON',
          origin: 'Kalimantan',
          period: '19th-20th century',
          materials: ['Wood', 'Natural pigments', 'Rattan'],
          significance: 'Represents Dayak warrior culture and traditional artistic expression',
          talkingPoints: [
            'Dayak warrior tradition',
            'Protective symbolism',
            'Carved artistic motifs',
            'Cultural identity'
          ],
          images: ['/images/artifacts/dayak-shield.jpg'],
          xPosition: 20.0,
          yPosition: 80.0,
          floor: 1,
          estimatedDuration: 8,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      const mockTours: Tour[] = [
        {
          id: 'tour-1',
          museumId: DEMO_MUSEUM_ID,
          guideId: 'guide-1',
          title: 'Highlights of Indonesian Civilization',
          description: 'A comprehensive tour showcasing the rich cultural heritage and artistic achievements of Indonesia from ancient times to the colonial period.',
          estimatedDuration: 90,
          maxParticipants: 20,
          startTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          status: 'ACTIVE',
          startPointX: 10.0,
          startPointY: 15.0,
          endPointX: 90.0,
          endPointY: 80.0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stops: [
            {
              id: 'stop-1',
              tourId: 'tour-1',
              artifactId: 'artifact-1',
              stopOrder: 1,
              estimatedTime: 10,
              customNotes: 'Starting point - ancient inscriptions',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              artifact: mockArtifacts[0]
            },
            {
              id: 'stop-2',
              tourId: 'tour-1',
              artifactId: 'artifact-2',
              stopOrder: 2,
              estimatedTime: 15,
              customNotes: 'Buddhist art and architecture',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              artifact: mockArtifacts[1]
            },
            {
              id: 'stop-3',
              tourId: 'tour-1',
              artifactId: 'artifact-3',
              stopOrder: 3,
              estimatedTime: 8,
              customNotes: 'Traditional textiles and cultural significance',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              artifact: mockArtifacts[2]
            }
          ]
        }
      ];

      setMuseum(mockMuseum);
      setArtifacts(mockArtifacts);
      setTours(mockTours);

      // In a real implementation, you would make API calls:
      // const museum = await MuseumService.getMuseum(params.id || DEMO_MUSEUM_ID);
      // const artifacts = await MuseumService.getArtifacts(museum.id);
      // const tours = await MuseumService.getTours(museum.id);
      
    } catch (err) {
      setError('Failed to load museum data. Please try again.');
      console.error('Error loading museum data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTour = (tour: Tour) => {
    setSelectedTour(tour);
    setCurrentStopIndex(0);
    setViewMode('guide');
    setIsPlaying(true);
  };

  const handleNextStop = () => {
    if (selectedTour && currentStopIndex < (selectedTour.stops?.length || 0) - 1) {
      setCurrentStopIndex(prev => prev + 1);
    }
  };

  const handlePreviousStop = () => {
    if (currentStopIndex > 0) {
      setCurrentStopIndex(prev => prev - 1);
    }
  };

  const handleJumpToStop = (index: number) => {
    setCurrentStopIndex(index);
  };

  const handleEndTour = () => {
    setSelectedTour(null);
    setCurrentStopIndex(0);
    setViewMode('dashboard');
    setIsPlaying(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-heritage-600">
                  Tresno Boedoyo
                </Link>
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/museums" className="text-gray-600 hover:text-heritage-600">
                  Museums
                </Link>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-800">Museum Experience</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/museums">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Museums
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="min-h-screen flex items-center justify-center">
          <Card className="p-8">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <div>
                <h3 className="font-semibold">Loading Museum Data</h3>
                <p className="text-sm text-gray-600">Please wait while we load the museum information...</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !museum) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-heritage-600">
                  Tresno Boedoyo
                </Link>
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/museums" className="text-gray-600 hover:text-heritage-600">
                  Museums
                </Link>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-800">Museum Experience</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/museums">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Museums
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="min-h-screen flex items-center justify-center">
          <Card className="p-8 max-w-md">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Failed to Load Museum</h3>
              <p className="text-sm text-gray-600 mb-4">
                {error || 'Museum not found. Please check the URL and try again.'}
              </p>
              <Button onClick={loadMuseumData} className="flex items-center gap-2 mx-auto">
                <Loader2 className="w-4 h-4" />
                Retry
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-heritage-600">
                Tresno Boedoyo
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <Link href="/museums" className="text-gray-600 hover:text-heritage-600">
                Museums
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-800">{museum.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/museums">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Museums
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {viewMode !== 'dashboard' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('dashboard')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              )}
              <div className="flex items-center gap-3">
                <Building className="w-6 h-6 text-blue-600" />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Pandu Museum</h1>
                  <p className="text-sm text-gray-600">{museum.name}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Switcher */}
              <div className="flex rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode('dashboard')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'dashboard'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-1 inline" />
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    if (tours.length > 0) {
                      handleStartTour(tours[0]);
                    }
                  }}
                  disabled={tours.length === 0}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'guide'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 disabled:opacity-50'
                  }`}
                >
                  <Play className="w-4 h-4 mr-1 inline" />
                  Guide Mode
                </button>
              </div>

              {/* Status Badge */}
              <Badge variant={isPlaying ? 'default' : 'secondary'}>
                {isPlaying ? 'Tour Active' : 'Ready'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'dashboard' && (
          <MuseumDashboard
            museum={museum}
            artifacts={artifacts}
            tours={tours}
            onStartTour={handleStartTour}
          />
        )}

        {viewMode === 'guide' && selectedTour && (
          <GuideInterface
            tour={selectedTour}
            currentStopIndex={currentStopIndex}
            onNextStop={handleNextStop}
            onPreviousStop={handlePreviousStop}
            onJumpToStop={handleJumpToStop}
            onEndTour={handleEndTour}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
          />
        )}
      </div>
    </div>
  );
}
