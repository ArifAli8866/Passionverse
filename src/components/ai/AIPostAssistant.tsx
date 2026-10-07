import { useState } from "react";
import { Sparkles, Wand2, Hash, RefreshCw, Check } from "lucide-react";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIService } from "@/services/ai/AIService";
import toast from "react-hot-toast";

interface AIPostAssistantProps {
  content: string;
  type: string;
  techStack?: string;
  onApplyContent: (newContent: string) => void;
  onApplyTechStack?: (newStack: string) => void;
  onAppendTags?: (tags: string) => void;
}

export default function AIPostAssistant({
  content,
  type,
  onApplyContent,
  onAppendTags,
}: AIPostAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [hasEnhanced, setHasEnhanced] = useState(false);

  const handleEnhance = async () => {
    if (!content.trim()) {
      toast.error("Write a draft first to enhance it!");
      return;
    }
    setIsEnhancing(true);
    try {
      const polished = await AIService.enhanceCaption(content, type);
      if (polished) {
        onApplyContent(polished);
        setHasEnhanced(true);
        toast.success("Caption polished by AI!");
      }
    } catch {
      toast.error("Could not enhance caption right now");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateTags = () => {
    if (!content.trim()) {
      toast.error("Write something first to extract topics!");
      return;
    }
    const tags = AIService.suggestTags(content, type, []);
    setSuggestedTags(tags);
  };

  const handleAddTag = (tag: string) => {
    if (onAppendTags) {
      onAppendTags(` #${tag}`);
      setSuggestedTags((prev) => prev.filter((t) => t !== tag));
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-3.5 dark:border-indigo-900/30 dark:bg-indigo-950/20 transition-all">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span>AI Post Assistant (Optional)</span>
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {isOpen ? "Hide" : "Show suggestions"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-900/40 space-y-3 animate-fade-in">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleEnhance}
              isLoading={isEnhancing}
              className="text-xs py-1.5 h-auto bg-white dark:bg-gray-900"
            >
              {hasEnhanced ? <Check className="w-3 h-3 text-emerald-500 mr-1" /> : <Wand2 className="w-3 h-3 text-indigo-500 mr-1" />}
              {hasEnhanced ? "Polished!" : "Enhance Draft"}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateTags}
              className="text-xs py-1.5 h-auto bg-white dark:bg-gray-900"
            >
              <Hash className="w-3 h-3 text-indigo-500 mr-1" />
              Suggest Hashtags
            </Button>
          </div>

          {/* Suggested tags chips */}
          {suggestedTags.length > 0 && (
            <div className="space-y-1">
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Click to add to post:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="cursor-pointer"
                  >
                    <Badge variant="primary" size="sm">
                      + #{tag}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
