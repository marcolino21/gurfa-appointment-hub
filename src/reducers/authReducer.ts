import { AuthState } from '../types';
import { MOCK_SALONS } from '../data/mock/auth';

export type AuthAction =
  | { type: 'LOGIN'; payload: { user: any; token: string; salons?: any[]; currentSalonId?: string | null } }
  | { type: 'LOGOUT' }
  | { type: 'SET_CURRENT_SALON'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SALONS'; payload: any[] }
  | { type: 'ADD_SALON'; payload: any }
  | { type: 'UPDATE_SALON'; payload: { salonId: string; updatedSalon: any } };

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
      const userSalons = action.payload.salons || MOCK_SALONS[action.payload.user.id] || [];
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        salons: userSalons,
        currentSalonId: action.payload.currentSalonId || userSalons[0]?.id || null,
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
    case 'ADD_SALON':
      return {
        ...state,
        salons: [...state.salons, action.payload],
      };
    case 'UPDATE_SALON':
      return {
        ...state,
        salons: state.salons.map(salon => 
          salon.id === action.payload.salonId 
            ? { ...salon, ...action.payload.updatedSalon }
            : salon
        ),
      };
    default:
      return state;
  }
};
