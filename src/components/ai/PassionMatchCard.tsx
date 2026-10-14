import { Link } from "react-router-dom";
import { Sparkles, MessageCircle, UserPlus, UserCheck, HeartHandshake } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import type { PassionMatch } from "@/types";

interface PassionMatchCardProps {
  match: PassionMatch;
  isFollowing: boolean;
  onFollowToggle?: (e: React.MouseEvent, userId: string) => void;
  onFollow?: (userId: string) => void;
}

export default function PassionMatchCard({
  match,
  isFollowing,
  onFollowToggle,
  onFollow,
}: PassionMatchCardProps) {
  const { user, matchScore, headline, explanation, sharedPassions, complementarySkills } = match;

  const isCollab = complementarySkills.length > 0;

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900 p-5 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all duration-200">
      <div>
        {/* Match Header Badge & Score */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full ${
                matchScore >= 90
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs"
                  : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/50"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              {headline}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
              {matchScore}%
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Match
            </span>
          </div>
        </div>

        {/* User Info */}
        <Link to={`/profile/${user.username}`} className="flex items-center gap-3 mb-3.5 group">
          <Avatar src={user.avatar} name={user.fullName} size="lg" status="online" />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors truncate">
              {user.fullName}
            </p>
            <p className="text-xs text-slate-400">@{user.username}</p>
          </div>
        </Link>

        {/* AI Match Explanation */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-3.5 bg-slate-50/80 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 leading-relaxed font-normal">
          {explanation}
        </p>

        {/* Shared Passions / Complementary Badges */}
        {sharedPassions.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Shared Passions:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sharedPassions.map((passion, i) => (
                <Badge key={i} variant="important" size="xs">
                  {passion}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {complementarySkills.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Skill Synergy:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {complementarySkills.map((skill, i) => (
                <Badge key={i} variant="low" size="xs">
                  + {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 mt-2">
        <Button
          variant={isFollowing ? "outline" : "primary"}
          size="sm"
          className="flex-1 text-xs"
          onClick={(e) => {
            if (onFollowToggle) onFollowToggle(e, user.id);
            else if (onFollow) onFollow(user.id);
          }}
        >
          {isFollowing ? (
            <>
              <UserCheck className="w-3.5 h-3.5 mr-1" /> Following
            </>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5 mr-1" /> Connect
            </>
          )}
        </Button>

        <Link to="/messages" className="flex-1">
          <Button variant="secondary" size="sm" className="w-full text-xs">
            <MessageCircle className="w-3.5 h-3.5 mr-1" /> Message
          </Button>
        </Link>
      </div>
    </div>
  );
}

