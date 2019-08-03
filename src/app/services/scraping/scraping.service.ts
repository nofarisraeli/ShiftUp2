import { BasicService } from '../basic/basic.service';
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ScrapingService extends BasicService {
    prefix = "/api/scraping";

    ScrapData() {
        return super.get(this.prefix + '/scrapData')
            .toPromise()
            .then((result: any) => result)
            .catch((err: any) => null);
    }

    GetAllStates() {
        return super.get(this.prefix + '/getAllStates')
            .toPromise()
            .then((result: any) => result)
            .catch((err: any) => null);
    }

    FindKeyWords(state: string, keys: string[]) {
        let data = { state, keys };
        return super.post(this.prefix + '/findKeyWords', data)
            .toPromise()
            .then((result: any) => result)
            .catch((err: any) => null);
    }
}