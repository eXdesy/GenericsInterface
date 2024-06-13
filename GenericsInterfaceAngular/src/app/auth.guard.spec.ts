import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }]
    });

    authGuard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow activation if token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue('testToken');
    
    const route = new ActivatedRouteSnapshot();
    const state = {} as RouterStateSnapshot;
    
    expect(authGuard.canActivate(route, state)).toBe(true);
  });

  it('should deny activation and redirect to login if token does not exist', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    
    const route = new ActivatedRouteSnapshot();
    const state = {} as RouterStateSnapshot;

    expect(authGuard.canActivate(route, state)).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
