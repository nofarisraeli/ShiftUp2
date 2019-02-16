"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var WorkerCardComponent = /** @class */ (function () {
    function WorkerCardComponent() {
        var _this = this;
        this.onClose = new core_1.EventEmitter();
        this.calcWorkerSalery = function () {
            console.log("handle calculate worker salery " + _this.worker.id);
        };
        this.deleteWorker = function () {
            _this.onClose.emit();
        };
    }
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], WorkerCardComponent.prototype, "onClose", void 0);
    WorkerCardComponent = __decorate([
        core_1.Component({
            selector: 'workerCard',
            templateUrl: './workerCard.html',
            providers: [],
            styleUrls: ['./workerCard.css'],
            inputs: ['worker: worker']
        })
    ], WorkerCardComponent);
    return WorkerCardComponent;
}());
exports.WorkerCardComponent = WorkerCardComponent;
//# sourceMappingURL=workerCard.component.js.map