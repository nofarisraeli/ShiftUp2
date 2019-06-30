import { Component, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessesService } from '../../services/businesses/businesses.service';
import { WorkersService } from '../../services/workers/workers.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { isArray, isNumber } from 'util';

declare let Swal: any;
declare let $: any;

@Component({
    selector: 'workers',
    templateUrl: './workers.html',
    providers: [BusinessesService, WorkersService],
    styleUrls: ['./workers.css']
})

export class WorkersComponent implements AfterViewChecked {
    business: any = {};
    manager: any;
    allWorkers: Array<any>;
    filteredWorkers: Array<any>;
    workerSearchText: string = "";
    allJobs: Array<string>;
    filterForm: FormGroup = new FormGroup({
        minAge: new FormControl(),
        maxAge: new FormControl(),
        minSalary: new FormControl(),
        maxSalary: new FormControl(),
        job: new FormControl()
    });

    constructor(private cdRef:ChangeDetectorRef,
        private businessesService: BusinessesService,
        private workersService: WorkersService,
        private router: Router) { }

    ngOnInit() {
        this.businessesService.GetLoggedInBusiness().then((business: any) => {
            this.business = business;
        });

        this.businessesService.GetWorkersForBusiness().then((workers: any) => {
            this.manager = workers.filter((worker: any) => worker.isManager)[0];
            this.allWorkers = workers.filter((worker: any) => !worker.isManager);
            this.filteredWorkers = this.allWorkers;
        });

        this.businessesService.GetJobsOfBusiness().then((jobs: any) => {
            this.allJobs = jobs;

            this.filterForm = new FormGroup({
                minAge: new FormControl(
                    Validators.min(0)
                ),
                maxAge: new FormControl(
                    Validators.min(0)
                ),
                minSalary: new FormControl(
                    Validators.min(20),
                    Validators.max(100)
                ),
                maxSalary: new FormControl(
                    Validators.min(20),
                    Validators.max(100)
                ),
                job: new FormControl("בחר תפקיד")
            });
        });
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    showRequests = () => {
        this.router.navigateByUrl('/workers/requests');
    }

    deleteWorkerHandler = (workerToDelete: any) => {
        Swal.fire({
            title: "האם אתה בטוח?",
            text: "העובד " + workerToDelete.firstName + ' ' + workerToDelete.lastName + " יימחק מהעסק!",
            type: "warning",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonText: "אישור",
            cancelButtonText: "ביטול"
        }).then((result: any) => {
            if (result.value) {
                this.workersService.RemoveWorkerFromBusiness(workerToDelete.userId)
                    .then(() => {
                        this.allWorkers = this.allWorkers.filter(worker => worker.userId !== workerToDelete.userId);
                        this.SearchWorkerHandler();
                        Swal.fire({
                            title: "הפעולה הצליחה!",
                            text: "העובד " + workerToDelete.firstName + " " + workerToDelete.lastName + " נמחק בהצלחה",
                            type: "success",
                            showConfirmButton: false,
                            timer: 1000
                        });
                    })
                    .catch((err: any) => {
                        Swal.fire({
                            title: "שגיאה",
                            text: "הפעולה נכשלה!",
                            type: "error",
                            confirmButtonText: "אישור"
                        });
                    })
            }
        });
    }

    deleteAllWorkersHandler = () => {
        Swal.fire({
            title: "האם אתה בטוח?",
            text: "כל העובדים יימחקו!",
            type: "warning",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonText: "אישור",
            cancelButtonText: "ביטול"
        }).then((result: any) => {
            if (result.value) {
                this.workersService.RemoveAllWorkersFromBusiness()
                    .then(() => {
                        this.allWorkers = [];
                        this.filteredWorkers = [];
                        Swal.fire({
                            title: "הפעולה הצליחה!",
                            text: "כל העובדים נמחקו בהצלחה.",
                            type: "success",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    })
                    .catch((err: any) => {
                        Swal.fire({
                            title: "שגיאה",
                            text: "הפעולה נכשלה!",
                            type: "error",
                            confirmButtonText: "אישור"
                        });
                    });
            }
        });
    }

    SearchWorkerHandler = () => {
        if (this.workerSearchText) {
            this.filteredWorkers = this.allWorkers.filter((worker: any) => {
                const currWorkerFullName = worker.firstName + ' ' + worker.lastName;
                const currWorkerFullNameReversed = worker.lastName + ' ' + worker.firstName;

                return currWorkerFullName.indexOf(this.workerSearchText) == 0 ||
                    currWorkerFullNameReversed.indexOf(this.workerSearchText) == 0 ||
                    worker.userId.indexOf(this.workerSearchText) == 0
            });
        }
        else {
            this.filteredWorkers = this.allWorkers;
        }
    }

    onFilterSubmit = () => {
        const minAge = this.filterForm.get("minAge").value;
        const maxAge = this.filterForm.get("maxAge").value;
        const minSalary = this.filterForm.get("minSalary").value;
        const maxSalary = this.filterForm.get("maxSalary").value;
        const job = this.filterForm.get("job").value;

        let errorMessages: Array<string> = [];
        let advnacedFilter: any = {};

        if (isNumber(minAge)) {
            advnacedFilter.minAge = minAge;
            if (minAge < 0) {
                errorMessages.push("גיל מינימלי שלילי לא תקין");
                advnacedFilter.minAge = null;
            }
        }

        if (isNumber(maxAge)) {
            advnacedFilter.maxAge = maxAge;
            if (maxAge < 0) {
                errorMessages.push("גיל  מקסימלי שלילי לא תקין");
                advnacedFilter.maxAge = null;
            }
            if (advnacedFilter.minAge && minAge > maxAge) {
                errorMessages.push("גיל מינימלי גדול מגיל מקסימלי");
                advnacedFilter.maxAge = null;
            }
        }

        if (isNumber(minSalary)) {
            advnacedFilter.minSalary = minSalary;
            if (minSalary < 20 || minSalary > 100) {
                errorMessages.push("שכר שעתי מינימלי לא בטווח המותר");
                advnacedFilter.minSalary = null;
            }
        }

        if (isNumber(maxSalary)) {
            advnacedFilter.maxSalary = maxSalary;
            if (maxSalary < 20 || maxSalary > 100) {
                errorMessages.push("שכר שעתי מקסימלי לא בטווח המותר");
                advnacedFilter.maxSalary = null;
            }
            if (advnacedFilter.minSalary && minSalary > maxSalary) {
                errorMessages.push("שכר שעתי מינימלי גדול משכר שעתי מקסימלי");
                advnacedFilter.maxSalary = null;
            }
        }

        if (!isArray(job) && job != "בחר תפקיד") {
            advnacedFilter.job = job;
            if (!this.allJobs.includes(job)) {
                errorMessages.push("תפקיד לא תקין");
                advnacedFilter.job = null;
            }
        }

        if (errorMessages.length) {
            let errorMessage = "";
            for (let i = 0; i < errorMessages.length; i++) {
                errorMessage += "<div>" + errorMessages[i] + "</div>";
            }
            Swal.fire({
                title: "שגיאה",
                type: "error",
                html: "<div" + errorMessage + "</div>",
                confirmButtonText: "אישור"
            });
        } else if ($.isEmptyObject(advnacedFilter)) {
            Swal.fire({
                title: "לא הוזן סינון",
                type: "warning",
                text: "יש להשתמש בלפחות אחד משדות הסינון ולאחר מכן ללחוץ שנית על לחצן הסינון",
                confirmButtonText: "אישור"
            });
        } else {
            console.log(advnacedFilter);
            Swal.fire({
                title: "הפעולה הצליחה",
                type: "success",
                text: "סינון תקין",
                confirmButtonText: "אישור"
            });
        }
    }

    onFilterReset = () => {
        this.workerSearchText = "";
        this.filteredWorkers = this.allWorkers;
    }
}