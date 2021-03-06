import { BasicService } from '../basic/basic.service';
import {Business} from "../../components/newUserRole/newBusiness/newBusiness.component";

export class BusinessesService extends BasicService {
    prefix = "/api/businesses";

    GetLoggedInBusiness() {
        return super.get(this.prefix + '/getLoggedInBusiness')
            .toPromise()
            .then((result: any) => result)
            .catch((err: any) => null);
    }

    GetWorkersForBusiness() {
        return super.get(this.prefix + '/getWorkersForBusiness')
            .toPromise()
            .then((result: any) => result)
            .catch((err: any) => null);
    }

    AddBusiness(business: Business) {
        return super.post(this.prefix + '/addBusiness', business)
            .toPromise()
            .then((result: any) => result)
            .catch((e: any) => null);
    }

    GetJobsOfBusiness() {
        return super.get(this.prefix + '/getJobsOfbusiness')
            .toPromise()
            .then((result: any) => result)
            .catch((e: any) => null);
    }
}