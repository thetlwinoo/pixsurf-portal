import { AuthActions, AuthActionTypes } from './../actions/auth';
import { User } from '../models';

export interface State {
  loggedIn: boolean;
  user: User | null;
  authenticatedPeople: any | null;
}

export const initialState: State = {
  loggedIn: false,
  user: null,
  authenticatedPeople: null,
};

export function reducer(state = initialState, action: AuthActions): State {
  switch (action.type) {
    case AuthActionTypes.LoginSuccess: {
      return {
        ...state,
        loggedIn: true,
        user: action.payload.user,
        authenticatedPeople: null
      };
    }

    case AuthActionTypes.Logout: {
      return initialState;
    }

    case AuthActionTypes.LoadPeopleSuccess:{
      return {
        ...state,
        authenticatedPeople: action.payload.authenticatedPeople
      };
    }

    default: {
      return state;
    }
  }
}

export const getLoggedIn = (state: State) => state.loggedIn;
export const getUser = (state: State) => state.user;
export const getAuthenticatedPeople= (state: State) => state.authenticatedPeople;
