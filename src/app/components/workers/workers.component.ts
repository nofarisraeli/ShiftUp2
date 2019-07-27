import { Component } from '@angular/core';
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

export class WorkersComponent {
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
    lastAdvancedFilter: any;
    lastFilteredWorkersResult: Array<any>;
    showStats: boolean;
    salaryStats: Array<any>;

    constructor(private businessesService: BusinessesService,
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
            this.lastFilteredWorkersResult = this.allWorkers.map(worker => worker._id);
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
            job: new FormControl("בחר תפקיד")
        });
    }

    showSalaryStats() {
        this.workersService.ReduceWorkersSalary().then(result => {
            this.salaryStats = result.map(stat => {
                return { "salary": stat._id, "amount": stat.value }
            });

            this.showStats = true;
        });
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

    SearchWorkerHandler = (currentAdvancedFilter?: any) => {
        if (this.workerSearchText) {
            this.filteredWorkers = this.allWorkers.filter((worker: any) => {
                if (this.lastFilteredWorkersResult.indexOf(worker._id) == -1) {
                    return false;
                }

                const currWorkerFullName = worker.firstName + ' ' + worker.lastName;
                const currWorkerFullNameReversed = worker.lastName + ' ' + worker.firstName;

                return currWorkerFullName.indexOf(this.workerSearchText) != -1 ||
                    currWorkerFullNameReversed.indexOf(this.workerSearchText) != -1 ||
                    worker.userId.indexOf(this.workerSearchText) != -1
            });
        }
        else {
            this.filteredWorkers = this.allWorkers;
            if (this.lastFilteredWorkersResult) {
                if (!currentAdvancedFilter || !$.isEmptyObject(currentAdvancedFilter)) {
                    this.filteredWorkers = this.filteredWorkers.filter(worker => this.lastFilteredWorkersResult.includes(worker._id));
                }
            }
        }
    }

    onShowAdvancedFilterClick = () => {
        this.showAdvancedFilter = !this.showAdvancedFilter;
        this.filteredWorkers = this.allWorkers;
        this.lastFilteredWorkersResult = this.allWorkers.map(worker => worker._id);
        this.filterForm.reset();
        this.lastAdvancedFilter = {};
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
                if (job != "בחר תפקיד") {
                    errorMessages.push("תפקיד לא תקין");
                }
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
        } else {
            if ($.isEmptyObject(advancedFilter)) {
                // If filter form wasnt changed at all
                if (!this.lastAdvancedFilter) {
                    Swal.fire({
                        title: "לא הוזן סינון",
                        type: "warning",
                        text: "יש להשתמש בלפחות שדה סינון אחד ולנסות שנית",
                        confirmButtonText: "אישור"
                    });
                }
                // Else The filter form cleaned by user
                else {
                    this.filteredWorkers = this.allWorkers;
                    this.lastFilteredWorkersResult = this.allWorkers.map(worker => worker._id);
                    this.SearchWorkerHandler(advancedFilter);
                }
            } else if (this.lastAdvancedFilter &&
                this.lastAdvancedFilter.minAge == advancedFilter.minAge &&
                this.lastAdvancedFilter.maxAge == advancedFilter.maxAge &&
                this.lastAdvancedFilter.minSalary == advancedFilter.minSalary &&
                this.lastAdvancedFilter.maxSalary == advancedFilter.maxSalary &&
                this.lastAdvancedFilter.job == advancedFilter.job) {
                Swal.fire({
                    title: "לא בוצע שינוי",
                    type: "warning",
                    text: "יש לשנות לפחות שדה אחד על מנת לסנן שנית",
                    confirmButtonText: "אישור"
                });
            } else {
                this.workersService.GetFilteredWorkers(advancedFilter).then(filteredWorkersResult => {
                    this.lastFilteredWorkersResult = filteredWorkersResult;
                    if (filteredWorkersResult) {
                        this.filteredWorkers = this.allWorkers;
                        this.filteredWorkers = this.filteredWorkers.filter(worker => filteredWorkersResult.includes(worker._id));
                        this.SearchWorkerHandler(advancedFilter);
                        Swal.fire({
                            background: "#009688",
                            html: "<span style='color: #eee; font-size: 26px; font-weight: bold;'>הסינון בוצע בהצלחה</span>",
                            position: "bottom",
                            showConfirmButton: false,
                            timer: 1500,
                            toast: true
                        });
                    }
                }).catch(err => {
                    Swal.fire({
                        title: "שגיאה",
                        type: "error",
                        text: "אופס... משהו השתבש",
                        confirmButtonText: "אישור"
                    });
                });
            }
            this.lastAdvancedFilter = advancedFilter;
        }
    }

    onFilterReset = () => {
        this.workerSearchText = "";
        this.filteredWorkers = this.allWorkers;
        this.lastAdvancedFilter = {};
        this.lastFilteredWorkersResult = this.allWorkers.map(worker => worker._id);
    }
}