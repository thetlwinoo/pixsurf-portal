import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { tap, map, exhaustMap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '@fuse/services/partials/auth.service';
import { PeopleService } from '@fuse/services/partials/people.service';
import { Feathers } from '@fuse/services/partials/feathers.service';
import {
  Login,
  LoadAuthenticatedPeople,
  LoginSuccess,
  LoginFailure,
  LoadPeopleSuccess,
  LoadPeopleFailure,
  AuthActionTypes,
} from '../actions/auth';
import { User, Authenticate } from '../models';
import { switchMap } from 'rxjs/operator/switchMap';

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = this.actions$.pipe(
    ofType(AuthActionTypes.Login),
    map((action: Login) => action.payload),
    exhaustMap((auth: Authenticate) =>
      this.auth
        .logIn({ strategy: 'local', email: auth.email, password: auth.password })
        .pipe(
          map(res => new LoginSuccess({ user: { email: auth.email, token: res } })),
          catchError(error => of(new LoginFailure(error)))
        )
    )
  );

  @Effect()
  loadAuthenticatedPeople$ = this.actions$.pipe(
    ofType(AuthActionTypes.LoadAuthenticatedPeople),
    map((action: LoadAuthenticatedPeople) => action.payload),
    exhaustMap((email: any) =>
      this.auth
        .peoples$(email)
        .pipe(
          map(res => new LoadPeopleSuccess({ authenticatedPeople: res })),
          catchError(error => of(new LoadPeopleFailure(error)))
        )
    )
  );

  @Effect({ dispatch: false })
  loginSuccess$ = this.actions$.pipe(
    ofType(AuthActionTypes.LoginSuccess),
    tap(() => this.router.navigate(['/']))
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType(AuthActionTypes.Logout),
    tap(() => this.auth.logOut())
  );

  @Effect({ dispatch: false })
  loginRedirect$ = this.actions$.pipe(
    ofType(AuthActionTypes.LoginRedirect, AuthActionTypes.Logout),
    tap(authed => {
      this.router.navigate(['/auth/login']);
    })
  );

  constructor(
    private actions$: Actions,
    private auth: AuthService,
    private people: PeopleService,
    private feathers: Feathers,
    private router: Router
  ) { }
}
