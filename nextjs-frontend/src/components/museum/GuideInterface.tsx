import React, { useState, useEffect } from 'react';
import { Tour, TourStop, Artifact } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  MapPin,
  Clock,
  Users,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Navigation,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Camera,
  Share2,
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface GuideInterfaceProps {
  tour: Tour;
  currentStopIndex: number;
  onNextStop: () => void;
  onPreviousStop: () => void;
  onJumpToStop: (index: number) => void;
  onEndTour: () => void;
  isPlaying: boolean;
  onTogglePlay?: () => void;
  participants?: number;
  className?: string;
}

interface TourProgressProps {
  tour: Tour;
  currentStopIndex: number;
  onJumpToStop: (index: number) => void;
}

const TourProgress: React.FC<TourProgressProps> = ({
  tour,
  currentStopIndex,
  onJumpToStop
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Tour Progress</span>
        <span className="text-gray-600">
          {currentStopIndex + 1} / {tour.stops?.length || 0}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${((currentStopIndex + 1) / (tour.stops?.length || 1)) * 100}%` 
          }}
        />
      </div>

      {/* Stop indicators */}
      <div className="flex items-center justify-between">
        {tour.stops?.map((stop, index) => (
          <button
            key={stop.id}
            onClick={() => onJumpToStop(index)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
              index <= currentStopIndex
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {index < currentStopIndex ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export const GuideInterface: React.FC<GuideInterfaceProps> = ({
  tour,
  currentStopIndex,
  onNextStop,
  onPreviousStop,
  onJumpToStop,
  onEndTour,
  isPlaying,
  onTogglePlay,
  participants = 0,
  className = ''
}) => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentStopTime, setCurrentStopTime] = useState(0);

  const currentStop = tour.stops?.[currentStopIndex];
  const currentArtifact = currentStop?.artifact;
  const isLastStop = currentStopIndex === (tour.stops?.length || 0) - 1;
  const isFirstStop = currentStopIndex === 0;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        setCurrentStopTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Reset stop timer when changing stops
  useEffect(() => {
    setCurrentStopTime(0);
  }, [currentStopIndex]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const estimatedStopTime = currentStop?.estimatedTime || 0;
  const stopProgress = estimatedStopTime > 0 ? (currentStopTime / (estimatedStopTime * 60)) * 100 : 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{tour.title}</CardTitle>
              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                <Badge variant={isPlaying ? 'default' : 'secondary'}>
                  {isPlaying ? 'Active' : 'Paused'}
                </Badge>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTime(timeElapsed)} / {tour.estimatedDuration}min
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {participants} guests
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMicOn(!isMicOn)}
                className={isMicOn ? 'bg-red-50 border-red-200' : ''}
              >
                {isMicOn ? <Mic className="w-4 h-4 text-red-600" /> : <MicOff className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSoundOn(!isSoundOn)}
              >
                {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <TourProgress 
            tour={tour}
            currentStopIndex={currentStopIndex}
            onJumpToStop={onJumpToStop}
          />
        </CardContent>
      </Card>

      {/* Current Stop */}
      {currentArtifact && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl">{currentArtifact.name}</CardTitle>
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                  <Badge variant="outline">
                    {currentArtifact.category.toLowerCase().replace('_', ' ')}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Position ({currentArtifact.xPosition}, {currentArtifact.yPosition})
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {estimatedStopTime}min suggested
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {currentStopIndex + 1}
                </div>
                <div className="text-xs text-gray-600">Stop</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Stop Timer */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Stop Time</span>
                <span className={stopProgress > 100 ? 'text-orange-600 font-medium' : ''}>
                  {formatTime(currentStopTime)}
                  {estimatedStopTime > 0 && ` / ${estimatedStopTime}min`}
                </span>
              </div>
              {estimatedStopTime > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-300 ${
                      stopProgress > 100 ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(stopProgress, 100)}%` }}
                  />
                </div>
              )}
            </div>

            {/* Artifact Image */}
            {currentArtifact.images && currentArtifact.images[0] && (
              <div className="relative">
                <img
                  src={currentArtifact.images[0]}
                  alt={currentArtifact.name}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-artifact.jpg';
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button variant="outline" size="sm" className="bg-white/90">
                    <Camera className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/90">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {currentArtifact.description}
              </p>
            </div>

            {/* Talking Points */}
            {currentArtifact.talkingPoints && currentArtifact.talkingPoints.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Key Points to Discuss
                </h4>
                <ul className="space-y-2">
                  {currentArtifact.talkingPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Guide Notes */}
            {currentStop?.customNotes && (
              <div>
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <MessageSquare className="w-4 h-4" />
                  Guide Notes
                  {showNotes ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {showNotes && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-900">{currentStop.customNotes}</p>
                  </div>
                )}
              </div>
            )}

            {/* AI Transition */}
            {currentStop?.aiTransition && !isLastStop && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2 text-sm text-purple-700">
                  AI Suggested Transition
                </h4>
                <p className="text-sm text-purple-600 italic bg-purple-50 p-3 rounded-lg">
                  {currentStop.aiTransition}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onPreviousStop}
                disabled={isFirstStop}
                className="flex items-center gap-2"
              >
                <SkipBack className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={onTogglePlay}
                disabled={!onTogglePlay}
                className="flex items-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    {timeElapsed > 0 ? 'Resume' : 'Start'}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={onNextStop}
                disabled={isLastStop}
                className="flex items-center gap-2"
              >
                Next
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTimeElapsed(0);
                  setCurrentStopTime(0);
                }}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button
                variant="outline"
                onClick={onEndTour}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                End Tour
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <Navigation className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-sm">Navigation</h4>
            <p className="text-xs text-gray-600">Get directions to next stop</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <AlertCircle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <h4 className="font-medium text-sm">Emergency</h4>
            <p className="text-xs text-gray-600">Contact museum security</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
