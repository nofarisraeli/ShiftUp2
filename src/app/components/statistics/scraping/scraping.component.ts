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
        let first = this.keyWords.first;
        let second = this.keyWords.second;
        let third = this.keyWords.third;

        if (second.indexOf(first) != -1 || third.indexOf(first) != -1) {
            first = "";
        }

        if (first.indexOf(second) != -1 || third.indexOf(second) != -1) {
            second = "";
        }

        if (first.indexOf(second) != -1 || second.indexOf(third) != -1) {
            third = "";
        }

        this.scrapingService.FindKeyWords($("#state").val(),
            [first, second, third]).then(result => {
                $("#result").html(this.buildResult(result));
            });
    }

    buildResult(result) {
        let data = result.data.countryData
        let search = result.searchResult;

        let firstMark = "<b style='color: red;'>";
        let secondMark = "</b>";

        search.forEach((elm, index) => {
            let endPosition = elm[0] + (index * (firstMark.length + secondMark.length));
            let startPosition = endPosition - elm[1][0].length + 1;

            data = this.spliceString(data, startPosition, 0, firstMark);
            data = this.spliceString(data, endPosition + firstMark.length + 1, 0, secondMark);
        });

        return data;
    }

    spliceString(str, start, delCount, newSubStr) {
        return str.slice(0, start) + newSubStr + str.slice(start + Math.abs(delCount));
    };
}