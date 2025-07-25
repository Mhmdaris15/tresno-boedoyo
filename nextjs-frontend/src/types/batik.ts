export interface BatikGenerationRequest {
  prompt: string
  motif: string
  style: string
  colors: string[]
  region: string
  complexity: string
}

export interface BatchGenerationRequest {
  requests: BatikGenerationRequest[]
}

export interface GeneratedBatik {
  id: string
  prompt: string
  originalPrompt: string
  imageUrl: string
  imageBase64: string
  motif: string
  style: string
  colors: string[]
  region: string
  complexity: string
  createdAt: string
  userId: string
  downloadCount?: number
  inGallery?: boolean
}

export interface GenerationLimit {
  canGenerate: boolean
  currentCount: number
  limit: number
  nextReset: string
}

export interface PublicBatik {
  id: string
  title: string
  description: string
  imageUrl: string
  motif: string
  style: string
  region: string
  tags: string[]
  isPublic: boolean
  likesCount: number
  commentsCount: number
  downloadCount: number
  createdAt: string
  user: {
    name: string
    email: string
  }
}

export interface BatikComment {
  id: string
  content: string
  createdAt: string
  user: {
    name: string
    email: string
  }
}

export interface BatikCollection {
  id: string
  name: string
  description: string
  isPublic: boolean
  userId: string
  createdAt: string
  itemsCount?: number
  items?: BatikCollectionItem[]
  user?: {
    name: string
    email: string
  }
}

export interface BatikCollectionItem {
  id: string
  batikId: string
  collectionId: string
  addedAt: string
  batik?: GeneratedBatik
}

export interface PublicGalleryFilters {
  page: number
  limit: number
  motif?: string
  style?: string
  region?: string
  search?: string
  sortBy?: 'recent' | 'popular' | 'likes' | 'downloads'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
}
