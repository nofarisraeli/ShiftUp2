"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var WorkersComponent = /** @class */ (function () {
    function WorkersComponent() {
        var _this = this;
        this.workers = [
            { id: 323345120, name: "נופר ישראלי", job: "host", age: 22, hourSalery: 28 },
            { id: 323545551, name: "יונתן צור", job: "shef", age: 23, hourSalery: 40 },
            { id: 315856716, name: "ניב הוכברג", job: "waiter", age: 23, hourSalery: 31 },
            { id: 201215100, name: "אבי רון", job: "dishWasher", age: 21, hourSalery: 22 },
            { id: 345852156, name: "ברי צקלה", job: "waiter", age: 20, hourSalery: 30 },
            { id: 158815313, name: "גלעד שליט", job: "shiftManager", age: 28, hourSalery: 42 },
        ];
        this.isNewWorkerDialogOpen = false;
        this.openNewWorkerDialog = function () {
            _this.isNewWorkerDialogOpen = true;
        };
        this.onNewWorkerClose = function (newWorker) {
            if (newWorker) {
                if (_this.workers.find(function (currWorker) { return currWorker.id == newWorker.id; }) !== undefined) {
                    Swal.fire({
                        title: "שגיאה!",
                        text: "קיים עובד עם מספר תעודת זהות זהה.",
                        type: "error",
                        confirmButtonText: "אישור"
                    });
                    return;
                }
                _this.workers.push(newWorker);
            }
            _this.isNewWorkerDialogOpen = false;
        };
        this.onDeleteWorker = function (workerId) {
            Swal.fire({
                title: "האם אתה בטוח?",
                text: "העובד " + workerId + " יימחק.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "אישור",
                cancelButtonText: "ביטול"
            }).then(function (result) {
                if (result.value) {
                    _this.workers = _this.workers.filter(function (worker) { return worker.id !== workerId; });
                    Swal.fire({
                        title: "הפעולה הצליחה!",
                        text: "העובד נמחק בהצלחה",
                        type: "success",
                        showConfirmButton: false,
                        timer: 1000
                    });
                }
            });
        };
        this.onDeleteAllWorkers = function () {
            Swal.fire({
                title: "האם אתה בטוח?",
                text: "כל העובדים יימחקו.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "אישור",
                cancelButtonText: "ביטול"
            }).then(function (result) {
                if (result.value) {
                    _this.workers = [];
                    Swal.fire({
                        title: "הפעולה הצליחה!",
                        text: "כל העובדים נמחקו בהצלחה.",
                        type: "success",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        };
    }
    WorkersComponent = __decorate([
        core_1.Component({
            selector: 'workers',
            templateUrl: './workers.html',
            providers: [],
            styleUrls: ['./workers.css']
        })
    ], WorkersComponent);
    return WorkersComponent;
}());
exports.WorkersComponent = WorkersComponent;
//# sourceMappingURL=workers.component.js.map