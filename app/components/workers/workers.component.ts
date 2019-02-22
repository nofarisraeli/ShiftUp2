import { Component } from '@angular/core';
import { Worker } from '../workerCard/workerCard.component';

@Component({
    selector: 'workers',
    templateUrl: './workers.html',
    providers: [],
    styleUrls: ['./workers.css']
})

export class WorkersComponent {
    workers: Array<Worker> = [
        { id: 323345120, name: "נופר ישראלי", job: "host", age: 22, hourSalery: 28 },
        { id: 323545551, name: "יונתן צור", job: "shef", age: 23, hourSalery: 40 },
        { id: 315856716, name: "ניב הוכברג", job: "waiter", age: 23, hourSalery: 31 },
        { id: 201215100, name: "אבי רון", job: "dishWasher", age: 21, hourSalery: 22 },
        { id: 345852156, name: "ברי צקלה", job: "waiter", age: 20, hourSalery: 30 },
        { id: 158815313, name: "גלעד שליט", job: "shiftManager", age: 28, hourSalery: 42 },
    ];
    isNewWorkerDialogOpen: boolean = false;

    openNewWorkerDialog = () => {
        this.isNewWorkerDialogOpen = true;
    }

    onNewWorkerClose = (newWorker: Worker) => {
        if (newWorker) {
            if (this.workers.find(currWorker => currWorker.id == newWorker.id) !== undefined) {
                alert("שגיאה! קיים עובד עם מספר תעודת זהות זהה");
                return;
            }
            this.workers.push(newWorker);
        }
        this.isNewWorkerDialogOpen = false;
    }

    onDeleteWorker = (workerId: number) => {
        this.workers = this.workers.filter(worker => worker.id !== workerId);
    }

    onDeleteAllWorkers = () => {
        if (confirm("האם אתה בטוח שברצונך למחוק את כל העובדים?")) {
            this.workers = [];
        }
    }
}