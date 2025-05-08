
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function PhotoGallery({ photos, isPremium }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const { user } = useAuth();
  const canViewPremium = user?.premium || !isPremium;

  const handlePrevious = () => {
    const currentIndex = photos.findIndex(photo => photo.id === selectedPhoto.id);
    const previousIndex = (currentIndex - 1 + photos.length) % photos.length;
    setSelectedPhoto(photos[previousIndex]);
  };

  const handleNext = () => {
    const currentIndex = photos.findIndex(photo => photo.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % photos.length;
    setSelectedPhoto(photos[nextIndex]);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`aspect-square rounded-lg overflow-hidden relative ${
              index === 0 ? "col-span-3" : ""
            }`}
            onClick={() => canViewPremium && setSelectedPhoto(photo)}
          >
            <img
              src={photo.url}
              alt={`Foto ${index + 1}`}
              className={`w-full h-full object-cover transition-opacity duration-200 ${
                !canViewPremium && photo.is_premium ? "opacity-40 blur-sm" : ""
              }`}
            />
            {!canViewPremium && photo.is_premium && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium">Premium Only</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          <div className="relative">
            <motion.img
              key={selectedPhoto?.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={selectedPhoto?.url}
              alt="Foto em tamanho grande"
              className="w-full h-[80vh] object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/20 backdrop-blur-md text-white"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-md text-white ml-4"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-md text-white mr-4"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
