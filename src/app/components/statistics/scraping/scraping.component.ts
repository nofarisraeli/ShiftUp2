import { Component } from '@angular/core';

import { ScrapingService } from '../../../services/scraping/scraping.service';

declare let Swal: any;
declare let $: any;

@Component({
    selector: 'scraping',
    templateUrl: './scraping.html',
    providers: [ScrapingService],
    styleUrls: ['./scraping.css']
})

export class ScrapingComponent {
    isLoading: boolean;
    states: string[];
    keyWords: any = {
        first: "",
        second: "",
        third: ""
    }

    constructor(private scrapingService: ScrapingService) {
        this.initStates();
    }

    initStates() {
        this.scrapingService.GetAllStates().then(states => {
            this.states = states;
        });
    }

    scrapData() {
        this.isLoading = true;
        this.states = null;

        this.scrapingService.ScrapData().then(result => {
            this.isLoading = false;
            if (result) {
                Swal.fire({
                    type: 'success',
                    title: 'הסריקה הסתיימה בהצלחה'
                });

                this.initStates();
            }
            else {
                Swal.fire({
                    type: 'error',
                    title: 'שגיאה בסריקת המידע',
                    text: 'אופס... משהו השתבש'
                });
            }
        });
    }

    findKeyWords() {
        this.scrapingService.FindKeyWords($("#state").val(),
            [this.keyWords.first, this.keyWords.second, this.keyWords.third]).then(result => {
                $("#result").html(this.buildResult(result));
            });
    }

    buildResult(result) {
        let data = result.data.countryData
        let search = result.searchResult;

        search.forEach((elm, index) => {
            let position = elm[0] + index * 7;
            let wordLength = elm[1][0].length;

            data = this.spliceString(data, position - 1, 0, "<b>");
            data = this.spliceString(data, position + wordLength + 2, 0, "</b>");
        });

        return data;
    }

    spliceString(str, start, delCount, newSubStr) {
        return str.slice(0, start) + newSubStr + str.slice(start + Math.abs(delCount));
    };
}