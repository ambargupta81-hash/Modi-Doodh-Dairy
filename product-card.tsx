import { useState, useEffect } from "react";
import { Plus, Star, MessageSquare, X, Send } from "lucide-react";
import { Product, WEIGHT_OPTIONS, LIQUID_OPTIONS } from "@/lib/products";
import { useStore } from "@/store/use-store";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

function StarRating({ value, onChange, readonly }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`transition-colors ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              star <= (hovered || value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewsDialog({ product, open, onClose }: { product: Product; open: boolean; onClose: () => void }) {
  const { user } = useStore();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) fetchReviews();
  }, [open]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/${product.id}`);
      if (res.ok) setReviews(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Please login", description: "You need to be logged in to write a review.", variant: "destructive" });
      return;
    }
    if (rating === 0) {
      toast({ title: "Select a rating", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, userName: user.name, productId: product.id, rating, comment }),
      });
      if (res.ok) {
        toast({ title: "Review submitted!", description: "Thank you for your feedback." });
        setComment("");
        setRating(5);
        fetchReviews();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-5 pb-4 border-b border-border/60 shrink-0">
          <DialogTitle className="text-lg font-display">{product.name} — Reviews</DialogTitle>
          {avgRating && (
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={Math.round(Number(avgRating))} readonly />
              <span className="font-bold text-foreground">{avgRating}</span>
              <span className="text-sm text-muted-foreground">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Write a review */}
          <div className="bg-muted/40 rounded-xl p-4 border border-border/50 space-y-3">
            <p className="text-sm font-semibold text-foreground">Write a Review</p>
            {!user && (
              <p className="text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-2">
                Please <a href="/login" className="text-primary font-semibold underline">login</a> to submit a review.
              </p>
            )}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Your Rating</p>
              <StarRating value={rating} onChange={setRating} readonly={!user} />
            </div>
            <Textarea
              placeholder={user ? "Share your experience with this product..." : "Login to write a review"}
              className="resize-none bg-card text-sm min-h-[80px]"
              value={comment}
              disabled={!user}
              onChange={e => setComment(e.target.value)}
            />
            <Button
              className="w-full h-10 text-sm font-semibold"
              disabled={!user || submitting}
              onClick={handleSubmit}
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>

          <Separator />

          {/* Existing reviews */}
          {loading && <p className="text-center text-sm text-muted-foreground py-4">Loading reviews...</p>}
          {!loading && reviews.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No reviews yet. Be the first to review!</p>
            </div>
          )}
          {reviews.map((review) => (
            <div key={review.id} className="bg-card rounded-xl p-4 border border-border/50 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-sm text-foreground">{review.userName}</p>
                  <StarRating value={review.rating} readonly />
                </div>
                <p className="text-xs text-muted-foreground shrink-0">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              {review.comment && <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const options = product.unitType === 'weight' ? WEIGHT_OPTIONS : LIQUID_OPTIONS;
  const [selectedOption, setSelectedOption] = useState(options[2]);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const { addToCart } = useStore();
  const { toast } = useToast();

  const currentPrice = Math.round((product.basePrice / 1000) * selectedOption.value);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      image: import.meta.env.BASE_URL + product.image.replace(/^\//, ''),
      quantityValue: selectedOption.value,
      quantityUnit: selectedOption.unit,
      price: currentPrice
    });
    toast({
      title: "Added to cart",
      description: `${selectedOption.label} of ${product.name} added.`,
      duration: 2000,
    });
  };

  return (
    <>
      <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg hover:border-primary/30 transition-all duration-300 group bg-card">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={import.meta.env.BASE_URL + product.image.replace(/^\//, '')}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <p className="text-white text-xs line-clamp-2">{product.description}</p>
          </div>
        </div>

        <CardContent className="flex-1 p-4 flex flex-col gap-3">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">Base: ₹{product.basePrice}/{product.unitType === 'weight' ? 'kg' : 'L'}</p>
          </div>

          <div className="mt-auto space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground shrink-0">Qty:</span>
              <Select
                value={selectedOption.label}
                onValueChange={(val) => {
                  const opt = options.find(o => o.label === val);
                  if (opt) setSelectedOption(opt);
                }}
              >
                <SelectTrigger className="h-8 text-xs font-medium border-border/60 bg-muted/30 focus:ring-primary/20">
                  <SelectValue placeholder="Select quantity" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt.label} value={opt.label} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Price</span>
            <span className="font-display font-bold text-xl text-primary">₹{currentPrice}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-3 h-8 text-xs border-border/60 text-muted-foreground hover:text-primary hover:border-primary/50"
              onClick={() => setReviewsOpen(true)}
            >
              <Star className="w-3 h-3 mr-1 fill-amber-400 text-amber-400" /> Reviews
            </Button>
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="rounded-full px-4 hover-elevate active-elevate-2 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </CardFooter>
      </Card>

      <ReviewsDialog product={product} open={reviewsOpen} onClose={() => setReviewsOpen(false)} />
    </>
  );
}
