import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import { LikedPosts } from "@/_root/pages";
import { useUserContext } from "@/context/AuthContext";
import { followUser, useGetUserById } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import GridPostList from "@/components/shared/GridPostList";
import Followers from "./Followers";
import Following from "./Following";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface StatBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StatBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUserContext();
  const { pathname } = useLocation();

  const { data: currentUser, isLoading } = useGetUserById(id || "");
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          following: currentUser.following ? currentUser.following + 1 : 1,
        };
        queryClient.setQueryData(["user", user?.id], updatedUser);
      }
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
    },
    onError: (error) => {
      console.error("Error following user:", error);
    },
  });

  const handleFollow = () => {
    if (currentUser && user?.id) {
      followMutation.mutate({ userId: user.id, targetUserId: id || "" });
    }
  };

  useEffect(() => {
    console.log("Current user data:", currentUser);
  }, [currentUser]);

  if (isLoading || !currentUser) return <Loader />;

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center gap-9">
          {/* Profile Picture */}
          <img
            src={currentUser?.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />

          {/* Profile Info */}
          <div className="flex flex-col items-start xl:items-center">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col xl:mt-4">
                <h1 className="text-center xl:text-left h3-bold md:h1-semibold">
                  {currentUser?.name}
                </h1>
                <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                  @{currentUser?.username}
                </p>
              </div>

              {/* Follow Button */}
              <div className={`${user?.id === id ? "hidden" : ""} xl:ml-16 mt-4`}>
                <Button type="button" onClick={handleFollow} className="shad-button_primary px-10">
                  Follow
                </Button>
              </div>
            </div>

            {/* Statistics Bar */}
            <div className="flex gap-8 items-center justify-center sm:mt-8 xl:justify-start mt-4 xl:mt-6">
              <StatBlock value={currentUser?.posts?.length || 0} label="Posts" />
              <Link to={`/profile/${id}/followers`} className="text-primary-500">
                <StatBlock value={currentUser?.followers || 0} label="Followers" />
              </Link>
              <Link to={`/profile/${id}/following`} className="text-primary-500">
                <StatBlock value={currentUser?.following || 0} label="Following" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
          {currentUser?.bio}
        </p>

        {/* Edit Profile Button */}
        <div className="flex justify-center gap-4 mt-8">
          {user?.id === currentUser?.$id && (
            <Link
              to={`/update-profile/${currentUser.$id}`}
              className="h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg"
            >
              <img
                src={"/assets/icons/edit.svg"}
                alt="edit"
                width={20}
                height={20}
              />
              <p className="flex whitespace-nowrap small-medium">
                Edit Profile
              </p>
            </Link>
          )}
        </div>
      </div>

      {/* Tabs for Posts and Liked Posts */}
      {currentUser?.$id === user?.id && (
        <div className="flex max-w-5xl w-full mt-8">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${pathname === `/profile/${id}` && "!bg-dark-3"}`}
          >
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"}`}
          >
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList posts={currentUser?.posts || []} showUser={false} />}
        />
        {currentUser?.$id === user?.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
        <Route
          path="/followers"
          element={<Followers userId={currentUser?.$id} />}
        />
        <Route
          path="/following"
          element={<Following userId={currentUser?.$id} />}
        />
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
