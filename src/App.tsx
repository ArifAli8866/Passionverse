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

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profile) {
        dispatch({
          type: "LOGIN",
          payload: {
            id: profile.id,
            fullName: profile.full_name,
            username: profile.username,
            avatar: profile.avatar_url || "",
            bio: profile.bio || "",
            location: profile.location || "",
            website: profile.website || "",
            hobbies: [],
            followers: 0,
            following: 0,
            posts: 0,
          },
        });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    } catch {
      dispatch({ type: "LOGOUT" });
    }
  };

  useEffect(() => {
    // Keep isLoading true until we confirm session
    dispatch({ type: "SET_LOADING", payload: true });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        dispatch({ type: "LOGOUT" });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          await loadUserProfile(session.user.id);
        } else if (event === "SIGNED_OUT") {
          dispatch({ type: "LOGOUT" });
        } else if (event === "TOKEN_REFRESHED" && session?.user) {
          await loadUserProfile(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

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