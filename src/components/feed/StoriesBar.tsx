import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/store/auth";
import { Plus, ChevronRight, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

interface Story {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  storyImage?: string;
  caption?: string;
}

const mockStories: Story[] = [
  {
    id: "1",
    name: "X_AE_A-13",
    username: "x_ae-23b",
    caption: "Working on the new modern SaaS design system components!",
  },
  {
    id: "2",
    name: "Mai Senpai",
    username: "maisenpai",
    caption: "Exploring interactive AI prompts and generative UI layouts.",
  },
  {
    id: "3",
    name: "Taylor Swift",
    username: "saylortwift",
    caption: "Acoustic recording session snippet for my music passion project.",
  },
  {
    id: "4",
    name: "John Doe",
    username: "johndoe",
    caption: "3D Blender render experiment with glassmorphism lighting.",
  },
  {
    id: "5",
    name: "Mary Jane",
    username: "maryjane2",
    caption: "Urban photography walk in Tokyo at dusk.",
  },
  {
    id: "6",
    name: "Barack Obama",
    username: "obama21",
    caption: "Mentorship is the key to collective youth empowerment.",
  },
  {
    id: "7",
    name: "Alex Designer",
    username: "x_ae-21",
    caption: "Kanban board redesign in Figma is finally completed!",
  },
];

export function StoriesBar() {
  const { user } = useAuth();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const handleAddStory = () => {
    toast.success("Story creator opened! Share a quick passion moment.");
  };

  return (
    <>
      <div className="relative rounded-3xl border border-slate-200/80 bg-white p-3.5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {/* Add Your Story */}
          <div
            onClick={handleAddStory}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group select-none"
          >
            <div className="relative p-0.5">
              <Avatar
                src={user?.avatar || undefined}
                name={user?.fullName || "You"}
                size="lg"
                className="group-hover:scale-105 transition-transform"
              />
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-2xs group-hover:scale-110 transition-transform">
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 max-w-[64px] truncate">
              Your Story
            </span>
          </div>

          {/* Stories List (SlothUI Reference 2 style) */}
          {mockStories.map((story) => (
            <div
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group select-none"
            >
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 group-hover:scale-105 transition-transform shadow-2xs">
                <div className="p-0.5 bg-white dark:bg-slate-900 rounded-full">
                  <Avatar
                    src={story.avatar}
                    name={story.name}
                    size="lg"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 max-w-[68px] truncate group-hover:text-indigo-600 transition-colors">
                {story.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Story Preview Modal */}
      {selectedStory && (
        <Modal
          isOpen={!!selectedStory}
          onClose={() => setSelectedStory(null)}
          title={selectedStory.name}
          description={`@${selectedStory.username}`}
          size="sm"
        >
          <div className="space-y-4">
            <div className="h-64 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex flex-col justify-end p-5 text-white shadow-inner">
              <div className="bg-black/30 backdrop-blur-md p-3.5 rounded-xl border border-white/20">
                <p className="text-xs leading-relaxed font-medium">
                  "{selectedStory.caption}"
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-white/80">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" /> Passion Story
                  </span>
                  <span>Just now</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  toast.success(`Liked ${selectedStory.name}'s story!`);
                  setSelectedStory(null);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-xs hover:bg-indigo-500 transition-colors cursor-pointer"
              >
                Send Reaction ❤️
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
