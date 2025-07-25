import React, { useState, useEffect } from 'react';
import { Museum, Artifact, Tour } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FloorPlanViewer } from './FloorPlanViewer';
import { TourManager } from './TourManager';
import { ArtifactDetail } from './ArtifactDetail';
import { 
  BarChart3,
  Users,
  Clock,
  MapPin,
  Settings,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  Save,
  Building,
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react';

interface MuseumDashboardProps {
  museum: Museum;
  artifacts: Artifact[];
  tours: Tour[];
  onStartTour?: (tour: Tour) => void;
  onUpdateMuseum?: (museum: Partial<Museum>) => void;
  onCreateArtifact?: () => void;
  onUpdateArtifact?: (artifact: Artifact) => void;
  onDeleteArtifact?: (artifactId: string) => void;
  onCreateTour?: () => void;
  onUpdateTour?: (tour: Tour) => void;
  onDeleteTour?: (tourId: string) => void;
  className?: string;
}

interface DashboardStatsProps {
  museum: Museum;
  artifacts: Artifact[];
  tours: Tour[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  museum,
  artifacts,
  tours
}) => {
  const activeTours = tours.filter(t => t.status === 'ACTIVE').length;
  const avgTourDuration = tours.length > 0 
    ? Math.round(tours.reduce((sum, t) => sum + t.estimatedDuration, 0) / tours.length)
    : 0;
  const totalArtifacts = artifacts.length;
  const artifactsByCategory = artifacts.reduce((acc, artifact) => {
    acc[artifact.category] = (acc[artifact.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostPopularCategory = Object.entries(artifactsByCategory)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Artifacts</p>
              <p className="text-2xl font-bold text-blue-600">{totalArtifacts}</p>
            </div>
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Across {museum.floorPlanWidth}m × {museum.floorPlanHeight}m floor
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tours</p>
              <p className="text-2xl font-bold text-green-600">{activeTours}</p>
            </div>
            <Activity className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {tours.length} total tours created
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Tour Duration</p>
              <p className="text-2xl font-bold text-purple-600">{avgTourDuration}min</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Estimated visitor time
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Popular Category</p>
              <p className="text-lg font-bold text-orange-600">
                {mostPopularCategory.replace('_', ' ')}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {artifactsByCategory[mostPopularCategory]} artifacts
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export const MuseumDashboard: React.FC<MuseumDashboardProps> = ({
  museum,
  artifacts,
  tours,
  onStartTour,
  onUpdateMuseum,
  onCreateArtifact,
  onUpdateArtifact,
  onDeleteArtifact,
  onCreateTour,
  onUpdateTour,
  onDeleteTour,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'floor-plan' | 'artifacts' | 'tours' | 'settings'>('overview');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'floor-plan', label: 'Floor Plan', icon: MapPin },
    { id: 'artifacts', label: 'Artifacts', icon: Building },
    { id: 'tours', label: 'Tours', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{museum.name}</h1>
          <p className="text-gray-600 mt-1">{museum.address}, {museum.city}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview Museum
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <DashboardStats museum={museum} artifacts={artifacts} tours={tours} />
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={onCreateArtifact}>
                <div className="text-center">
                  <Plus className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900">Add New Artifact</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Upload and position artifacts on floor plan
                  </p>
                </div>
              </Card>

              <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={onCreateTour}>
                <div className="text-center">
                  <Users className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900">Create Tour</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Design guided experiences for visitors
                  </p>
                </div>
              </Card>

              <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('floor-plan')}>
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900">View Floor Plan</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage artifact positioning and layout
                  </p>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Museum data initialized with {artifacts.length} artifacts</span>
                    <span className="text-gray-400">Today</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Floor plan configured ({museum.floorPlanWidth}m × {museum.floorPlanHeight}m)</span>
                    <span className="text-gray-400">Today</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">Pandu Museum system activated</span>
                    <span className="text-gray-400">Today</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'floor-plan' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Floor Plan Management</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={isEditMode ? 'bg-blue-50 border-blue-200' : ''}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Exit Edit' : 'Edit Mode'}
                </Button>
                <Button onClick={onCreateArtifact} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Artifact
                </Button>
              </div>
            </div>

            <FloorPlanViewer
              floorPlanImage={museum.floorPlanImage}
              floorPlanWidth={museum.floorPlanWidth || 150}
              floorPlanHeight={museum.floorPlanHeight || 100}
              artifacts={artifacts}
              selectedArtifactId={selectedArtifact?.id}
              onArtifactSelect={setSelectedArtifact}
              onArtifactEdit={onUpdateArtifact}
              isEditMode={isEditMode}
              className="h-[600px]"
            />

            {selectedArtifact && (
              <div className="mt-6">
                <ArtifactDetail
                  artifact={selectedArtifact}
                  onClose={() => setSelectedArtifact(null)}
                  onEdit={() => onUpdateArtifact?.(selectedArtifact)}
                  canEdit={true}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'artifacts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Artifact Collection</h2>
              <Button onClick={onCreateArtifact} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Artifact
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {artifacts.map((artifact) => (
                <Card key={artifact.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    {artifact.images?.[0] && (
                      <img
                        src={artifact.images[0]}
                        alt={artifact.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder-artifact.jpg';
                        }}
                      />
                    )}
                    <h3 className="font-semibold text-gray-900 mb-2">{artifact.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {artifact.category.toLowerCase().replace('_', ' ')}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        {artifact.estimatedDuration}min
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {artifact.description}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedArtifact(artifact)}
                        className="flex-1"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateArtifact?.(artifact)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tours' && (
          <TourManager
            museum={museum}
            tours={tours}
            artifacts={artifacts}
            onStartTour={onStartTour}
            onCreateTour={onCreateTour}
            onEditTour={onUpdateTour}
            onDeleteTour={onDeleteTour}
            onOptimizeTour={async (tourId) => {
              // TODO: Implement AI optimization
              console.log('Optimizing tour:', tourId);
            }}
            onGenerateNarrative={async (tourId) => {
              // TODO: Implement AI narrative generation
              console.log('Generating narrative for tour:', tourId);
            }}
          />
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Museum Settings</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Museum Name
                    </label>
                    <input
                      type="text"
                      value={museum.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => onUpdateMuseum?.({ name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={museum.city}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => onUpdateMuseum?.({ city: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={museum.description || ''}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => onUpdateMuseum?.({ description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Floor Plan Width (meters)
                    </label>
                    <input
                      type="number"
                      value={museum.floorPlanWidth || 150}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => onUpdateMuseum?.({ floorPlanWidth: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Floor Plan Height (meters)
                    </label>
                    <input
                      type="number"
                      value={museum.floorPlanHeight || 100}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => onUpdateMuseum?.({ floorPlanHeight: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <Button className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
