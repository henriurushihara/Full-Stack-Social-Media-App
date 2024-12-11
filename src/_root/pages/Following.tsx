// Following.tsx

import { useEffect, useState } from "react";
import { FollowerDocument, getFollowing } from "@/lib/react-query/queriesAndMutations";
import UserCard from "@/components/shared/UserCard";
import { useParams } from "react-router-dom";

const Following = () => {
  const { id } = useParams(); // ID of the profile being viewed
  const [following, setFollowing] = useState<FollowerDocument[]>([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      if (id) {
        const data = await getFollowing(id); // Fetch following for the profile's user ID
        setFollowing(data);
      }
    };
    fetchFollowing();
  }, [id]);

  return (
    <div>
      <h1 className="xl:text-3xl md:text-2xl text-center font-semibold mb-4">
        Following:
      </h1>
      <div className="following-list grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {following.map((user) => (
          <UserCard key={user.$id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Following;
