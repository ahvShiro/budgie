import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from '@/components/ui/avatar.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx';
import { getInitial } from '@/lib/formatters.ts';

const MAX_AVATARS = 3;

interface MemberAvatarsProps {
  members: string[];
}

export const MemberAvatars = ({ members }: MemberAvatarsProps) => (
  <AvatarGroup>
    {members.slice(0, MAX_AVATARS).map((member, i) => (
      <Tooltip key={i}>
        <TooltipTrigger asChild>
          <Avatar className="size-6">
            <AvatarFallback>{getInitial(member)}</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>{member}</TooltipContent>
      </Tooltip>
    ))}
    {members.length > MAX_AVATARS && (
      <AvatarGroupCount className="size-6 text-xs">
        +{members.length - MAX_AVATARS}
      </AvatarGroupCount>
    )}
  </AvatarGroup>
);
