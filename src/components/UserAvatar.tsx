import { Pick } from "@prisma/client/runtime/library";
import { type AvatarProps } from "@radix-ui/react-avatar";
import { type User } from "next-auth";
import Image from "next/image";
import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Props extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar = ({ user, ...props }: Props) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative w-full h-full aspect-square">
          <Image
            fill
            src={user.image}
            alt="profile picture"
            referrerPolicy="no-referrer"
            sizes="(max-width: 50px) 1vw, (max-width: 50px) 1vw, 1vw"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
