import { Component, OnInit } from '@angular/core';

declare let Microsoft: any;
// declare let $: any;

@Component({
    selector: 'map',
    templateUrl: './map.html',
    providers: [],
    styleUrls: ['./map.css']
})

export class MapComponent {

    /// <reference path="types/MicrosoftMaps/CustomMapStyles.d.ts" />
    /// <reference path="types/MicrosoftMaps/Microsoft.Maps.d.ts" />
    /// <reference path="types/MicrosoftMaps/Microsoft.Maps.All.d.ts" />


    ngOnInit() {
        var map = new Microsoft.Maps.Map("#workersBingMap", {
           credentials: 'uPvgq4Nh7bSJpV8LKmmB~L_aavPOS7_b9Tp4Bo2X8WQ~As2x0q-bbYoeLGwybYQpvBLT-OkwrPOQu9W7oJ8hcnQEpGnKawwTQzEEzPPpfxbu',
            center: new Microsoft.Maps.Location(31, 35),
            zoom: 7,
        });
            
        let infobox: any = new Microsoft.Maps.Infobox(map.getCenter(), { visible: true });
        infobox.setMap(map);

        var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(50, 10), { title: "test 1" });
        
        // Define the click event of the point
        Microsoft.Maps.Events.addHandler(pushpin, 'click', function (e: any) {
            console.log("pushpin click 1");
            infobox.setOptions({ location: e.primitive.getLocation(), description: "test infobox", visible: true });
        });
    }
}