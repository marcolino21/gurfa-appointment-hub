
import { AuthState } from '../types';

// Modifica dei dati mock per includere Gurfa Beauty Concept
export const MOCK_SALONS = {
  // ID degli utenti come chiavi
  'user-1': [
    {
      id: 'salon-1',
      name: 'Gurfa Beauty Concept',
      ownerId: 'user-1',
      address: 'Via Fiume Giallo, 405, 00144 Roma, Italia',
      phone: '+390654218124'
    },
    {
      id: 'salon-2',
      name: 'Studio Bellezza',
      ownerId: 'user-1'
    }
  ],
  'user-2': [
    {
      id: 'salon-3',
      name: 'Freemind Hair',
      ownerId: 'user-2'
    }
  ],
};

export type AuthAction =
  | { type: 'LOGIN'; payload: { user: any; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_CURRENT_SALON'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SALONS'; payload: any[] }
  | { type: 'ADD_SALON'; payload: any };

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
    case 'ADD_SALON':
      return {
        ...state,
        salons: [...state.salons, action.payload],
      };
    default:
      return state;
  }
};
