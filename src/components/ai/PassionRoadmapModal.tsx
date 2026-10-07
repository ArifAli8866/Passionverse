import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { ProjectGeneratorService } from "@/services/ai/ProjectGeneratorService";
import type { PassionRoadmap } from "@/types";
import {
  MapPin,
  Sparkles,
  Loader2,
  CheckCircle,
  Clock,
  ArrowRight,
  Copy,
  Users,
  Compass,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface PassionRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  onOpenProjectGenerator?: (topic: string) => void;
}

export default function PassionRoadmapModal({
  isOpen,
  onClose,
  initialTopic = "",
  onOpenProjectGenerator,
}: PassionRoadmapModalProps) {
  const navigate = useNavigate();
  const [topic, setTopic] = useState(initialTopic);
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<PassionRoadmap | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      toast.error("Please enter a passion or skill to learn");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await ProjectGeneratorService.generateRoadmap(topic.trim(), level);
      setRoadmap(result);
      toast.success("Learning roadmap ready!");
    } catch {
      toast.error("Could not generate roadmap. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyRoadmap = () => {
    if (!roadmap) return;
    const text = `🗺️ Passion Roadmap: ${roadmap.topic} (${roadmap.level})
Estimated Duration: ${roadmap.estimatedDuration}

${roadmap.milestones
  .map(
    (m) => `Step ${m.step}: ${m.title} (~${m.estimatedWeeks || 2} weeks)
${m.description}
Skills: ${m.skills.join(", ")}
Projects: ${m.suggestedProjects.join(", ")}`
  )
  .join("\n\n")}`;

    navigator.clipboard.writeText(text);
    toast.success("Roadmap copied to clipboard!");
  };

  const handleFindPeers = (searchQuery: string) => {
    onClose();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                AI Passion Roadmap
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                <Sparkles className="w-3 h-3" />
                Adaptive AI
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Transform any interest into a structured, milestone-driven mastery path.
            </p>
          </div>
        </div>

        {/* Input Controls */}
        <form onSubmit={handleGenerate} className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/40 space-y-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                What passion or skill do you want to learn?
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Generative AI, Robotics, Portrait Photography, Game Dev"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Current Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm"
              size="sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  Generating Roadmap...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Generate Roadmap
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Roadmap Display */}
        {roadmap && (
          <div className="space-y-5">
            {/* Meta bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-purple-50/70 border border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/30">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  {roadmap.topic}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 font-medium">
                  {roadmap.level}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-500" />
                  {roadmap.estimatedDuration}
                </span>
                <button
                  type="button"
                  onClick={handleCopyRoadmap}
                  className="flex items-center gap-1 hover:text-indigo-600 font-medium transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>
            </div>

            {/* Milestones Timeline */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-indigo-100 dark:before:bg-gray-800">
              {roadmap.milestones.map((m) => (
                <div key={m.step} className="relative group">
                  {/* Step Marker */}
                  <div className="absolute -left-6 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white shadow-sm ring-4 ring-white dark:ring-gray-900">
                    {m.step}
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-2.5 hover:border-indigo-200 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {m.title}
                      </h4>
                      {m.estimatedWeeks && (
                        <span className="text-[11px] text-gray-400 font-medium shrink-0">
                          ~{m.estimatedWeeks} weeks
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {m.description}
                    </p>

                    {/* Skills learned */}
                    {m.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {m.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                          >
                            <CheckCircle className="w-3 h-3 text-indigo-500" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Hands-on project milestone */}
                    {m.suggestedProjects.length > 0 && (
                      <div className="pt-1 border-t border-gray-50 dark:border-gray-800 text-xs">
                        <span className="text-[10px] uppercase font-bold text-gray-400">
                          Suggested Project:
                        </span>
                        <div className="mt-1 text-gray-700 dark:text-gray-300 font-medium">
                          🛠️ {m.suggestedProjects.join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Next Steps / Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => handleFindPeers(roadmap.topic)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                <Users className="w-4 h-4" />
                Find peers interested in {roadmap.topic}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {onOpenProjectGenerator && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onClose();
                    onOpenProjectGenerator(roadmap.topic);
                  }}
                  className="text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-500" />
                  Generate Starter Project Idea
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
