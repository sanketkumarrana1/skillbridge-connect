import { AlertTriangle, CheckCircle2, Clock, HelpCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalQuestions: number;
  answeredCount: number;
  remainingSeconds: number;
  onConfirmSubmit: () => void;
}

export function SubmissionDialog({
  open,
  onOpenChange,
  totalQuestions,
  answeredCount,
  remainingSeconds,
  onConfirmSubmit,
}: SubmissionDialogProps) {
  const unansweredCount = totalQuestions - answeredCount;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[#0E1322]/95 text-white sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 grid size-12 place-items-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400">
            <Lock className="size-6" />
          </div>
          <DialogTitle className="text-center font-display text-xl font-bold text-white">
            Submit Assessment?
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-slate-400">
            Once submitted, your answers will be evaluated against your self-declared proficiency
            levels to generate your verified competency score.
          </DialogDescription>
        </DialogHeader>

        <div className="my-3 space-y-2.5 rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="size-4 text-emerald-400" />
              Questions Answered:
            </span>
            <span className="font-bold text-white">{answeredCount}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-300">
              <HelpCircle className="size-4 text-amber-400" />
              Unanswered Questions:
            </span>
            <span
              className={
                unansweredCount > 0 ? "font-bold text-amber-400" : "font-bold text-slate-400"
              }
            >
              {unansweredCount}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-2">
            <span className="flex items-center gap-2 text-slate-300">
              <Clock className="size-4 text-indigo-400" />
              Remaining Time:
            </span>
            <span className="font-bold text-indigo-300">{formattedTime}</span>
          </div>
        </div>

        {unansweredCount > 0 && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] text-amber-200">
            <AlertTriangle className="size-4 shrink-0 text-amber-400" />
            <p>
              You have <span className="font-bold">{unansweredCount} unanswered questions</span>.
              Unanswered questions will receive 0 points.
            </p>
          </div>
        )}

        <DialogFooter className="mt-2 flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs text-slate-400 hover:text-white"
          >
            Review Questions
          </Button>
          <Button
            size="sm"
            onClick={onConfirmSubmit}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]"
          >
            Confirm & Lock Submission
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
