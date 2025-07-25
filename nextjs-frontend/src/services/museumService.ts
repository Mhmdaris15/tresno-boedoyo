import { Museum, Artifact, Tour, TourStop } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class MuseumService {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Museum endpoints
  static async getMuseums(): Promise<Museum[]> {
    return this.request<Museum[]>('/api/museums');
  }

  static async getMuseum(id: string): Promise<Museum> {
    return this.request<Museum>(`/api/museums/${id}`);
  }

  static async createMuseum(museum: Omit<Museum, 'id' | 'createdAt' | 'updatedAt'>): Promise<Museum> {
    return this.request<Museum>('/api/museums', {
      method: 'POST',
      body: JSON.stringify(museum),
    });
  }

  static async updateMuseum(id: string, museum: Partial<Museum>): Promise<Museum> {
    return this.request<Museum>(`/api/museums/${id}`, {
      method: 'PUT',
      body: JSON.stringify(museum),
    });
  }

  static async deleteMuseum(id: string): Promise<void> {
    return this.request<void>(`/api/museums/${id}`, {
      method: 'DELETE',
    });
  }

  // Artifact endpoints
  static async getArtifacts(museumId: string): Promise<Artifact[]> {
    return this.request<Artifact[]>(`/api/museums/${museumId}/artifacts`);
  }

  static async getArtifact(museumId: string, artifactId: string): Promise<Artifact> {
    return this.request<Artifact>(`/api/museums/${museumId}/artifacts/${artifactId}`);
  }

  static async createArtifact(museumId: string, artifact: Omit<Artifact, 'id' | 'museumId' | 'createdAt' | 'updatedAt'>): Promise<Artifact> {
    return this.request<Artifact>(`/api/museums/${museumId}/artifacts`, {
      method: 'POST',
      body: JSON.stringify(artifact),
    });
  }

  static async updateArtifact(museumId: string, artifactId: string, artifact: Partial<Artifact>): Promise<Artifact> {
    return this.request<Artifact>(`/api/museums/${museumId}/artifacts/${artifactId}`, {
      method: 'PUT',
      body: JSON.stringify(artifact),
    });
  }

  static async deleteArtifact(museumId: string, artifactId: string): Promise<void> {
    return this.request<void>(`/api/museums/${museumId}/artifacts/${artifactId}`, {
      method: 'DELETE',
    });
  }

  // Tour endpoints
  static async getTours(museumId: string): Promise<Tour[]> {
    return this.request<Tour[]>(`/api/museums/${museumId}/tours`);
  }

  static async getTour(museumId: string, tourId: string): Promise<Tour> {
    return this.request<Tour>(`/api/museums/${museumId}/tours/${tourId}`);
  }

  static async createTour(museumId: string, tour: Omit<Tour, 'id' | 'museumId' | 'createdAt' | 'updatedAt'>): Promise<Tour> {
    return this.request<Tour>(`/api/museums/${museumId}/tours`, {
      method: 'POST',
      body: JSON.stringify(tour),
    });
  }

  static async updateTour(museumId: string, tourId: string, tour: Partial<Tour>): Promise<Tour> {
    return this.request<Tour>(`/api/museums/${museumId}/tours/${tourId}`, {
      method: 'PUT',
      body: JSON.stringify(tour),
    });
  }

  static async deleteTour(museumId: string, tourId: string): Promise<void> {
    return this.request<void>(`/api/museums/${museumId}/tours/${tourId}`, {
      method: 'DELETE',
    });
  }

  // Tour optimization with AI
  static async optimizeTour(museumId: string, tourId: string, preferences?: {
    maxDuration?: number;
    interests?: string[];
    accessibility?: boolean;
  }): Promise<Tour> {
    return this.request<Tour>(`/api/museums/${museumId}/tours/${tourId}/optimize`, {
      method: 'POST',
      body: JSON.stringify({ preferences }),
    });
  }

  // AI narrative generation
  static async generateNarrative(museumId: string, tourId: string, style?: string): Promise<{ narrative: string }> {
    return this.request<{ narrative: string }>(`/api/museums/${museumId}/tours/${tourId}/narrative`, {
      method: 'POST',
      body: JSON.stringify({ style }),
    });
  }

  // Tour stops endpoints
  static async getTourStops(museumId: string, tourId: string): Promise<TourStop[]> {
    return this.request<TourStop[]>(`/api/museums/${museumId}/tours/${tourId}/stops`);
  }

  static async addTourStop(museumId: string, tourId: string, stop: Omit<TourStop, 'id' | 'tourId' | 'createdAt' | 'updatedAt'>): Promise<TourStop> {
    return this.request<TourStop>(`/api/museums/${museumId}/tours/${tourId}/stops`, {
      method: 'POST',
      body: JSON.stringify(stop),
    });
  }

  static async updateTourStop(museumId: string, tourId: string, stopId: string, stop: Partial<TourStop>): Promise<TourStop> {
    return this.request<TourStop>(`/api/museums/${museumId}/tours/${tourId}/stops/${stopId}`, {
      method: 'PUT',
      body: JSON.stringify(stop),
    });
  }

  static async deleteTourStop(museumId: string, tourId: string, stopId: string): Promise<void> {
    return this.request<void>(`/api/museums/${museumId}/tours/${tourId}/stops/${stopId}`, {
      method: 'DELETE',
    });
  }
}
