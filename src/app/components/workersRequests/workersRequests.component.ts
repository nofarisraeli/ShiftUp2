import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event/event.service'
import { UsersService } from '../../services/users/users.service';
import { BusinessesService } from '../../services/businesses/businesses.service';
import { WorkersService } from '../../services/workers/workers.service';

declare let Swal: any;

@Component({
    selector: 'workersRequests',
    templateUrl: './workersRequests.html',
    providers: [UsersService, BusinessesService, WorkersService],
    styleUrls: ['./workersRequests.css']
})

export class WorkersRequestsComponent {
    requestUsers: Array<any>;
    business: any;

    constructor(
        private eventService: EventService,
        private usersService: UsersService,
        private businessesService: BusinessesService,
        private workersService: WorkersService,
        private router: Router) { }

    ngOnInit() {
        this.usersService.GetUsersRequestedToBusiness().then((usersRequests: Array<any>) => {
            if (usersRequests.length == 0) {
                this.router.navigateByUrl('/workers');
            } else {
                this.requestUsers = usersRequests;
                this.requestUsers.forEach((reqUser) => {
                    reqUser.fullName = reqUser.firstName + ' ' + reqUser.lastName;
                    reqUser.age = this.calcAge(reqUser.birthDate);
                    reqUser.job = "";
                    reqUser.salary = 20;
                });
            }
        });

        this.businessesService.GetLoggedInBusiness().then((business: any) => {
            this.business = business;
        });
    }

    backToWorkersHandler = () => {
        this.router.navigateByUrl('/workers');
    }

    calcAge = (birthDate: Date) => {
        if (birthDate) {
            return new Date(Date.now() - new Date(birthDate).valueOf()).getFullYear() - 1970;
        } else {
            return 0;
        }
    }

    onSalaryChange = (newSalary: number, index: number) => {
        this.requestUsers[index].salary = newSalary;
    }

    acceptRequestHandler = (requestUser: any) => {
        if (!requestUser.job) {
            Swal.fire({
                title: "שגיאה!",
                text: "יש להגדיר ראשית תפקיד לעובד",
                type: "warning",
                confirmButtonText: "אישור"
            });
        }
        else {
            if (requestUser.salary < 20 || requestUser.salary > 100) {
                Swal.fire({
                    title: "שגיאה!",
                    text: "שכר לשעה לא בטווח המותר: 20 עד 100",
                    type: "warning",
                    confirmButtonText: "אישור"
                });
            }
            else {
                this.workersService.AddWorkerToBusiness(requestUser.userId, requestUser.job, requestUser.salary)
                .then(() => {
                    this.removeRequest(requestUser._id);
                    Swal.fire({
                        title: "הפעולה הצליחה",
                        text: "העובד " + requestUser.firstName + ' ' + requestUser.lastName + " נוסף בהצלחה לעסק",
                        type: "success",
                        showConfirmButton: false,
                        timer: 1000
                    });
                    if (this.requestUsers.length == 0) {
                        this.router.navigateByUrl('/workers');
                    }
                })
                .catch((err: any) => {
                    Swal.fire({
                        title: "שגיאה!",
                        text: 'פעולת אישור העובד ' + requestUser.firstName + ' ' + requestUser.lastName + ' נכשלה',
                        type: "error",
                        confirmButtonText: "אישור"
                    });
                    return;
                });
            }
        }
    }

    denyRequestHandler = (requestUser: any) => {
        this.workersService.DenyWorkerRequest(requestUser._id)
            .then((result) => {
                this.removeRequest(requestUser._id);
                Swal.fire({
                    title: "הפעולה הצליחה",
                    text: "בקשת העובד " + requestUser.firstName + ' ' + requestUser.lastName + " נדחתה בהצלחה",
                    type: "success",
                    showConfirmButton: false,
                    timer: 1000
                });
                if (this.requestUsers.length == 0) {
                    this.router.navigateByUrl('/workers');
                }
            })
            .catch((err: any) => {
                Swal.fire({
                    type: 'error',
                    title: 'שגיאה!',
                    text: 'דחיית הבקשה נכשלה'
                });
            })
    }

    removeRequest = (requestUser_id: string) => {
        this.requestUsers = this.requestUsers.filter(request => request._id !== requestUser_id);
        this.eventService.Emit("removeBusinessRequest", requestUser_id);
    }
}