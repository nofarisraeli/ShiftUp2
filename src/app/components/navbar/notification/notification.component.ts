import { Component, Input } from '@angular/core';

@Component({
    selector: 'notification',
    templateUrl: './notification.html',
    styleUrls: ['./notification.css']
})

export class NotificationComponent {
    @Input()
    loggedInUser: boolean;
    @Input()
    notificationsWorkersRequestsClick: Function;
    @Input()
    notificationsConstraintsClick: Function;
}