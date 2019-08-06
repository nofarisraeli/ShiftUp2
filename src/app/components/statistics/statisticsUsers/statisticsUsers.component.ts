import { Component } from '@angular/core';

import { UsersService } from '../../../services/users/users.service';

@Component({
    selector: 'statisticsUsers',
    templateUrl: './statisticsUsers.html',
    providers: [UsersService],
    styleUrls: ['./statisticsUsers.css']
})

export class StatisticsUsersComponent {
    stats: any;    
    
    constructor(private usersService: UsersService) { }

    ngOnInit() {
        this.usersService.GetDifferentUsersLoginsAmount().then(result => {
            this.stats = result;
        });
    }
}