import {Component, OnInit} from '@angular/core';
import {ConstraintsService} from '../../services/constraints/constraints.service';
import {UsersService} from "../../services/users/users.service";
import {ActivatedRoute, Router} from "@angular/router";

declare let Swal: any;

@Component({
    selector: 'constraints',
    templateUrl: './constraints.html',
    providers: [ConstraintsService, UsersService],
    styleUrls: ['./constraints.css']
})

export class ConstraintsComponent implements OnInit {
    sourceConstraints: Array<any> = [];
    constraints: Array<any> = [];
    searchWord: string;
    startDateFilter: Date;
    endDateFilter: Date;
    afterFreeFilter: Array<any> = [];

    constructor(private constraintsService: ConstraintsService,
                private usersService: UsersService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.InitiateConstraints();
    }

    DeleteConstraint(conObjId: string) {
        this.constraintsService.DeleteConstraint(conObjId).then((isDeleted: any) => {
            if (isDeleted) {
                this.InitiateConstraints();
            } else {
                Swal.fire({
                    type: 'error',
                    title: 'שגיאה במחיקה',
                    text: 'אופס... משהו השתבש'
                })
            }
        })
    }

    ApproveConstraint(conObjId: string) {
        this.constraintsService.ApproveConstraint(conObjId).then((isApprove: any) => {
            if (isApprove) {
                this.InitiateConstraints();
            } else {
                Swal.fire({
                    type: 'error',
                    title: 'שגיאה באישור אילוץ',
                    text: 'אופס... משהו השתבש'
                })
            }
        })
    }

    RefuseConstraint(conObjId: string) {
        this.constraintsService.RefuseConstraint(conObjId).then((isCanceled: any) => {
            if (isCanceled) {
                this.InitiateConstraints();
            } else {
                Swal.fire({
                    type: 'error',
                    title: 'שגיאה בדחיית אילוץ',
                    text: 'אופס... משהו השתבש'
                })
            }
        })
    }

    InitiateConstraints() {
        this.constraintsService.getAllConstraints().then((data: any) => {
            this.sourceConstraints = data;
            this.constraints = this.sourceConstraints;
            this.afterFreeFilter = this.sourceConstraints;
        });
    }

    filterItem() {
        if (this.searchWord  || this.startDateFilter || this.endDateFilter) {
            this.constraints = this.sourceConstraints.filter(item => {
                let bool = true;
                if (this.searchWord) {
                    bool = (this.searchWord && (item.userId.includes(this.searchWord)) ||
                        (`${item.user[0].firstName} ${item.user[0].lastName}`.includes(this.searchWord)) ||
                        (item.description.includes(this.searchWord)) ||
                        (item.status[0].statusName.includes(this.searchWord)));
                }
                if (bool && this.startDateFilter) {
                    bool = new Date(item.startDate) >= new Date(this.startDateFilter);
                }
                if (bool && this.endDateFilter) {
                    bool = new Date(item.endDate) <= new Date(this.endDateFilter);
                }
                return bool;
            });
        } else {
            this.constraints = this.sourceConstraints;
        }
    }

    filterByDate() {
        if (new Date(this.startDateFilter).getTime() > 0) {
            this.constraints = this.sourceConstraints.filter(item => {
                    return (new Date(item.startDate).getTime() >= (new Date(this.startDateFilter).getTime()) ||
                        (new Date(item.startDate).getTime() == (new Date(this.startDateFilter).getTime())))
                }
            );
        } else {
            this.constraints = this.sourceConstraints;
        }
    }

}