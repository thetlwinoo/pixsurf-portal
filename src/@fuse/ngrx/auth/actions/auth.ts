import { Action } from '@ngrx/store';
import { User, Authenticate } from '../models';

export enum AuthActionTypes {
  Login = '[Auth] Login',
  Logout = '[Auth] Logout',
  LoginSuccess = '[Auth] Login Success',
  LoginFailure = '[Auth] Login Failure',
  LoginRedirect = '[Auth] Login Redirect',
  LoadAuthenticatedPeople = '[Auth] Load Authenticated People',
  LoadPeopleSuccess = '[Auth] Load People Success',
  LoadPeopleFailure = '[Auth] Load People Failure',
}

export class Login implements Action {
  readonly type = AuthActionTypes.Login;

  constructor(public payload: Authenticate) { }
}

export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LoginSuccess;

  constructor(public payload: { user: any }) { }
}

export class LoginFailure implements Action {
  readonly type = AuthActionTypes.LoginFailure;

  constructor(public payload: any) { }
}

export class LoginRedirect implements Action {
  readonly type = AuthActionTypes.LoginRedirect;
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
}

export class LoadAuthenticatedPeople implements Action {
  readonly type = AuthActionTypes.LoadAuthenticatedPeople;

  constructor(public payload: any) { }
}

export class LoadPeopleSuccess implements Action {
  readonly type = AuthActionTypes.LoadPeopleSuccess;

  constructor(public payload: { authenticatedPeople: any }) { }
}

export class LoadPeopleFailure implements Action {
  readonly type = AuthActionTypes.LoadPeopleFailure;

  constructor(public payload: any) { }
}

export type AuthActions =
  | Login
  | LoginSuccess
  | LoginFailure
  | LoginRedirect
  | Logout
  | LoadAuthenticatedPeople
  | LoadPeopleSuccess
  | LoadPeopleFailure;
