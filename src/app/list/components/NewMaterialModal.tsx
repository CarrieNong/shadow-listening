import React, { RefObject } from "react";
import { Button } from "@/components/ui/button";

interface NewMaterialModalProps {
  open: boolean;
  onClose: () => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  fileInputRef: RefObject<HTMLInputElement>;
}

export function NewMaterialModal({ open, onClose, selectedFile, setSelectedFile, fileInputRef }: NewMaterialModalProps) {
  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function openFileDialog() {
    fileInputRef.current?.click();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="bg-background rounded-xl shadow-xl p-8 w-full max-w-xl relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-xl text-muted-foreground hover:text-foreground"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-extrabold mb-6">New Material</h2>
        <div className="flex gap-4 mb-8">
          <div className="flex items-center gap-3 bg-muted rounded-lg p-4">
            <span className="i-lucide-file-text text-2xl" />
            <div>
              <div className="font-semibold">Word Document</div>
              <div className="text-muted-foreground text-sm">Import from a Word document</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-muted rounded-lg p-4">
            <span className="i-lucide-mic text-2xl" />
            <div>
              <div className="font-semibold">Audio File</div>
              <div className="text-muted-foreground text-sm">Import from an audio file</div>
            </div>
          </div>
        </div>
        <div className="font-semibold mb-2">Import File</div>
        <div
          className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center mb-6 min-h-[180px] cursor-pointer hover:border-primary transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={openFileDialog}
        >
          {selectedFile ? (
            <div>
              <div className="font-medium mb-2">{selectedFile.name}</div>
              <div className="text-muted-foreground text-sm mb-2">{(selectedFile.size / 1024).toFixed(1)} KB</div>
              <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setSelectedFile(null); }}>Remove</Button>
            </div>
          ) : (
            <>
              <div className="font-semibold text-lg mb-2">Drag and drop a file here</div>
              <div className="text-muted-foreground mb-4">Or click to browse</div>
              <Button type="button" variant="secondary">Select File</Button>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,audio/*"
            className="hidden"
            onChange={handleFileChange}
            multiple={false}
          />
        </div>
        <div className="flex justify-end">
          <Button disabled={!selectedFile}>Import</Button>
        </div>
      </div>
    </div>
  );
} 