import { createContext } from 'react';

export type AuthUser = {
	id: string;
	name: string;
	email: string;
	favorites: string[];
};

export type AuthContextValue = {
	token: string;
	user: AuthUser | null;
	authReady: boolean;
	favoriteIds: string[];
	favoriteLoadingIds: string[];
	login: (email: string, password: string) => Promise<void>;
	register: (name: string, email: string, password: string) => Promise<void>;
	logout: () => void;
	setFavorites: (favorites: string[]) => void;
	toggleFavorite: (productId: string, currentlyFavorite: boolean) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
