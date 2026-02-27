import { useState, useEffect, useCallback, useRef } from 'react'
import * as caseStudiesStore from '@/lib/case-studies-store'
import type { CaseStudy } from '@/lib/case-studies-store'
import { useAsyncData, useFileUpload } from '@/hooks'
import type { CaseStudyFormData } from './CaseStudyFormCard'

const INITIAL_FORM: CaseStudyFormData = {
  brand: '',
  title: '',
  description: '',
  metric: '',
  imageUrl: '',
}

export function useCaseStudies(toast: (type: 'success' | 'error', msg: string) => void) {
  const { data: items, loading, error, refresh: load } = useAsyncData(
    caseStudiesStore.getAllCaseStudies,
  )
  const {
    fileInputRef: addFileRef,
    preview: addPreview,
    selectedFile: addFile,
    handleFileChange: addFileChange,
    clearFile: clearAddFile,
  } = useFileUpload()
  const {
    fileInputRef: editFileRef,
    preview: editPreview,
    selectedFile: editFile,
    handleFileChange: editFileChange,
    clearFile: clearEditFile,
  } = useFileUpload()
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CaseStudyFormData>(INITIAL_FORM)
  const [editForm, setEditForm] = useState<CaseStudyFormData>(INITIAL_FORM)
  const oldImageUrlForReplaceRef = useRef<string | null>(null)

  useEffect(() => {
    if (error) toast('error', error.message)
  }, [error, toast])

  const uploadAndSetAddImage = useCallback(
    async (file: File) => {
      setUploadingImage(true)
      try {
        const url = await caseStudiesStore.uploadCaseStudyImage(file)
        setForm((f) => ({ ...f, imageUrl: url }))
        clearAddFile()
        toast('success', 'התמונה הועלתה')
      } catch (err) {
        toast('error', err instanceof Error ? err.message : 'שגיאה בהעלאת התמונה')
      } finally {
        setUploadingImage(false)
      }
    },
    [clearAddFile, toast],
  )

  const uploadAndSetEditImage = useCallback(
    async (file: File, oldImageUrl?: string | null) => {
      setUploadingImage(true)
      try {
        if (oldImageUrl) await caseStudiesStore.deleteCaseStudyImage(oldImageUrl)
        const url = await caseStudiesStore.uploadCaseStudyImage(file)
        setEditForm((f) => ({ ...f, imageUrl: url }))
        clearEditFile()
        toast('success', 'התמונה הועלתה')
      } catch (err) {
        toast('error', err instanceof Error ? err.message : 'שגיאה בהעלאת התמונה')
      } finally {
        setUploadingImage(false)
      }
    },
    [clearEditFile, toast],
  )

  useEffect(() => {
    if (addFile) uploadAndSetAddImage(addFile)
  }, [addFile, uploadAndSetAddImage])

  useEffect(() => {
    if (editFile) {
      const oldUrl = oldImageUrlForReplaceRef.current
      uploadAndSetEditImage(editFile, oldUrl)
      oldImageUrlForReplaceRef.current = null
    }
  }, [editFile, uploadAndSetEditImage])

  const handleEditFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      oldImageUrlForReplaceRef.current = editForm.imageUrl || null
      editFileChange(e)
    },
    [editForm.imageUrl, editFileChange],
  )

  const handleAdd = useCallback(async () => {
    if (
      !form.brand.trim() ||
      !form.title.trim() ||
      !form.description.trim() ||
      !form.metric.trim() ||
      !form.imageUrl.trim()
    ) {
      toast('error', 'מלאו את כל השדות')
      return
    }
    setSaving(true)
    try {
      await caseStudiesStore.addCaseStudy({
        ...form,
        order: (items ?? []).length,
      })
      setForm(INITIAL_FORM)
      setAdding(false)
      load()
      toast('success', 'הקמפיין נוסף')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה בהוספה')
    } finally {
      setSaving(false)
    }
  }, [form, items, load, toast])

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('למחוק?')) return
      setSaving(true)
      try {
        const item = (items ?? []).find((c) => c.id === id)
        await caseStudiesStore.deleteCaseStudy(id, item?.imageUrl)
        load()
        toast('success', 'נמחק')
      } catch (err) {
        toast('error', err instanceof Error ? err.message : 'שגיאה במחיקה')
      } finally {
        setSaving(false)
      }
    },
    [items, load, toast],
  )

  const startEdit = useCallback((c: CaseStudy) => {
    setEditingId(c.id)
    setEditForm({
      brand: c.brand,
      title: c.title,
      description: c.description,
      metric: c.metric,
      imageUrl: c.imageUrl,
    })
  }, [])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
    clearEditFile()
  }, [clearEditFile])

  const handleSaveEdit = useCallback(async () => {
    if (!editingId) return
    const { brand, title, description, metric, imageUrl } = editForm
    if (
      !brand.trim() ||
      !title.trim() ||
      !description.trim() ||
      !metric.trim() ||
      !imageUrl.trim()
    ) {
      toast('error', 'מלאו את כל השדות')
      return
    }
    setSaving(true)
    try {
      await caseStudiesStore.updateCaseStudy(editingId, editForm)
      setEditingId(null)
      load()
      toast('success', 'נשמר')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה בשמירה')
    } finally {
      setSaving(false)
    }
  }, [editingId, editForm, load, toast])

  return {
    items,
    loading,
    adding,
    saving,
    uploadingImage,
    editingId,
    form,
    setForm,
    editForm,
    setEditForm,
    addFileRef,
    addPreview,
    editFileRef,
    editPreview,
    setAdding,
    clearAddFile,
    handleAddFileChange: addFileChange,
    handleEditFileChange,
    handleAdd,
    handleDelete,
    startEdit,
    cancelEdit,
    handleSaveEdit,
    load,
  }
}
