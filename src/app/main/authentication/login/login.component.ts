import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

import { Router } from '@angular/router';
import { Feathers } from '@fuse/services/partials/feathers.service';
import { PxNotification } from '@fuse/services/notification.service';
// import { Store, select } from '@ngrx/store';
// import * as fromAuth from '@fuse/ngrx/auth/reducers';
// import * as Auth from '@fuse/ngrx/auth/actions/auth';
import { Observable } from 'rxjs/Observable';
import { PeopleService } from '@fuse/services/partials/people.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loginFormErrors: any;
    // loggedin$: Observable<boolean>;
    // loginError$: Observable<any>;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        // private _Store: Store<fromAuth.State>,
        private _Feathers: Feathers,
        private _Router: Router,
        private _PxNoti: PxNotification,
        private people: PeopleService
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        this.loginFormErrors = {
            email: {},
            password: {}
        };

        // this.loggedin$ = this._Store.pipe(select(fromAuth.getLoggedIn));
        // this.loginError$ = this._Store.pipe(select(fromAuth.getLoginPageError));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        this.loginForm.valueChanges.subscribe(() => {
            this.onLoginFormValuesChanged();
        });

        // this.loggedin$.subscribe((loggedin: boolean) => {
        //     if (loggedin) {
        //         this.sendMessage('You have successfully logged in');
        //         this._Store.dispatch(new Auth.LoadAuthenticatedPeople(this.loginForm.value.email))
        //     }
        // });

        // this.loginError$.subscribe((response: any) => {
        //     if (response) {
        //         this.sendMessage(response.name + ' - [ ' + response.message + ' ]');
        //     }
        // });
    }

    onLoginFormValuesChanged() {
        for (const field in this.loginFormErrors) {
            if (!this.loginFormErrors.hasOwnProperty(field)) {
                continue;
            }

            // Clear previous errors
            this.loginFormErrors[field] = {};

            // Get the control
            const control = this.loginForm.get(field);

            if (control && control.dirty && !control.valid) {
                this.loginFormErrors[field] = control.errors;
            }
        }
    }

    login() {
        // if (this.loginForm.valid) {
        //     this._Store.dispatch(new Auth.Login(this.loginForm.value));
        // }
        const email = this.loginForm.value.email;
        const password = this.loginForm.value.password;

        if (!email || !password) {
            // this.messages.push('Incomplete credentials!');
            this.sendMessage('Incomplete credentials!');
            return;
        }

        // try to authenticate with feathers
        this._Feathers.authenticate({
            strategy: 'local',
            email,
            password
        })
            // navigate to base URL on success
            .then((res) => {
                this.people.peoples$().subscribe(people => {
                    this.people.onPeopleDataChanged.next(people[0]);
                });
                this._Router.navigate(['/']);
            })
            .catch(err => {
                // this.messages.unshift('Wrong credentials!');
                this.sendMessage('Wrong credentials!')
            });
    }

    signup(email: string, password: string) {
        this._Feathers.service('users')
            .create({ email, password })
            .then(() => this.sendMessage('User created.'))
            .catch(err => this.sendMessage('Could not create user!'))
            ;
    }

    sendMessage(message: string): void {
        this._PxNoti.sendMessage(message);
    }

    clearMessage(): void {
        this._PxNoti.clearMessage();
    }
}
