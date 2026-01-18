// hooks/useReportCards.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { ReportCard, ReportCardFormData } from '@/types/report-card'
import toast from 'react-hot-toast'

interface UseReportCardsOptions {
  bookingId?: string
  petId?: string
  autoFetch?: boolean
}

export function useReportCards(options: UseReportCardsOptions = {}) {
  const { bookingId, petId, autoFetch = true } = options
  
  const [reports, setReports] = useState<ReportCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })

  const fetchReports = useCallback(async (page = 1) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' })
      if (bookingId) params.set('bookingId', bookingId)
      if (petId) params.set('petId', petId)
      
      const res = await fetch(`/api/report-cards?${params}`, { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to fetch report cards')
      
      const data = await res.json()
      if (data.success) {
        setReports(data.data.reports)
        setPagination(data.data.pagination)
      } else {
        throw new Error(data.error || 'Failed to fetch report cards')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [bookingId, petId])

  const getReport = useCallback(async (id: string): Promise<ReportCard | null> => {
    try {
      const res = await fetch(`/api/report-cards/${id}`, { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to fetch report card')
      const data = await res.json()
      if (data.success) return data.data
      throw new Error(data.error)
    } catch (err: any) {
      toast.error(err.message)
      return null
    }
  }, [])

  const createReport = useCallback(async (formData: ReportCardFormData): Promise<ReportCard | null> => {
    try {
      const res = await fetch('/api/report-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Report card created!')
        await fetchReports()
        return data.data
      }
      throw new Error(data.error)
    } catch (err: any) {
      toast.error(err.message)
      return null
    }
  }, [fetchReports])

  const updateReport = useCallback(async (id: string, formData: Partial<ReportCardFormData>): Promise<ReportCard | null> => {
    try {
      const res = await fetch(`/api/report-cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Report card updated!')
        await fetchReports()
        return data.data
      }
      throw new Error(data.error)
    } catch (err: any) {
      toast.error(err.message)
      return null
    }
  }, [fetchReports])

  const sendReport = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/report-cards/${id}/send`, { method: 'POST', credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        toast.success('Report card sent!')
        await fetchReports()
        return true
      }
      throw new Error(data.error)
    } catch (err: any) {
      toast.error(err.message)
      return false
    }
  }, [fetchReports])

  const deleteReport = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/report-cards/${id}`, { method: 'DELETE', credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        toast.success('Report card deleted')
        await fetchReports()
        return true
      }
      throw new Error(data.error)
    } catch (err: any) {
      toast.error(err.message)
      return false
    }
  }, [fetchReports])

  useEffect(() => {
    if (autoFetch) fetchReports()
  }, [autoFetch, fetchReports])

  return { reports, loading, error, pagination, fetchReports, getReport, createReport, updateReport, sendReport, deleteReport }
}

export default useReportCards
