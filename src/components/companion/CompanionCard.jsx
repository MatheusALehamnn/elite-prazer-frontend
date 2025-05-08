import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Star, MapPin, Shield, Crown } from "lucide-react";

export function CompanionCard({ companion, onFavorite, onChat }) {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push(`/companion/${companion.id}`);
  };

  const handleViewProfile = (e) => {
    e.stopPropagation();
    router.push(`/companion/${companion.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <img
          src={companion.photos?.find(p => p.is_primary)?.url || "/placeholder.jpg"}
          alt={companion.name}
          className="w-full aspect-[3/4] object-cover transition-transform duration-300 hover:scale-105"
        />
        {companion.premium && (
          <Badge className="absolute top-4 right-4 bg-yellow-500/80 text-white">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white"
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(companion.id);
          }}
        >
          <Heart
            className={`h-4 w-4 ${companion.isFavorite ? "fill-current text-red-500" : ""}`}
          />
        </Button>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-semibold">{companion.name}</h3>
              {companion.verified && (
                <Shield className="h-4 w-4 text-primary" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{companion.location}</span>
            </div>
          </div>
          {companion.rating && (
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-medium">{companion.rating}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            className="w-full"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onChat(companion);
            }}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Conversar
          </Button>
          <Button 
            className="w-full premium-gradient"
            onClick={handleViewProfile}
          >
            Ver Perfil
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
