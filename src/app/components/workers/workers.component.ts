import { Component, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessesService } from '../../services/businesses/businesses.service';
import { WorkersService } from '../../services/workers/workers.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { isNumber } from 'util';

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
    showAdvancedFilter: boolean = false;

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
        });

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
            job: new FormControl()
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

    onShowAdvancedFilterClick = () => {
        this.showAdvancedFilter = !this.showAdvancedFilter;
        if (!this.showAdvancedFilter) {
            this.filterForm.reset();
        }
    }

    onFieldReset = (fieldName: any) => {
        this.filterForm.controls[fieldName].reset();
    }

    onFilterSubmit = () => {
        let advancedFilter: any = {};
        const minAge = this.filterForm.get("minAge").value;
        const maxAge = this.filterForm.get("maxAge").value;
        const minSalary = this.filterForm.get("minSalary").value;
        const maxSalary = this.filterForm.get("maxSalary").value;
        const job = this.filterForm.get("job").value;

        let errorMessages: Array<string> = [];

        // Minimum Age
        if (isNumber(minAge)) {
            if (minAge < 0) {
                errorMessages.push("גיל מינימלי שלילי לא תקין");
            } else {
                advancedFilter.minAge = minAge;
            }
        }

        // Maximum Age
        if (isNumber(maxAge)) {
            if (maxAge < 0) {
                errorMessages.push("גיל  מקסימלי שלילי לא תקין");
            }
            if (advancedFilter.minAge && minAge > maxAge) {
                errorMessages.push("גיל מינימלי גדול מגיל מקסימלי");
            }

            if (!errorMessages.length || errorMessages.length && !errorMessages[errorMessages.length - 1].includes("גיל מקסימלי")) {
                advancedFilter.maxAge = maxAge;
            }
        }

        // Minimum Salary
        if (isNumber(minSalary)) {
            if (minSalary < 20 || minSalary > 100) {
                errorMessages.push("שכר שעתי מינימלי לא בטווח המותר");
            } else {
                advancedFilter.minSalary = minSalary;
            }
        }

        // Maximum Salary
        if (isNumber(maxSalary)) {
            if (maxSalary < 20 || maxSalary > 100) {
                errorMessages.push("שכר שעתי מקסימלי לא בטווח המותר");
            }
            if (advancedFilter.minSalary && minSalary > maxSalary) {
                errorMessages.push("שכר שעתי מינימלי גדול משכר שעתי מקסימלי");
            }

            if (!errorMessages.length || errorMessages.length && !errorMessages[errorMessages.length - 1].includes("שכר שעתי מקסימלי")) {
                advancedFilter.maxSalary = maxSalary;
            }
        }

        // Job
        if (job) {
            if (!this.allJobs.includes(job)) {
                errorMessages.push("תפקיד לא תקין");
            } else {
                advancedFilter.job = job;
            }
        }

        if (errorMessages.length) {
            Swal.fire({
                title: "שגיאה",
                type: "error",
                html: "<div" + errorMessages.map(message => "<div>" + message + "</div>").toString() + "</div>",
                confirmButtonText: "אישור"
            });
        } else if ($.isEmptyObject(advancedFilter)) {
            Swal.fire({
                title: "לא הוזן סינון",
                type: "warning",
                text: "יש להשתמש בלפחות אחד משדות הסינון ולאחר מכן ללחוץ שנית על לחצן הסינון",
                confirmButtonText: "אישור"
            });
        } else {
            console.log(advancedFilter);
            Swal.fire({
                background: "#009688",
                html: "<span style='color: #eee; font-size: 26px; font-weight: bold;'>הסינון בוצע בהצלחה</span>",
                position: "top",
                showConfirmButton: false,
                timer: 1500,
                toast: true
            });
        }
    }

    onFilterReset = () => {
        this.workerSearchText = "";
        this.filteredWorkers = this.allWorkers;
    }
}