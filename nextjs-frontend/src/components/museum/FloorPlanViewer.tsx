import React, { useState, useRef, useEffect } from 'react';
import { Artifact, ArtifactCategory } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  MapPin, 
  Clock, 
  Info, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Eye,
  Calendar,
  MapIcon
} from 'lucide-react';

interface FloorPlanViewerProps {
  floorPlanImage?: string;
  floorPlanWidth: number;
  floorPlanHeight: number;
  artifacts: Artifact[];
  selectedArtifactId?: string;
  onArtifactSelect?: (artifact: Artifact) => void;
  onArtifactEdit?: (artifact: Artifact) => void;
  isEditMode?: boolean;
  className?: string;
}

interface Position {
  x: number;
  y: number;
}

const CATEGORY_COLORS: Record<ArtifactCategory, string> = {
  SCULPTURE: 'bg-blue-500',
  PAINTING: 'bg-purple-500',
  TEXTILE: 'bg-green-500',
  POTTERY: 'bg-orange-500',
  JEWELRY: 'bg-yellow-500',
  WEAPON: 'bg-red-500',
  MANUSCRIPT: 'bg-indigo-500',
  RELIGIOUS_OBJECT: 'bg-pink-500',
  ARCHAEOLOGICAL_FIND: 'bg-gray-500',
  TRADITIONAL_TOOL: 'bg-teal-500',
  INTERACTIVE_DISPLAY: 'bg-cyan-500',
  MULTIMEDIA: 'bg-violet-500'
};

export const FloorPlanViewer: React.FC<FloorPlanViewerProps> = ({
  floorPlanImage,
  floorPlanWidth,
  floorPlanHeight,
  artifacts,
  selectedArtifactId,
  onArtifactSelect,
  onArtifactEdit,
  isEditMode = false,
  className = ''
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState<Position>({ x: 0, y: 0 });
  const [hoveredArtifact, setHoveredArtifact] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Convert artifact position to SVG coordinates
  const artifactToSVG = (artifact: Artifact) => {
    const x = (artifact.xPosition / floorPlanWidth) * 800; // 800px SVG width
    const y = (artifact.yPosition / floorPlanHeight) * 600; // 600px SVG height
    return { x, y };
  };

  // Handle zoom
  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.5, Math.min(3, zoom + delta));
    setZoom(newZoom);
  };

  // Handle pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset view
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Handle artifact click
  const handleArtifactClick = (artifact: Artifact) => {
    if (isEditMode && onArtifactEdit) {
      onArtifactEdit(artifact);
    } else if (onArtifactSelect) {
      onArtifactSelect(artifact);
    }
  };

  return (
    <div className={`relative bg-gray-50 border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(0.2)}
            className="bg-white shadow-sm"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(-0.2)}
            className="bg-white shadow-sm"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
            className="bg-white shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
        <div className="bg-white px-2 py-1 rounded text-xs border shadow-sm">
          Zoom: {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="w-64 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapIcon className="w-4 h-4" />
              Artifact Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-1 text-xs">
              {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
                <div key={category} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${color}`}></div>
                  <span className="capitalize text-gray-600">
                    {category.toLowerCase().replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floor Plan */}
      <div 
        ref={containerRef}
        className="w-full h-[600px] cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          className="select-none"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: 'center center'
          }}
        >
          {/* Background - Floor Plan Image or Grid */}
          {floorPlanImage ? (
            <image
              href={floorPlanImage}
              x="0"
              y="0"
              width="800"
              height="600"
              preserveAspectRatio="xMidYMid slice"
            />
          ) : (
            <>
              {/* Grid background */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="800" height="600" fill="url(#grid)" />
              <rect width="800" height="600" fill="rgba(249, 250, 251, 0.8)" />
              
              {/* Floor outline */}
              <rect 
                x="50" 
                y="50" 
                width="700" 
                height="500" 
                fill="none" 
                stroke="#6b7280" 
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              
              {/* Room labels */}
              <text x="400" y="80" textAnchor="middle" className="fill-gray-600 text-sm font-medium">
                Gallery Floor ({floorPlanWidth}m × {floorPlanHeight}m)
              </text>
            </>
          )}

          {/* Artifact Pins */}
          {artifacts.map((artifact) => {
            const pos = artifactToSVG(artifact);
            const isSelected = selectedArtifactId === artifact.id;
            const isHovered = hoveredArtifact === artifact.id;
            const color = CATEGORY_COLORS[artifact.category];

            return (
              <g key={artifact.id}>
                {/* Pin */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected || isHovered ? 12 : 8}
                  className={`${color} cursor-pointer transition-all duration-200 ${
                    isSelected ? 'stroke-white stroke-2' : ''
                  } ${isHovered ? 'opacity-80' : ''}`}
                  onClick={() => handleArtifactClick(artifact)}
                  onMouseEnter={() => setHoveredArtifact(artifact.id)}
                  onMouseLeave={() => setHoveredArtifact(null)}
                />
                
                {/* Pin icon */}
                <MapPin 
                  x={pos.x - 6} 
                  y={pos.y - 6} 
                  width="12" 
                  height="12" 
                  className="fill-white pointer-events-none"
                />

                {/* Label */}
                <text
                  x={pos.x}
                  y={pos.y + 25}
                  textAnchor="middle"
                  className="fill-gray-700 text-xs font-medium pointer-events-none"
                  style={{ fontSize: '10px' }}
                >
                  {artifact.name.length > 15 
                    ? `${artifact.name.substring(0, 15)}...` 
                    : artifact.name
                  }
                </text>

                {/* Tooltip on hover */}
                {isHovered && (
                  <foreignObject
                    x={pos.x + 15}
                    y={pos.y - 30}
                    width="200"
                    height="80"
                    className="pointer-events-none"
                  >
                    <Card className="shadow-lg border bg-white">
                      <CardContent className="p-3">
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm">{artifact.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Badge variant="secondary" className="text-xs">
                              {artifact.category.toLowerCase().replace('_', ' ')}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {artifact.estimatedDuration}min
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {artifact.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="flex justify-between items-center bg-white rounded-lg px-4 py-2 shadow-sm border">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {artifacts.length} artifacts
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~{artifacts.reduce((sum, a) => sum + a.estimatedDuration, 0)} min total
            </div>
          </div>
          {isEditMode && (
            <Badge variant="outline" className="text-xs">
              <Info className="w-3 h-3 mr-1" />
              Edit Mode
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
