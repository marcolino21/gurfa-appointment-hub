
import { AuthState } from '../types';
import { MOCK_SALONS } from '../data/mockData';

export type AuthAction =
  | { type: 'LOGIN'; payload: { user: any; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_CURRENT_SALON'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SALONS'; payload: any[] };

export const initialState: AuthState = {
  user: null,
  token: null,
  currentSalonId: null,
  salons: [],
  loading: false,
  error: null
};

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        salons: MOCK_SALONS[action.payload.user.id] || [],
        currentSalonId: MOCK_SALONS[action.payload.user.id]?.[0]?.id || null,
        loading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        salons: [],
        currentSalonId: null,
        loading: false,
        error: null
      };
    case 'SET_CURRENT_SALON':
      return {
        ...state,
        currentSalonId: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'SET_SALONS':
      return {
        ...state,
        salons: action.payload
      };
    default:
      return state;
  }
};
