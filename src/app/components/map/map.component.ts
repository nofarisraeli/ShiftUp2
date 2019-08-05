import { Component } from '@angular/core';
import { WorkersService } from '../../services/workers/workers.service';

declare let Microsoft: any;
declare let Swal: any;
// declare let $: any;

@Component({
    selector: 'map',
    templateUrl: './map.html',
    providers: [WorkersService],
    styleUrls: ['./map.css']
})

export class MapComponent {

    constructor(private workersService: WorkersService) {}

    ngOnInit() {
        var map = new Microsoft.Maps.Map("#workersBingMap", {
           credentials: 'uPvgq4Nh7bSJpV8LKmmB~L_aavPOS7_b9Tp4Bo2X8WQ~As2x0q-bbYoeLGwybYQpvBLT-OkwrPOQu9W7oJ8hcnQEpGnKawwTQzEEzPPpfxbu',
            center: new Microsoft.Maps.Location(31.3, 35),
            zoom: 7,
        });
            
        let infobox: any = new Microsoft.Maps.Infobox(map.getCenter(), { visible: false });
        infobox.setMap(map);

        this.workersService.GetWorkersMapCoordinates().then(users => {
            if (users) {
                users.forEach(user => {
                    const latitude = parseFloat(user.latitude.toString());
                    const longitude = parseFloat(user.longitude.toString());
                    const userLocation = new Microsoft.Maps.Location(latitude, longitude);
                    const pushpin = new Microsoft.Maps.Pushpin(userLocation, { title: user.firstName + " " + user.lastName });
                    map.entities.push(pushpin);
                });
            } else {
                Swal.fire({
                    title: "שגיאה",
                    text: "טעינת מיקומי העובדים נכשלה",
                    type: "error",
                    confirmButtonText: "אישור"
                });
            }
        });
    }
}