class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = endpoint.startsWith('/api') 
      ? endpoint // Next.js API routes
      : `${this.baseURL}${endpoint}` // Backend API

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: {
    email: string
    password: string
    role: 'VOLUNTEER' | 'COORDINATOR'
    firstName: string
    lastName: string
    phone?: string
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    })
  }

  // User endpoints
  async getProfile() {
    return this.request('/users/profile')
  }

  async updateProfile(profileData: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  // Opportunities endpoints
  async getOpportunities(params?: { 
    page?: number
    limit?: number
    type?: string
    status?: string
    location?: string
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/opportunities${queryString}`)
  }

  async getOpportunity(id: string) {
    return this.request(`/opportunities/${id}`)
  }

  async createOpportunity(opportunityData: any) {
    return this.request('/opportunities', {
      method: 'POST',
      body: JSON.stringify(opportunityData),
    })
  }

  async updateOpportunity(id: string, opportunityData: any) {
    return this.request(`/opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(opportunityData),
    })
  }

  async deleteOpportunity(id: string) {
    return this.request(`/opportunities/${id}`, {
      method: 'DELETE',
    })
  }

  // Applications endpoints
  async applyToOpportunity(opportunityId: string, applicationData: any) {
    return this.request(`/opportunities/${opportunityId}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    })
  }

  async getApplications(params?: { 
    status?: string
    opportunityId?: string
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/applications${queryString}`)
  }

  async updateApplicationStatus(applicationId: string, status: string, notes?: string) {
    return this.request(`/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    })
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request('/admin/stats')
  }

  async getVolunteers(params?: { 
    page?: number
    limit?: number
    status?: string
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/admin/volunteers${queryString}`)
  }

  async updateVolunteerStatus(volunteerId: string, status: string) {
    return this.request(`/admin/volunteers/${volunteerId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  // Batik AI Studio endpoints
  async generateBatik(batikData: {
    prompt: string
    motif: string
    style: string
    colors: string[]
    region: string
    complexity: string
  }) {
    return this.request('/api/generate/batik', {
      method: 'POST',
      body: JSON.stringify(batikData),
    })
  }

  async getBatikHistory(params?: { 
    page?: number
    limit?: number
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return this.request(`/batik-studio/history${queryString}`)
  }

  async saveBatikToGallery(batikId: string) {
    return this.request(`/batik-studio/${batikId}/save`, {
      method: 'POST',
    })
  }

  async downloadBatik(batikId: string) {
    return this.request(`/batik-studio/${batikId}/download`)
  }

  // Utility methods
  get(endpoint: string) {
    return this.request(endpoint)
  }

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient()
