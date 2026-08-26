"use client";

import React, { useState, useEffect } from "react";
import { Review } from "@/types";
import { getProductReviewsAction, submitReviewAction } from "@/app/actions/reviewActions";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { Star, ShieldCheck, User } from "lucide-react";
import { twMerge } from "tailwind-merge";

export const ProductReviews: React.FC<{ productId: string }> = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      const res = await getProductReviewsAction(productId);
      if (res.success && res.reviews) {
        setReviews(res.reviews);
      }
      setIsLoading(false);
    };
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Please log in to review.");
    if (comment.length < 5) return alert("Review must be at least 5 characters long.");

    setIsSubmitting(true);
    const res = await submitReviewAction(productId, rating, comment);
    
    if (res.success && res.review) {
      setReviews([res.review, ...reviews]);
      setComment("");
      setRating(5);
      setShowForm(false);
    } else {
      alert("Failed to submit review: " + res.error);
    }
    setIsSubmitting(false);
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="flex flex-col gap-8 mt-16 pt-16 border-t border-border">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-widest text-foreground flex items-center gap-3">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex text-[#D4AF37]">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className={twMerge("w-5 h-5", star <= parseFloat(averageRating) ? "fill-current" : "text-foreground/20")} />
              ))}
            </div>
            <span className="text-foreground/80 font-bold">{averageRating} out of 5</span>
            <span className="text-foreground/40 text-sm">({reviews.length} reviews)</span>
          </div>
        </div>

        {user ? (
          <Button variant="outline" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel Review" : "Write a Review"}
          </Button>
        ) : (
          <div className="text-sm text-foreground/50 bg-black/5 px-4 py-2 rounded-sm border border-border">
            Please log in to write a review.
          </div>
        )}
      </div>

      {showForm && user && (
        <form onSubmit={handleSubmit} className="bg-white p-6 border border-border rounded-sm flex flex-col gap-4">
          <h3 className="font-bold text-[#D4AF37] uppercase tracking-widest text-sm mb-2">Create Review</h3>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-foreground/50">Overall Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star className={twMerge("w-8 h-8 transition-colors", star <= rating ? "text-[#D4AF37] fill-[#D4AF37]" : "text-foreground/20 hover:text-foreground/50")} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-foreground/50">Your Review</label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike about this product?"
              className="bg-[#1A1A1A] border border-border rounded-sm px-4 py-3 text-foreground outline-none focus:border-[#D4AF37] transition-colors resize-none"
            />
          </div>

          <Button type="submit" variant="gold" isLoading={isSubmitting} className="self-start mt-2">
            Submit Review
          </Button>
        </form>
      )}

      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="text-foreground/40 text-sm animate-pulse">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-foreground/40 text-sm py-8 border-t border-border">
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="flex flex-col gap-3 py-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1A1A1A] border border-border rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-foreground/40" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground text-sm flex items-center gap-2">
                      {review.userName}
                      {review.isVerifiedPurchase && (
                        <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-sm">
                          <ShieldCheck className="w-3 h-3" /> Verified Buyer
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-foreground/40">
                      {new Date(review.createdAt || "").toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="flex text-[#D4AF37]">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className={twMerge("w-4 h-4", star <= review.rating ? "fill-current" : "text-foreground/20")} />
                  ))}
                </div>
              </div>
              <p className="text-foreground/70 text-sm leading-relaxed mt-2">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
