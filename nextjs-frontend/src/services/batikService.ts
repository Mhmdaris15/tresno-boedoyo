import { apiClient } from '@/lib/api'
import {
  BatikGenerationRequest,
  BatchGenerationRequest,
  GeneratedBatik,
  GenerationLimit,
  PublicBatik,
  BatikComment,
  BatikCollection,
  BatikCollectionItem,
  PublicGalleryFilters,
  PaginatedResponse
} from '@/types/batik'

export class BatikService {
  
  // Generation endpoints
  static async generateBatik(request: BatikGenerationRequest): Promise<GeneratedBatik> {
    const response = await apiClient.post('/api/generate/batik', request) as { data: GeneratedBatik }
    return response.data
  }

  static async batchGenerate(request: BatchGenerationRequest): Promise<GeneratedBatik[]> {
    const response = await apiClient.post('/api/generate/batch', request) as { data: GeneratedBatik[] }
    return response.data
  }

  static async getGenerationLimit(): Promise<GenerationLimit> {
    const response = await apiClient.get('/api/generation-limit') as { data: GenerationLimit }
    return response.data
  }

  // History and personal batiks
  static async getBatikHistory(params: {
    page?: number
    limit?: number
    motif?: string
    style?: string
    region?: string
    search?: string
  } = {}): Promise<{ batiks: GeneratedBatik[], total: number, page: number }> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })
    
    const response = await apiClient.get(`/api/batik-studio/history?${queryParams}`) as { 
      data: { batiks: GeneratedBatik[], total: number, page: number } 
    }
    return response.data
  }

  static async saveBatikToGallery(
    batikId: string,
    galleryData: {
      title: string
      description: string
      tags: string[]
      isPublic: boolean
    }
  ): Promise<void> {
    await apiClient.post(`/api/batik-studio/${batikId}/save`, galleryData)
  }

  static async downloadBatik(batikId: string): Promise<{
    downloadUrl: string
    base64: string
    filename: string
  }> {
    const response = await apiClient.get(`/api/batik-studio/${batikId}/download`) as {
      data: { downloadUrl: string; base64: string; filename: string }
    }
    return response.data
  }

  // Public gallery
  static async getPublicGallery(filters: PublicGalleryFilters): Promise<PaginatedResponse<PublicBatik>> {
    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })
    
    const response = await apiClient.get(`/api/gallery/public?${queryParams}`) as { 
      data: PaginatedResponse<PublicBatik> 
    }
    return response.data
  }

  // Likes and comments
  static async toggleLike(galleryId: string): Promise<{ liked: boolean; likesCount: number }> {
    const response = await apiClient.post(`/api/gallery/${galleryId}/like`) as { 
      data: { liked: boolean; likesCount: number } 
    }
    return response.data
  }

  static async addComment(galleryId: string, content: string): Promise<BatikComment> {
    const response = await apiClient.post(`/api/gallery/${galleryId}/comment`, { content }) as { 
      data: BatikComment 
    }
    return response.data
  }

  static async getComments(
    galleryId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<BatikComment>> {
    const response = await apiClient.get(`/api/gallery/${galleryId}/comments?page=${page}&limit=${limit}`) as { 
      data: PaginatedResponse<BatikComment> 
    }
    return response.data
  }

  // Collections
  static async getUserCollections(): Promise<BatikCollection[]> {
    const response = await apiClient.get('/api/collections') as { data: BatikCollection[] }
    return response.data
  }

  static async createCollection(data: {
    name: string
    description?: string
    isPublic?: boolean
  }): Promise<BatikCollection> {
    const response = await apiClient.post('/api/collections', data) as { data: BatikCollection }
    return response.data
  }

  static async addBatikToCollection(collectionId: string, batikId: string): Promise<void> {
    await apiClient.post(`/api/collections/${collectionId}/batiks/${batikId}`)
  }

  static async removeBatikFromCollection(collectionId: string, batikId: string): Promise<void> {
    await apiClient.delete(`/api/collections/${collectionId}/batiks/${batikId}`)
  }

  static async getCollectionDetails(collectionId: string): Promise<BatikCollection> {
    const response = await apiClient.get(`/api/collections/${collectionId}`) as { data: BatikCollection }
    return response.data
  }
}
