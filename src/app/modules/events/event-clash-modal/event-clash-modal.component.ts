import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from '../../../services/alerts.service';
import { RestService } from "../../../services/rest.service";
import { Globals } from '../../../globals';
import { environment } from '../../../../environments/environment';
import * as L from 'leaflet';
import { Event } from '../../../models/event';

@Component({
  selector: 'app-event-clash-modal',
  templateUrl: './event-clash-modal.component.html',
  styleUrls: ['./event-clash-modal.component.css']
})
export class EventClashModalComponent implements OnInit {

  @Input()
  public event: any;
  public allEvents: any;
  public eventDate: string;
  filteredEvents: any;
  controls: string
  _id: string;
  map: L.Map;
  markerGroup: L.layerGroup;
  icon: L.icon;
  //homeIcon: L.icon;
  member: any = {};
  entered: boolean = false;
  minDistance: number = 50;
  maxDistance: number = 1000;
  daysRange: number = 2;

  // baseMarkerStyle = `width: 2rem;
  // height: 2rem;
  // display: block;
  // left: -1.5rem;
  // top: -1.5rem;
  // position: relative;
  // border-radius: 3rem 3rem 0;
  // transform: rotate(45deg);
  // border: 1px solid #FFFFFF;`

  // homeMarkerStyle = this.baseMarkerStyle + ` background-color: #FF0000;`;
  // otherMarkerStyle = this.baseMarkerStyle + ` background-color: #583470;`;


  API_URL: string = environment.API_URL;


  constructor(private rest: RestService, public alertsService: AlertsService, private router: Router, private activatedRoute: ActivatedRoute, public globals: Globals, public activeModal: NgbActiveModal) {
    this.globals['bgImage'] = "none";
  }

 
  ngOnInit():void {
    
    this.filterEvents();
    
    
    
    
      //icon.options.shadowSize = [0,0];  // for default icon, shadow will not show (bug??) so disabled it...

      // let marker = L.marker([this.event.start.latitude, this.event.start.longitude], { icon: this.icon, title: "Start/Finish (" + this.event.start.description + ")" });
      // marker.bindPopup("<p>" + this.event.start.description + "</p><p>Lat: " + this.event.start.latitude + ", Long: " + this.event.start.longitude + "</p>").openPopup();
      // marker.addTo(this.map); //start location
      // for (let event of this.allEvents) { //controls
        
      //   marker = L.marker([event.latitude, event.longitude], { icon: this.icon, title: event.eventName });
      //   marker.bindPopup("<p>" + event.eventName + "</p><p>Lat: " + event.latitude + ", Long: " + event.longitude + "</p>").openPopup();
      //   marker.addTo(this.map);
      // }
    //this.setMarkers(false)
  }

  filterEvents(): void{
    console.log(this.daysRange);
    if(!this.daysRange){
      this.daysRange = 2;
      this.alertsService.show("Please choose between 0 and 30 days", { classname: 'bg-warning text-light', delay: 3000 });
    }
    if(this.daysRange > 30) {
      this.daysRange = 30;
      this.alertsService.show("Please choose between 0 and 30 days", { classname: 'bg-warning text-light', delay: 3000 });
    }
    else if(this.daysRange < 0) {
      this.daysRange = 0;
      this.alertsService.show("Please choose between 0 and 30 days", { classname: 'bg-warning text-light', delay: 3000 });
    }

    let fromDate = new Date(this.eventDate);
    let toDate = new Date(this.eventDate);
    fromDate.setDate(fromDate.getDate() - this.daysRange);
    toDate.setDate(toDate.getDate() + this.daysRange);
    
    this.filteredEvents = this.allEvents.filter( x => {
      if(new Date(x.eventDate.substring(0,10)).getTime() < fromDate.getTime()) return false;
      if(new Date(x.eventDate.substring(0,10)).getTime() > toDate.getTime()) return false;
      if(x.distance < this.minDistance) return false;
      if(x.distance > this.maxDistance) return false;
      return true;
    });
    this.setMarkers();
  }

  setMap(): void {
    this.map = L.map('clashMap');
    this.markerGroup = new L.layerGroup();
    var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, { minZoom: 8, maxZoom: 18, attribution: osmAttrib });
    
    this.map.addLayer(osm);
    this.map.setView([this.event.controls[0].latitude, this.event.controls[0].longitude], 8);
      //var icon = new L.Icon.Default();
    this.icon = L.icon({
      iconUrl: '../../../assets/images/icons/marker-icon.png',
      shadowUrl: '',

      iconSize: [25, 41], // size of the icon
      shadowSize: [0, 0], // size of the shadow
      iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 0],  // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    // this.icon = L.divIcon({
    //   className: "my-custom-pin",
    //   iconAnchor: [0, 24],
    //   labelAnchor: [-6, 0],
    //   popupAnchor: [0, -36],
    //   html: `<span style="${this.otherMarkerStyle}" />`
    // })

    // this.homeIcon = L.divIcon({
    //   className: "my-custom-pin",
    //   iconAnchor: [0, 24],
    //   labelAnchor: [-6, 0],
    //   popupAnchor: [0, -36],
    //   html: `<span style="${this.homeMarkerStyle}" />`
    // })
    this.setMarkers(); // refresh map to show new marker
  }

  setMarkers(): void {

    if (!this.map) this.setMap();
    this.map.setView([this.event.controls[0].latitude, this.event.controls[0].longitude]);

    if(this.markerGroup) this.markerGroup.clearLayers(); // remove and re-create the markers, to allow for changes to the custom start

    //let marker = L.marker([this.event.controls[0].latitude, this.event.controls[0].longitude], { icon: this.icon, title: "Start/Finish (" + this.event.start.description + ")" });
    //marker.bindPopup("<p>" + this.event.start.description + "</p><p>Lat: " + this.event.controls[0].latitude + ", Long: " + this.event.controls[0].longitude + "</p>").openPopup();
    //marker.addTo(this.map); //start location
    for (let event of this.filteredEvents) { //controls
      
      //let marker;
    
      // if(event._id === this.event._id) marker = L.marker([event.latitude, event.longitude], { icon: this.homeIcon, title: `${event.eventName} - ${event.eventDate.substring(0,10)}` });
      // else marker = L.marker([event.latitude, event.longitude], { icon: this.icon, title: `${event.eventName} - ${event.eventDate.substring(0,10)}` });
      let marker = L.marker([event.latitude, event.longitude], { icon: this.icon, title: `${event.eventName} - ${event.eventDate.substring(0,10)} - ${event.distance} km` });
      marker.bindPopup(`<p>${event.eventName}</p><p>${event.distance} km</p><p>${event.eventDate.substring(0,10)}</p>`).openPopup();
      this.markerGroup.addLayer(marker);
    }
    this.markerGroup.addTo(this.map);
  }

}
