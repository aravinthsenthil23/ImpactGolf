'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, CheckCircle2, Loader2, X, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function UploadScoreCardDialog() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
      } else {
        toast.error('Please upload an image or PDF file')
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return
    
    setIsUploading(true)
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsUploading(false)
    setIsOpen(false)
    setFile(null)
    toast.success('Score card uploaded successfully! Our team will verify it shortly.')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-accent/30 hover:bg-accent/10 text-accent gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Score Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Score Card</DialogTitle>
          <DialogDescription>
            Upload a clear photo or PDF of your official score card for verification.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!file ? (
            <div 
              className={cn(
                "border-2 border-dashed border-border rounded-2xl p-10 transition-all duration-200",
                "flex flex-col items-center justify-center gap-4 text-center hover:bg-muted/30 hover:border-primary/50"
              )}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG or PDF (max. 10MB)</p>
              </div>
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept="image/*,.pdf"
              />
            </div>
          ) : (
            <div className="bg-muted/50 border border-border rounded-2xl p-6 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={() => setFile(null)}
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 bg-accent/5 border border-accent/20 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-accent flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Verification usually takes 2-4 hours. You will receive an email once your win is confirmed.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            className="w-full bg-primary hover:bg-primary/90 text-white py-6"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Confirm & Upload
              </>
            )}
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setIsOpen(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
