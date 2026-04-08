import { Suspense } from 'react'
import ScanForm from './ScanForm'

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-400">Yükleniyor...</div>}>
      <ScanForm />
    </Suspense>
  )
}
