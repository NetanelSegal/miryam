import { Plus } from 'lucide-react'
import { Heading, Text, Button, useToast, LoadingState } from '@/components/ui'
import { useCaseStudies, CaseStudyFormCard, CaseStudyListItem } from './case-studies'

export function AdminCaseStudies() {
  const { toast } = useToast()
  const {
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
    handleAddFileChange,
    handleEditFileChange,
    handleAdd,
    handleDelete,
    startEdit,
    cancelEdit,
    handleSaveEdit,
  } = useCaseStudies(toast)

  if (loading) return <LoadingState />

  return (
    <div className="space-y-6">
      <Heading level={4} className="text-white">
        קמפיינים (Case Studies)
      </Heading>
      <Text variant="muted" size="sm" className="block mb-4">
        נשלפים לאתר בדף הבית. הזינו נתונים אמיתיים.
      </Text>

      {adding && (
        <CaseStudyFormCard
          form={form}
          setForm={setForm}
          fileInputRef={addFileRef}
          preview={addPreview}
          uploading={uploadingImage}
          saving={saving}
          onFileChange={handleAddFileChange}
          onSubmit={handleAdd}
          onCancel={() => {
            setAdding(false)
            clearAddFile()
          }}
          submitLabel="הוספה"
        />
      )}

      {!adding && (
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setAdding(true)}
        >
          קמפיין חדש
        </Button>
      )}

      <div className="space-y-2">
        {(items ?? []).map((c) => (
          <CaseStudyListItem
            key={c.id}
            item={c}
            isEditing={editingId === c.id}
            editForm={editForm}
            setEditForm={setEditForm}
            editFileRef={editFileRef}
            editPreview={editPreview}
            uploading={uploadingImage}
            saving={saving}
            onEditFileChange={handleEditFileChange}
            onStartEdit={() => startEdit(c)}
            onCancelEdit={cancelEdit}
            onSaveEdit={handleSaveEdit}
            onDelete={() => handleDelete(c.id)}
          />
        ))}
      </div>
    </div>
  )
}
