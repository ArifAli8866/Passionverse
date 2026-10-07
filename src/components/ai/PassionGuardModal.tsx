import { ShieldCheck, AlertTriangle, Sparkles, CheckCircle2, ArrowRight, RefreshCw, X } from "lucide-react";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PassionGuardVerdict } from "@/types";

interface PassionGuardModalProps {
  isOpen: boolean;
  verdict: PassionGuardVerdict | null;
  isEvaluating: boolean;
  onProceed: () => void;
  onRevise: () => void;
  onClose: () => void;
}

export default function PassionGuardModal({
  isOpen,
  verdict,
  isEvaluating,
  onProceed,
  onRevise,
  onClose,
}: PassionGuardModalProps) {
  if (!isOpen) return null;

  const isApproved = verdict?.status === "APPROVED";
  const score = verdict?.relevanceScore || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isApproved ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600" : "bg-amber-100 dark:bg-amber-950/40 text-amber-600"}`}>
              {isApproved ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                PassionGuard AI
                <span className="text-xs font-normal text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                  Post Verification
                </span>
              </h3>
              <p className="text-xs text-gray-400">Ensuring community passion & relevance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Loading State */}
        {isEvaluating ? (
          <div className="py-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Analyzing passion relevance & context...
            </p>
            <p className="text-xs text-gray-400">Verifying taxonomy alignment and project intent</p>
          </div>
        ) : verdict ? (
          <div className="py-5 space-y-5">
            {/* Score Banner */}
            <div className={`rounded-2xl p-4 border ${isApproved ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/40 dark:bg-emerald-950/20" : "border-amber-200 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/20"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold tracking-wide uppercase text-gray-500 dark:text-gray-400">
                  Passion Relevance
                </span>
                <span className={`text-base font-extrabold ${isApproved ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                  {score}%
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isApproved ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-amber-500 to-orange-500"}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2.5 text-xs">
                <span className="text-gray-500">Domain: <strong className="text-gray-800 dark:text-gray-200">{verdict.primaryCategory}</strong></span>
                <span className={`font-semibold px-2 py-0.5 rounded-full ${isApproved ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"}`}>
                  {verdict.status === "APPROVED" ? "APPROVED" : "NEEDS REVISION"}
                </span>
              </div>
            </div>

            {/* Detected Topics */}
            {verdict.detectedTopics && verdict.detectedTopics.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Detected Passions & Skills:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {verdict.detectedTopics.map((topic, i) => (
                    <Badge key={i} variant={isApproved ? "primary" : "default"} size="sm">
                      ✨ {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback Message */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-gray-800">
              <p>{verdict.feedback}</p>
            </div>

            {/* Suggestions list if revision needed */}
            {!isApproved && verdict.suggestions && verdict.suggestions.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">How to improve this post:</p>
                {verdict.suggestions.map((sug, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span>{sug}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button variant="ghost" size="sm" onClick={onRevise}>
            Edit Content
          </Button>

          <div className="flex items-center gap-2">
            {!isApproved && (
              <button
                type="button"
                onClick={onProceed}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline px-2 py-1"
                title="Post anyway with low relevance"
              >
                Post anyway
              </button>
            )}

            <Button
              variant={isApproved ? "primary" : "secondary"}
              size="md"
              onClick={isApproved ? onProceed : onRevise}
            >
              {isApproved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Publish Post
                </>
              ) : (
                <>
                  Refine Post
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
