import { Component } from '@angular/core';
// import Microsoft from ''

// declare let $: any;

@Component({
    selector: 'map',
    templateUrl: './map.html',
    providers: [],
    styleUrls: ['./map.css']
})

export class MapComponent {
    
    bingMapCallback = () => {
        console.log("bingMapCallback");
        // let map: any = new Microsoft.Maps.Map(document.getElementById("bingMap"), {
        //     credentials: 'uPvgq4Nh7bSJpV8LKmmB~L_aavPOS7_b9Tp4Bo2X8WQ~As2x0q-bbYoeLGwybYQpvBLT-OkwrPOQu9W7oJ8hcnQEpGnKawwTQzEEzPPpfxbu',
        //     center: new Microsoft.Maps.Location(0, 0),
        //     zoom: 1,
        // });
        
        // Add an infobox to the map so that we can display it when a pushpin is clicked.
        // let infobox: any = new Microsoft.Maps.Infobox(map.getCenter(), { visible: false });
        // infobox.setMap(map);
        
        // // Create the point pushpin of the current point
        // let pushpin: any = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(0, 0), { title: "test" });
        
        // // Define the click event of the point
        // Microsoft.Maps.Events.addHandler(pushpin, 'click', function (e) {
        //     // Get the point name by the clicked coordinates
        //     infobox.setOptions({
        //         location: e.primitive.getLocation(),
        //         description: "test infobox",
        //         visible: true
        //     })
        // });
    }
}