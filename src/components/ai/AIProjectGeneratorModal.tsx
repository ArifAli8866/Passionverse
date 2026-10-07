import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Rocket, Clock, Code, BookOpen, Layers, Users, X, RefreshCw, ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectGeneratorService } from "@/services/ai/ProjectGeneratorService";
import type { GeneratedProjectIdea } from "@/types";
import toast from "react-hot-toast";

interface AIProjectGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPassions?: string[];
}

export default function AIProjectGeneratorModal({
  isOpen,
  onClose,
  defaultPassions = [],
}: AIProjectGeneratorModalProps) {
  const navigate = useNavigate();
  const [passionsInput, setPassionsInput] = useState(defaultPassions.join(", ") || "AI, Robotics");
  const [skillLevel, setSkillLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [availableHours, setAvailableHours] = useState(5);
  const [preferredTech, setPreferredTech] = useState("");
  const [goal, setGoal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectIdea, setProjectIdea] = useState<GeneratedProjectIdea | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const passions = passionsInput
      .split(/[,/]+/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (passions.length === 0) {
      toast.error("Please enter at least one passion or hobby!");
      return;
    }

    setIsGenerating(true);
    try {
      const idea = await ProjectGeneratorService.generateProjectIdea({
        passions,
        skillLevel,
        availableHoursPerWeek: availableHours,
        preferredTechnologies: preferredTech ? preferredTech.split(/[,/]+/).map((t) => t.trim()) : [],
        goal: goal.trim() || undefined,
      });
      setProjectIdea(idea);
    } catch {
      toast.error("Could not generate project idea right now");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFindCollaborators = () => {
    if (!projectIdea) return;
    onClose();
    const primarySkill = projectIdea.technologies[0] || projectIdea.title;
    navigate(`/search?q=${encodeURIComponent(primarySkill)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200 dark:shadow-none">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg flex items-center gap-2">
                AI Project Generator
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                  Feature 5
                </span>
              </h3>
              <p className="text-xs text-gray-400">Turn your passions into concrete roadmapped projects</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form or Result View */}
        {!projectIdea ? (
          <form onSubmit={handleGenerate} className="py-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                Your Passions & Interests *
              </label>
              <input
                type="text"
                value={passionsInput}
                onChange={(e) => setPassionsInput(e.target.value)}
                placeholder="e.g. AI, Robotics, Computer Vision, Photography"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  Skill Level
                </label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as any)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  Time: {availableHours} hrs / week
                </label>
                <input
                  type="range"
                  min="2"
                  max="25"
                  step="1"
                  value={availableHours}
                  onChange={(e) => setAvailableHours(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer mt-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                Preferred Technologies (Optional)
              </label>
              <input
                type="text"
                value={preferredTech}
                onChange={(e) => setPreferredTech(e.target.value)}
                placeholder="e.g. Python, OpenCV, Arduino, React"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                Personal Goal (Optional)
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Build an autonomous prototype for my portfolio"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isGenerating}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Project Roadmap
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-5 space-y-5 animate-fade-in">
            {/* Generated Project Overview */}
            <div className="rounded-2xl p-5 border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:border-indigo-900/40 dark:from-indigo-950/20 dark:to-purple-950/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {projectIdea.difficulty} Project Idea
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  {projectIdea.estimatedEffort}
                </span>
              </div>
              <h4 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                {projectIdea.title}
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {projectIdea.description}
              </p>
            </div>

            {/* Tech Stack & Skills */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1">
                  <Code className="w-3.5 h-3.5 text-indigo-500" /> Technologies:
                </p>
                <div className="flex flex-wrap gap-1">
                  {projectIdea.technologies.map((t, i) => (
                    <Badge key={i} variant="primary" size="sm">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-purple-500" /> Skills to Learn:
                </p>
                <div className="flex flex-wrap gap-1">
                  {projectIdea.skillsToLearn.map((s, i) => (
                    <Badge key={i} variant="default" size="sm">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Step-by-Step Roadmap */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-500" /> Step-by-Step Implementation Roadmap:
              </p>
              <div className="space-y-2">
                {projectIdea.roadmap.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-300"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Collaborator Roles */}
            {projectIdea.collaboratorRoles.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-500" /> Suggested Collaborator Roles:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {projectIdea.collaboratorRoles.map((role, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium"
                    >
                      🤝 {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button variant="ghost" size="sm" onClick={() => setProjectIdea(null)}>
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Generate Another
              </Button>

              <Button variant="primary" size="md" onClick={handleFindCollaborators}>
                Find Collaborators
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
