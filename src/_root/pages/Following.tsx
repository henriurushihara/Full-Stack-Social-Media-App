import { useEffect, useState } from "react";
import { FollowerDocument, getFollowing } from "@/lib/react-query/queriesAndMutations";
import UserCard from "@/components/shared/UserCard";

interface FollowingProps {
  userId: string;
}

const Following: React.FC<FollowingProps> = ({ userId }) => {
  const [following, setFollowing] = useState<FollowerDocument[]>([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      if (userId) {
        const data = await getFollowing(userId); // Fetch following for the profile's user ID
        if (data) setFollowing(data); // Safeguard against undefined or null responses
      }
    };
    fetchFollowing();
  }, [userId]);

  return (
    <div>
      <h1 className="xl:text-3xl md:text-2xl text-center font-semibold mb-4">
        Following:
      </h1>
      <div className="following-list grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {following.length > 0 ? (
          following.map((user) => (
            <UserCard key={user.$id} user={user} />
          ))
        ) : (
          <p className="text-light-4 text-center w-full">
            This user is not following anyone.
          </p>
        )}
      </div>
    </div>
  );
};

export default Following;
