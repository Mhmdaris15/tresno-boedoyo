'use client'

import { useState, useEffect } from 'react'
import { BatikService } from '@/services/batikService'
import { BatikComment } from '@/types/batik'

interface CommentsProps {
  galleryId: string
  initialCommentsCount?: number
}

export default function Comments({ galleryId, initialCommentsCount = 0 }: CommentsProps) {
  const [comments, setComments] = useState<BatikComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [totalComments, setTotalComments] = useState(initialCommentsCount)

  useEffect(() => {
    fetchComments(1, true)
  }, [galleryId])

  const fetchComments = async (pageNum: number = 1, reset: boolean = false) => {
    try {
      if (reset) setLoading(true)
      
      const response = await BatikService.getComments(galleryId, pageNum, 10)
      
      if (reset) {
        setComments(response.data)
      } else {
        setComments(prev => [...prev, ...response.data])
      }
      
      setTotalComments(response.total)
      setHasMore(pageNum < response.totalPages)
      setPage(pageNum)
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch comments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      setError('')
      
      const comment = await BatikService.addComment(galleryId, newComment.trim())
      setComments(prev => [comment, ...prev])
      setNewComment('')
      setTotalComments(prev => prev + 1)
      
    } catch (err: any) {
      setError(err.message || 'Failed to add comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadMoreComments = () => {
    if (!loading && hasMore) {
      fetchComments(page + 1, false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes}m ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours}h ago`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days}d ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          Comments ({totalComments})
        </h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-3">
        <div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this pattern..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            maxLength={500}
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between mt-1">
            <div className="text-xs text-gray-500">
              {newComment.length}/500 characters
            </div>
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="px-4 py-1.5 text-sm font-medium text-white bg-heritage-600 hover:bg-heritage-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6z"></path>
                  </svg>
                  Posting...
                </div>
              ) : (
                'Post Comment'
              )}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading && comments.length === 0 ? (
          // Loading skeleton
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          // Empty state
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No comments yet</p>
            <p className="text-sm">Be the first to share your thoughts!</p>
          </div>
        ) : (
          // Comments
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {comment.user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              
              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {comment.user.name}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center">
            <button
              onClick={loadMoreComments}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-heritage-600 hover:text-blue-800 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load more comments'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
