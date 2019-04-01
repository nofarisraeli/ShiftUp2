import { Component } from '@angular/core';
import { BusinessService } from '../../services/business/business.service';

declare let Swal: any;

class Shift {
    name: string;
    workersAmount: number;

    constructor();
    constructor(name: string, workersAmount: number)
    constructor(name?: string, workersAmount?: number) {
        this.name = name;
        this.workersAmount = workersAmount || 1;
    }
}

export class Business {
    name: string;
    address: string;
    shifts: Shift[];

    constructor();
    constructor(name: string, address: string, shifts: Shift[])
    constructor(name?: string, address?: string, shifts?: Shift[]) {
        this.name = name;
        this.address = address;
        this.shifts = shifts;
    }
}

@Component({
    selector: 'newBusiness',
    templateUrl: './newBusiness.html',
    providers: [BusinessService],
    styleUrls: ['./newBusiness.css']
})

export class NewBusinessComponent {
    business: Business;

    constructor(private businessService: BusinessService) {
        this.business = new Business();
        this.business.shifts = [new Shift()];
    }

    addBusiness() {
        this.isShiftsValid() && this.businessService.AddBusiness(this.business).then(result => {
            if (result) {

            }
            else {
                Swal.fire({
                    type: 'error',
                    title: 'שגיאה',
                    text: 'אופס... משהו השתבש'
                })
            }
        });
    }

    addShift() {
        this.business.shifts.push(new Shift());
        setTimeout(() => {
            $("#shifts-container")[0].scrollTop = $("#shifts-container")[0].scrollHeight;
        }, 0);
    }

    removeShift(index: any) {
        this.business.shifts.splice(index, 1);
    }

    isShiftsValid() {
        let error;
        let shifts = this.business.shifts;

        for (let i = 0; i < shifts.length; i++) {
            let shift = shifts[i];

            if (!shift.name) {
                error = "יש לוודא שלכל משמרת יש שם!";

            }
            else if (shift.workersAmount < 1) {
                error = "מספר העובדים באחת מהמשמרות לא תקין!";
            }

            if (error) {
                Swal.fire({
                    type: 'error',
                    title: 'בעייה בנתונים',
                    text: error
                });

                return false;
            }
        }

        return true;
    }
}