
import React from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export function Reviews({ reviews }) {
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          <span className="font-semibold text-lg">{averageRating.toFixed(1)}</span>
          <span className="text-muted-foreground">({reviews.length} avaliações)</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{review.user.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(review.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <ThumbsUp className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-muted-foreground">{review.comment}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
