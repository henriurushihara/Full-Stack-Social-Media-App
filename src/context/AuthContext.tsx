import { getCurrentUser } from '@/lib/appwrite/api';
import { IUser } from '@/types'
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: ''
}

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean
}

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export const AuthProvider = ({ children }: { children: React.ReactNode }) =>
{
  const [user, setUser] = useState<IUser>(INITIAL_USER);

  const [isLoading, setIsLoading] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
        const currentAccount = await getCurrentUser();

        if(currentAccount) {
            setUser({
                id: currentAccount.$id,
                name: currentAccount.name,
                username: currentAccount.username,
                email: currentAccount.email,
                imageUrl: currentAccount.imageUrl,
                bio: currentAccount.bio
            });

            setIsAuthenticated(true);

            return true;

        }

        return false;

    } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
        return false;
    } finally {
        setIsLoading(false);
    }
  };

  /* Implementation 1
  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (
      cookieFallback === "[]" ||
      cookieFallback === null ||
      cookieFallback === undefined
    ) {
      navigate("/sign-in");
    }
  
    checkAuthUser();
  }, []);
  */

  // IMPLEMENTATION 2
  /*
  useEffect(() => {
    const checkAuthStatus = async () => {
        // First, check the fallback for cookie storage issues
        const cookieFallback = localStorage.getItem("cookieFallback");
        
        if (!cookieFallback || cookieFallback === "[]") {
            // Redirect to sign-in if no valid cookie fallback exists
            navigate("/sign-in");
            return;
        }

        // Proceed to check if an authenticated user exists
        try {
            const currentUser = await getCurrentUser();
            if (currentUser) {
                // If user is authenticated, update state accordingly
                setAuthState({ user: currentUser, isAuthenticated: true });
            } else {
                // Redirect to sign-in if the user is not found in the database
                navigate("/sign-in");
            }
        } catch (error) {
            console.error("Error retrieving user:", error);
            navigate("/sign-in");
        }
    };

    checkAuthStatus();
  }, [navigate, setAuthState]);
  */

  //IMPLEMENTATION 3 
  // useEffect to check authentication status
  /*
  useEffect(() => {
    const checkAuthStatus = async () => {
        const cookieFallback = localStorage.getItem("cookieFallback");
        
        if (!cookieFallback || cookieFallback === "[]") {
            navigate("/sign-in");
            return;
        }

        try {
            const currentUser = await getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                setIsAuthenticated(true);
            } else {
                navigate("/sign-in");
            }
        } catch (error) {
            console.error("Error retrieving user:", error);
            navigate("/sign-in");
        }
    };

    checkAuthStatus();
  }, [navigate]);
  */
  
  /*
  useEffect(() => {
    const checkAuthStatus = async () => {
        const cookieFallback = localStorage.getItem("cookieFallback");
        
        if (!cookieFallback || cookieFallback === "[]") {
            navigate("/sign-up");
            return;
        }

        try {
            const currentAccount = await getCurrentUser();
            
            if (currentAccount) {
                const formattedUser: IUser = {
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username || '',
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl || '',
                    bio: currentAccount.bio || ''
                };
                
                setUser(formattedUser);
                setIsAuthenticated(true);
            } else {
                navigate("/sign-up");
            }
        } catch (error) {
            console.error("Error retrieving user:", error);
            navigate("/sign-up");
        }
    };

    checkAuthStatus();
  }, [navigate]);
  */

  /*
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);  // Set loading to true at the start
      const cookieFallback = localStorage.getItem("cookieFallback");
      
      if (!cookieFallback || cookieFallback === "[]") {
        setIsLoading(false);  // Stop loading before redirecting
        navigate("/sign-up");
        return;
      }
  
      try {
        const currentAccount = await getCurrentUser();
        
        if (currentAccount) {
          const formattedUser: IUser = {
            id: currentAccount.$id,
            name: currentAccount.name,
            username: currentAccount.username || '',
            email: currentAccount.email,
            imageUrl: currentAccount.imageUrl || '',
            bio: currentAccount.bio || ''
          };
          
          setUser(formattedUser);
          setIsAuthenticated(true);
        } else {
          navigate("/sign-up");
        }
      } catch (error) {
        console.error("Error retrieving user:", error);
        navigate("/sign-up");
      } finally {
        setIsLoading(false);  // Ensure loading is set to false at the end
      }
    };
  
    checkAuthStatus();
  }, [navigate]);
  */


  //THIS ONE WORKS
  /*  
  useEffect(() => {
    const checkAuthStatus = async () => {
      const cookieFallback = localStorage.getItem("cookieFallback");

      if (!cookieFallback || cookieFallback === "[]") {
        // If there's no cookie, determine the appropriate redirect
        if (location.pathname !== '/sign-in') {
          navigate("/sign-up");
        }
        return;
      }

      try {
        const currentAccount = await getCurrentUser();

        if (currentAccount) {
          setUser({
            id: currentAccount.$id,
            name: currentAccount.name,
            username: currentAccount.username || '',
            email: currentAccount.email,
            imageUrl: currentAccount.imageUrl || '',
            bio: currentAccount.bio || ''
          });
          setIsAuthenticated(true);
        } else if (location.pathname !== '/sign-in') {
          // If no account is found and not on sign-in, navigate to sign-in
          navigate("/sign-up");
        }
      } catch (error) {
        console.error("Error retrieving user:", error);
        //if (location.pathname !== '/sign-in') {
          navigate("/sign-up");
        //}
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthUser();
  }, []);

  */ //END OF WORKING ONE

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (
      cookieFallback === "[]" ||
      cookieFallback === null ||
      cookieFallback === undefined
    ) {
      navigate("/sign-in");
    }

    checkAuthUser();
  }, []);
  
  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser
  };

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  );

}

export const useUserContext = () => useContext(AuthContext);