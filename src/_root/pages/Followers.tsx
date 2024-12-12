import { useEffect, useState } from "react";
import { getFollowers } from "@/lib/react-query/queriesAndMutations";
import { FollowerDocument } from "@/lib/react-query/queriesAndMutations";

interface FollowersListProps {
    userId: string;
}

const FollowersList: React.FC<FollowersListProps> = ({ userId }) => {
   // Define the state with the FollowerDocument type
   const [followers, setFollowers] = useState<FollowerDocument[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
       const fetchFollowers = async () => {
           if (!userId) {
               console.error("Error: userId is undefined in FollowersList.");
               return;
           }

           setLoading(true);
           const data = await getFollowers(userId) as FollowerDocument[];
           setFollowers(data);
           setLoading(false);
       };
       fetchFollowers();
   }, [userId]);

   if (loading) return <div>Loading...</div>;

   return (
      <div>
        <h1 className="xl:text-3xl md:text-lg text-center font-semibold mb-4">
            Followers:
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {followers.map((follower) => (
            <div key={follower.$id} className="follower-card">
              <img
                src={follower.imageUrl || "/assets/icons/profile-placeholder.svg"}
                alt={follower.name}
                className="w-16 h-16 rounded-full"
              />
              <p className="mt-2 font-semibold">{follower.name}</p>
              <p className="text-light-3">@{follower.username}</p>
            </div>
          ))}
        </div>
      </div>
   );
};

export default FollowersList;
