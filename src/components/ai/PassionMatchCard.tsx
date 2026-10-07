import { Link } from "react-router-dom";
import { Sparkles, MessageCircle, UserPlus, UserCheck, HeartHandshake } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import type { PassionMatch } from "@/types";

interface PassionMatchCardProps {
  match: PassionMatch;
  isFollowing: boolean;
  onFollowToggle: (e: React.MouseEvent, userId: string) => void;
}

export default function PassionMatchCard({
  match,
  isFollowing,
  onFollowToggle,
}: PassionMatchCardProps) {
  const { user, matchScore, headline, explanation, sharedPassions, complementarySkills } = match;

  const isCollab = complementarySkills.length > 0;

  return (
    <Card hover className="p-5 flex flex-col justify-between border-indigo-50 dark:border-indigo-900/30 transition-all hover:border-indigo-200 dark:hover:border-indigo-800">
      <div>
        {/* Match Header Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                matchScore >= 90
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xs"
                  : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              {headline}
            </span>
          </div>
          {isCollab && (
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <HeartHandshake className="w-3 h-3" />
              Skill Synergy
            </span>
          )}
        </div>

        {/* User Info */}
        <Link to={`/profile/${user.username}`} className="flex items-center gap-3 mb-3 group">
          <Avatar src={user.avatar} name={user.fullName} size="lg" />
          <div className="min-w-0">
            <p className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors truncate">
              {user.fullName}
            </p>
            <p className="text-xs text-gray-400">@{user.username}</p>
          </div>
        </Link>

        {/* AI Match Explanation */}
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 bg-gray-50 dark:bg-gray-800/60 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 leading-relaxed">
          {explanation}
        </p>

        {/* Shared Passions / Complementary Badges */}
        {sharedPassions.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Shared Passions:
            </p>
            <div className="flex flex-wrap gap-1">
              {sharedPassions.map((passion, i) => (
                <Badge key={i} variant="primary" size="sm">
                  {passion}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {complementarySkills.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Brings to Table:
            </p>
            <div className="flex flex-wrap gap-1">
              {complementarySkills.map((skill, i) => (
                <Badge key={i} variant="default" size="sm" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  + {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800 mt-2">
        <Button
          variant={isFollowing ? "outline" : "primary"}
          size="sm"
          className="flex-1 text-xs"
          onClick={(e) => onFollowToggle(e, user.id)}
        >
          {isFollowing ? (
            <>
              <UserCheck className="w-3.5 h-3.5 mr-1" /> Following
            </>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5 mr-1" /> Follow
            </>
          )}
        </Button>

        <Link to="/messages" className="flex-1">
          <Button variant="secondary" size="sm" className="w-full text-xs">
            <MessageCircle className="w-3.5 h-3.5 mr-1" /> Message
          </Button>
        </Link>
      </div>
    </Card>
  );
}
