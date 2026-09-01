import { useMemo, useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Textarea } from "@/app/components/ui/textarea";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { activeEvaluationCampaign } from "@/app/data/evaluation";
import { showSuccessToast } from "@/app/utils/toastNotification";

type EvaluationFeedbackModalProps = {
  userRole: "parent" | "student";
  userId?: string;
};

export function EvaluationFeedbackModal({ userRole, userId }: EvaluationFeedbackModalProps) {
  const storageKey = useMemo(
    () => `evaluation-feedback:${activeEvaluationCampaign.title}:${userRole}:${userId || "demo"}`,
    [userRole, userId]
  );
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return activeEvaluationCampaign.status === "Ongoing" && window.localStorage.getItem(storageKey) !== "submitted";
  });
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [comment, setComment] = useState("");
  const [showCommentError, setShowCommentError] = useState(false);

  const isNegativeWithoutComment = rating === "down" && comment.trim().length === 0;

  const handleSubmit = () => {
    if (!rating) return;

    if (isNegativeWithoutComment) {
      setShowCommentError(true);
      return;
    }

    window.localStorage.setItem(storageKey, "submitted");
    setOpen(false);
    showSuccessToast("Evaluation submitted", "Thank you for helping the school improve.");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>{activeEvaluationCampaign.title}</DialogTitle>
          <DialogDescription>
            {activeEvaluationCampaign.question}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={rating === "up" ? "default" : "outline"}
              className="h-24 flex-col gap-2"
              onClick={() => {
                setRating("up");
                setShowCommentError(false);
              }}
            >
              <ThumbsUp className="h-7 w-7" />
              Yes, it helped
            </Button>
            <Button
              type="button"
              variant={rating === "down" ? "destructive" : "outline"}
              className="h-24 flex-col gap-2"
              onClick={() => setRating("down")}
            >
              <ThumbsDown className="h-7 w-7" />
              Needs improvement
            </Button>
          </div>

          {rating === "down" && (
            <div className="space-y-2">
              <Textarea
                value={comment}
                onChange={(event) => {
                  setComment(event.target.value);
                  setShowCommentError(false);
                }}
                placeholder="Please tell us what needs improvement."
                className="min-h-28"
              />
              {showCommentError && (
                <p className="text-sm font-medium text-red-600">
                  Please add a short note when choosing thumbs down.
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!rating}>
            Submit Evaluation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
