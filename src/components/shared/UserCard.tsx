import { Models } from "appwrite";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser } from "@/lib/react-query/queriesAndMutations";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  const navigate = useNavigate();
  const { user: currentUser } = useUserContext();
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      // Ensure the query keys are correctly typed for React Query
      queryClient.invalidateQueries({ queryKey: ["user", currentUser.id] }); // Specify query keys as an array
      queryClient.invalidateQueries({ queryKey: ["user", user.$id] });
    },
    onError: (error) => {
      console.error("Error following user:", error);
    },
  });

  const handleNavigate = () => {
    navigate(`/profile/${user.$id}`);
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to profile on follow button click
    followMutation.mutate({
      userId: currentUser?.id || "", // Use `userId` for follow mutation
      targetUserId: user.$id, // Use `targetUserId` for follow mutation
    });
  };

  return (
    <div
      onClick={handleNavigate}
      className="user-card cursor-pointer p-4 bg-dark-2 rounded-lg shadow hover:bg-dark-3 transition-all"
    >
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt={user.name}
        className="w-16 h-16 rounded-full mb-2"
      />
      <p className="text-primary font-bold">{user.name}</p>
      <p className="text-light-3">@{user.username}</p>

      {currentUser?.id !== user.$id && (
        <Button
          onClick={handleFollow}
          className="mt-2 bg-primary-500 text-white"
        >
          Follow
        </Button>
      )}
    </div>
  );
};

export default UserCard;
