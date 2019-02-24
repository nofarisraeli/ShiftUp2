"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var basic_service_1 = require("../basic/basic.service");
var rxjs_1 = require("rxjs");
var LoginService = /** @class */ (function (_super) {
    __extends(LoginService, _super);
    function LoginService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.prefix = "/login";
        _this._currentUserSubject = new rxjs_1.BehaviorSubject((localStorage.getItem('currUser')));
        _this.currentUser = _this._currentUserSubject.asObservable();
        return _this;
    }
    Object.defineProperty(LoginService.prototype, "currentUserValue", {
        get: function () {
            return this._currentUserSubject.value;
        },
        set: function (user) {
            this._currentUserSubject.next(user);
        },
        enumerable: true,
        configurable: true
    });
    LoginService.prototype.UserLogin = function (user) {
        var _this = this;
        return _super.prototype.post.call(this, this.prefix + "/api/userLogin", user)
            .toPromise()
            .then(function (result) {
            localStorage.setItem('currUser', user.email);
            //  localStorage.setItem('currToken', result);
            _this.currentUserValue = user.email;
            return result;
        })
            .catch(function (e) {
            return null;
        });
    };
    LoginService.prototype.logout = function () {
        // remove user from local storage to log user out
        localStorage.removeItem('currUser');
        // localStorage.removeItem('currToken');
        this._currentUserSubject.next(null);
    };
    LoginService = __decorate([
        core_1.Injectable({ providedIn: 'root' })
    ], LoginService);
    return LoginService;
}(basic_service_1.BasicService));
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map