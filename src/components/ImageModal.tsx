"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  fileName?: string;
}

export default function ImageModal({ isOpen, onClose, imageUrl, fileName }: ImageModalProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName || 'image';
    link.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="relative">
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleDownload}
              className="bg-black/50 hover:bg-black/70 text-white"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={onClose}
              className="bg-black/50 hover:bg-black/70 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <img
            src={imageUrl}
            alt={fileName || "Image"}
            className="w-full h-auto max-h-[90vh] object-contain"
          />
          {fileName && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
              <p className="text-sm truncate">{fileName}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}