import React from 'react';
import { Artifact } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Clock, 
  MapPin, 
  Calendar, 
  Globe,
  Info,
  Eye,
  Edit,
  X,
  Image as ImageIcon
} from 'lucide-react';

interface ArtifactDetailProps {
  artifact: Artifact;
  onClose?: () => void;
  onEdit?: () => void;
  canEdit?: boolean;
  className?: string;
}

export const ArtifactDetail: React.FC<ArtifactDetailProps> = ({
  artifact,
  onClose,
  onEdit,
  canEdit = false,
  className = ''
}) => {
  return (
    <Card className={`max-w-2xl mx-auto ${className}`}>
      {/* Header */}
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex-1">
          <CardTitle className="text-xl mb-2">{artifact.name}</CardTitle>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">
              {artifact.category.toLowerCase().replace('_', ' ')}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {artifact.estimatedDuration} minutes
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              Floor {artifact.floor}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {canEdit && onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Images */}
        {artifact.images && artifact.images.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Images
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {artifact.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`${artifact.name} - Image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder-artifact.jpg';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Info className="w-4 h-4" />
            Description
          </h4>
          <p className="text-gray-700 leading-relaxed">{artifact.description}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Origin & Period */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Origin & Period
            </h4>
            <div className="space-y-2 text-sm">
              {artifact.origin && (
                <div>
                  <span className="font-medium text-gray-600">Origin:</span>
                  <span className="ml-2">{artifact.origin}</span>
                </div>
              )}
              {artifact.period && (
                <div>
                  <span className="font-medium text-gray-600">Period:</span>
                  <span className="ml-2">{artifact.period}</span>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-600">Position:</span>
                <span className="ml-2">
                  ({artifact.xPosition.toFixed(1)}, {artifact.yPosition.toFixed(1)})
                </span>
              </div>
            </div>
          </div>

          {/* Materials */}
          <div className="space-y-3">
            <h4 className="font-medium">Materials</h4>
            <div className="flex flex-wrap gap-2">
              {artifact.materials.map((material, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {material}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Significance */}
        {artifact.significance && (
          <div className="space-y-3">
            <h4 className="font-medium">Cultural Significance</h4>
            <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-100">
              {artifact.significance}
            </p>
          </div>
        )}

        {/* Talking Points */}
        {artifact.talkingPoints && artifact.talkingPoints.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Key Talking Points</h4>
            <ul className="space-y-2">
              {artifact.talkingPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Metadata */}
        <div className="border-t pt-4 text-xs text-gray-500 space-y-1">
          <div>Created: {new Date(artifact.createdAt).toLocaleDateString()}</div>
          <div>Last updated: {new Date(artifact.updatedAt).toLocaleDateString()}</div>
          <div>Artifact ID: {artifact.id}</div>
        </div>
      </CardContent>
    </Card>
  );
};
