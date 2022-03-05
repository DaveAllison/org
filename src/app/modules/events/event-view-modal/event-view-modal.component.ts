import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '../../../globals';
import { environment } from '../../../../environments/environment';
import * as L from 'leaflet';
import { Event } from '../../../models/event';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view-modal.component.html'
})
export class EventViewModalComponent implements OnInit {

  @Input()
  public event: Event;
  controls: string
  _id: string;
  map: L.Map;
  member: any = {};
  events: any = [];
  entered: boolean = false;

  API_URL: string = environment.API_URL;


  constructor(private router: Router, private activatedRoute: ActivatedRoute, public globals: Globals, public activeModal: NgbActiveModal) {
    this.globals['bgImage'] = "none";
  }

  ngOnInit(): void {

    // Create a controls string
    let controlsArray = [];
    for (let control of this.event['controls']) {
      controlsArray.push(control['name']);
    }
    this.controls = controlsArray.join(", ");

    // populate map details - but only if the event has a start location
    if (this.event.start.latitude && this.event.start.longitude) {
      this.map = L.map('mapId');
      var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      var osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
      var osm = new L.TileLayer(osmUrl, { minZoom: 8, maxZoom: 18, attribution: osmAttrib });
      //var icon = L.icon({iconUrl: '../../../assets/images/icons/marker-icon.png' });  // cannot get marker-shadow png to display, so used custom icon
      //var icon = L.icon({iconUrl: L.Icon.Default.imagePath + 'marker-icon.png', shadowUrl:L.Icon.Default.imagePath + 'marker-shadow.png'});

      this.map.addLayer(osm);
      this.map.setView([this.event.start.latitude, this.event.start.longitude], 12);
      //var icon = new L.Icon.Default();
      var icon = L.icon({
        iconUrl: '../../../assets/images/icons/marker-icon.png',
        shadowUrl: '',

        iconSize: [25, 41], // size of the icon
        shadowSize: [0, 0], // size of the shadow
        iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0],  // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
      });
      //icon.options.shadowSize = [0,0];  // for default icon, shadow will not show (bug??) so disabled it...

      let marker = L.marker([this.event.start.latitude, this.event.start.longitude], { icon: icon, title: "Start/Finish (" + this.event.start.description + ")" });
      marker.bindPopup("<p>" + this.event.start.description + "</p><p>Lat: " + this.event.start.latitude + ", Long: " + this.event.start.longitude + "</p>").openPopup();
      marker.addTo(this.map); //start location
      for (let control of this.event.controls) { //controls
        if (control.latitude == this.event.start.latitude && control.longitude === this.event.start.longitude) continue;
        marker = L.marker([control.latitude, control.longitude], { icon: icon, title: control.name });
        marker.bindPopup("<p>" + control.name + "</p><p>Lat: " + control.latitude + ", Long: " + control.longitude + "</p>").openPopup();
        marker.addTo(this.map);
      }


    }

  }

  customise(): void {
    this.activeModal.dismiss();
    this.router.navigate(['/members/event-customise', this.event._id]);
  }
}