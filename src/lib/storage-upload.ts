import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'
import { compressImage } from './image'

/** Delete a file from Storage by its download URL. No-op if URL is not a Firebase Storage URL. */
export async function deleteStorageFileByUrl(url: string): Promise<void> {
  if (!url || !url.includes('firebasestorage.googleapis.com')) return
  try {
    const storageRef = ref(storage, url)
    await deleteObject(storageRef)
  } catch {
    /* File may not exist; ignore */
  }
}

/** Upload image to Storage. Compresses (800px, 0.7 quality, 10MB max) then uploads to {path}/{uuid}. */
export async function uploadImage(path: string, file: File): Promise<string> {
  const dataUrl = await compressImage(file)
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  const id = crypto.randomUUID()
  const storageRef = ref(storage, `${path}/${id}`)
  await uploadBytes(storageRef, blob, {
    contentType: 'image/jpeg',
    contentDisposition: 'inline',
  })
  return getDownloadURL(storageRef)
}
