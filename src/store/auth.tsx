import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import type { User } from "@/types";
import { supabase } from "@/lib/supabase";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "UPDATE_USER"; payload: Partial<User> };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "UPDATE_USER":
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    });

    // Listen for auth changes (Google redirect, login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          dispatch({ type: "LOGOUT" });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUserOrId: any) => {
    const userId = typeof authUserOrId === "string" ? authUserOrId : authUserOrId?.id;
    if (!userId) {
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (profile) {
        dispatch({
          type: "LOGIN",
          payload: {
            id: profile.id,
            fullName: profile.full_name || "Creator",
            username: profile.username || "creator",
            avatar: profile.avatar_url || "",
            bio: profile.bio || "",
            location: profile.location || "",
            website: profile.website || "",
            hobbies: Array.isArray(profile.hobbies) ? profile.hobbies : [],
            followers: 0,
            following: 0,
            posts: 0,
          },
        });
        return;
      }

      // If profile does not exist yet (e.g. first-time Google sign-in)
      const authUser = typeof authUserOrId === "object" ? authUserOrId : (await supabase.auth.getUser()).data.user;
      const meta = authUser?.user_metadata || {};
      const fallbackName = meta.full_name || meta.name || authUser?.email?.split("@")[0] || "Creator";
      const fallbackUsername = meta.user_name || meta.username || authUser?.email?.split("@")[0]?.toLowerCase().replace(/[^a-z0-9_]/g, "") || `creator_${userId.slice(0, 5)}`;
      const fallbackAvatar = meta.avatar_url || meta.picture || "";

      let createdProfile = null;
      try {
        const { data: created } = await supabase
          .from("profiles")
          .upsert(
            {
              id: userId,
              full_name: fallbackName,
              username: fallbackUsername,
              avatar_url: fallbackAvatar,
              hobbies: [],
            },
            { onConflict: "id" }
          )
          .select()
          .maybeSingle();
        createdProfile = created;
      } catch (upsertErr) {
        console.warn("Could not auto-create profile:", upsertErr);
      }

      dispatch({
        type: "LOGIN",
        payload: {
          id: userId,
          fullName: createdProfile?.full_name || fallbackName,
          username: createdProfile?.username || fallbackUsername,
          avatar: createdProfile?.avatar_url || fallbackAvatar,
          bio: createdProfile?.bio || "",
          location: createdProfile?.location || "",
          website: createdProfile?.website || "",
          hobbies: Array.isArray(createdProfile?.hobbies) ? createdProfile.hobbies : [],
          followers: 0,
          following: 0,
          posts: 0,
        },
      });
    } catch (err) {
      console.warn("Failed to load user profile:", err);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const login = (user: User) => {
    dispatch({ type: "LOGIN", payload: user });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (data: Partial<User>) => {
    dispatch({ type: "UPDATE_USER", payload: data });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}