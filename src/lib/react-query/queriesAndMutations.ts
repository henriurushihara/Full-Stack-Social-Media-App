import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
} from '@tanstack/react-query'
import { updatePost, createPost, createUserAccount, deleteSavedPost, getCurrentUser, getPostById, getRecentPosts, likePost, savePost, signInAccount, signOutAccount, deletePost, getInfinitePosts, searchPosts, getUsers, getUserById, updateUser } from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types'
import { QUERY_KEYS } from './queryKeys'
import { appwriteConfig, databases } from '../appwrite/config'
import { Models, ID, Query } from 'appwrite'

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { 
            email: string; password: string 
        }) => signInAccount(user)
    })
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (post: INewPost) => createPost(post),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
      },
    });
  };

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts
    })
}

export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, likesArray }: { postId: string; likesArray:
        string[] }) => likePost(postId, likesArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useSavePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, userId }: { postId: string; userId:
        string }) => savePost(postId, userId),
        onSuccess: () => { 
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
        onSuccess: () => { 
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}

export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, imageId }: 
        { postId: string, imageId: string }) => deletePost(postId, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts,
        getNextPageParam: (lastPage) => {
            if(lastPage && lastPage.documents.length === 0) return null;

            const lastId 
            = lastPage.documents[lastPage?.documents.length - 1].$id;

            return lastId;
        }
    })
}

export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm
    })
}

export const useGetUsers = (limit?: number) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USERS],
      queryFn: () => getUsers(limit),
    });
  };

export const useGetUserById = (userId: string) => {
return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
});
};

export const useUpdateUser = () => {
const queryClient = useQueryClient();
return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
    queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    });
    queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
    });
    },
});
};

export const useGetMultipleUsersById = (userIds) => {
    return useQuery({
      queryKey: ["multipleUsers", userIds],
      queryFn: () => getUsersByIds(userIds),
      enabled: !!userIds?.length,
    });
  };
  
  
  export async function getUsersByIds(userIds) {
    if (!userIds || userIds.length === 0) return [];
    
    const queries = userIds.map(id => Query.equal("$id", id));
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );
  
    return response.documents;
  }

// Define a type for the follower document
export interface FollowerDocument {
    $id: string;
    imageUrl?: string;
    name: string;
    username: string;
}

  export interface UserDocument extends Models.Document {
    name: string;
    username: string;
    imageUrl?: string; // Optional profile image URL
    // Add any other user-specific fields here
  }

export const getFollowers = async (userId: string): Promise<FollowerDocument[]> => {
    const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.followersCollectionId,
      [Query.equal("followingId", userId)]
    );
  
    const followers = await Promise.all(
      response.documents.map(async (doc) => {
        const userData = await databases.getDocument<UserDocument>(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
          doc.followerId
        );
        return { ...doc, ...userData }; // Merge follower document with user profile data
      })
    );
  
    return followers;
  };

export const getFollowing = async (userId: string): Promise<FollowerDocument[]> => {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followersCollectionId,
      [Query.equal("followerId", userId)] // Here we check where 'followerId' matches 'userId', meaning Nobunaga is the follower
    );
  
    const following = await Promise.all(
      response.documents.map(async (doc) => {
        const userData = await databases.getDocument<UserDocument>(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          doc.followingId // Get details of the users Nobunaga is following
        );
        return { ...doc, ...userData }; // Merge following document with user profile data
      })
    );
  
    return following;
  };

  export const followUser = async ({ userId, targetUserId }: { userId: string; targetUserId: string }) => {
    // Create a follower relationship in the followers collection
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followersCollectionId,
      'unique()', // generates a unique ID
      {
        followerId: userId,
        followingId: targetUserId
      }
    );
  
    // Increment follower count for the target user
    const targetUser = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      targetUserId,
    );
  
    // Increment following count for the user performing the follow
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      targetUserId,
      {
        followers: (targetUser.followers || 0) + 1, // Use targetUser.followers, default to 0 if null
      }
    );

    // Fetch the current user's data to get the current following count
    const currentUser = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId
    );

    // Increment current user's following count
    await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId,
        {
        following: (currentUser.following || 0) + 1, // Use currentUser.following, default to 0 if null
        }
    );
  };


