import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router"
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { RefDataService } from '../../../services/refData.service';
import { RestService } from '../../../services/rest.service';
import { Globals } from '../../../globals';
import { environment } from '../../../../environments/environment';
import { AlertsService } from '../../../services/alerts.service';
import * as L from 'leaflet';
import { Event } from '../../../models/event';
import { QrModalComponent } from '../qr-modal/qr-modal.component';

const permittedFileTypes = {
  track: [ 'fit', 'gpx', 'tcx', 'zip' ],
  notes: [ 'pdf', 'docx', 'xlsx' ]
};
const maxFileSize = 2;

@Component({
  selector: 'app-event-admin',
  templateUrl: './event-admin.component.html'
})
export class EventAdminComponent implements OnInit {

  event: Event;
  newEventId: string=null;
  myEvents: any = [];
  selectedEventId: string = null;
  controls: string
  _id: string;
  //eventDistances: any = [50, 100, 150, 200, 300, 400, 500, 600, 1000, 1100, 1200, 1300, 1400, 1500, 2000, 3000, 4000];
  paymentMethods: any = ['Post', 'Online', 'Both'];
  eventStatuses: any = [];
  //orgStatuses: any = ['Void', 'Draft', 'Submitted'];
  //adminStatuses: any = ['Void', 'Draft', 'Submitted', 'Open', 'Cancelled', 'Closed'];
  eventDate: string;
  eventTime: string;
  selectedControl: number = 0;
  editDisabled = true; 
  uploadFile: Object = { track:null, notes: null };
  uploadBuffer: Object = { track: null, notes: null};

  /*
  statusMap: any = {
    a: {
      "event-organiser":['Void', 'Draft', 'Submitted'],
      "event-admin": ['Void', 'Draft', 'Submitted', 'Open', 'Cancelled', 'Closed']
    },
    b: {
      "event-organiser":['Void', 'Draft', 'Submitted', 'Open', 'Cancelled', 'Closed'],
      "event-admin": ['Void', 'Draft', 'Submitted', 'Open', 'Cancelled', 'Closed']
    }
  };
  */

  // map features
  map: L.Map;
  markerGroup: L.layerGroup;
  icon: L.icon;

  API_URL: string = environment.API_URL;
  STORAGE_URL = environment.STORAGE_URL;

  // approval
  isDirector: boolean = false;

  constructor(public globals: Globals, private router: Router, public alertsService: AlertsService, public refDataService: RefDataService, private rest: RestService, private titleService: Title, private modalService: NgbModal) {
    this.titleService.setTitle('Organisers - Event Admin');
    this.globals['bgImage'] = "none";
    this.globals['bgText'] = null;
  }

  async ngOnInit() {
    if (this.globals.user.groups.includes("event-director")) this.isDirector = true;
    try {

      if(this.globals.user.groups.includes('event-admin')) this.eventStatuses = this.refDataService.eventAdminStatuses();
      else this.eventStatuses = this.refDataService.eventOrgStatuses();

      this.myEvents = await this.rest.get('/eventData/eventList', null, { 'Authorization': localStorage.getItem("token") });
      if(this.myEvents.length === 1) { // Safari browser does not allow selection if only one event in list
        this.selectedEventId = this.myEvents[0]._id;
        this.getEvent();
      }
    }
    catch (e) {
      console.log(e);
      this.alertsService.show(e.message, { classname: 'bg-danger text-light', delay: 3000 });
    }

  }


  async getEvent() {

    try {

      let response = await this.rest.get('/eventData', { _id: this.selectedEventId }, { 'Authorization': localStorage.getItem("token") });
      this.event = <Event>response;
      this.selectedControl = 0;

      this.eventDate = null;
      this.eventTime = null;
      if (this.event.eventDate) {
        let dateTimeString = new Date(this.event.eventDate).toLocaleString("en-GB", { timeZone: 'Europe/London' });
        this.eventDate = `${dateTimeString.substring(6,10)}-${dateTimeString.substring(3,5)}-${dateTimeString.substring(0,2)}`;
        this.eventTime = dateTimeString.substring(12,17)
      }

      // Create a controls string
      let controlsArray = [];
      for (let control of this.event['controls']) {
        controlsArray.push(control['name']);
      }
      this.controls = controlsArray.join(", ");

      // populate map details - but only if the event has a start location
      if (this.event.start.latitude && this.event.start.longitude) {

        this.setMarkers(true);
      }

    }
    catch (e) {
      console.log(e);
      this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
      return;
    }
  }

  async onSubmit() {

    try {

      this.checkEvent();

      let response = await this.rest.post('/eventData', this.event, { 'Authorization': localStorage.getItem("token") });

      if (!this.event._id) {
        this.alertsService.show(`Event record added. Event ID is ${response['_id']}. The Event Director must approve this event before it can be ridden`);
        this.event._id = response['_id'];
        this.myEvents.push({ _id: this.event._id, name: this.event.name });
      }
      else this.alertsService.show("Event record updated. The Event Director must approve this event before it can be ridden", { classname: 'bg-success text-light', delay: 3000 });
    }
    catch (e) {
      console.log(e);
      this.alertsService.show(e.error && e.error.message ? e.error.message : e, { classname: 'bg-danger text-light', delay: 3000 });
      return;
    }

  }

  checkEvent(): void{

    // check fields. NB this is not submitted as a form, because ngFor doesn't work correctly in forms?? (so no form validation...)
    for (let field of ['distance', 'minSpeed', 'maxSpeed']) {
      if (isNaN(this.event[field]) || this.event[field] <= 0) throw ("Field: \"" + field + "\" must be numeric and greater than zero");
    }

    //category is required
    if(!this.event.category) throw("Category is required");

    // send date in correct format (i.e as ISO string, otherwise get into a mess with BST). Make null for permanent events
    if (this.event.eventType !== "C") this.event.eventDate = null;
    else this.event.eventDate = new Date(this.eventDate + "T" + this.eventTime);
    if (this.event.eventDate && isNaN(this.event.eventDate.getTime())) throw ("Event date / time is not valid");

    // don't allow max speed <= min speed - will make it impossible to arrive!
    if (this.event.maxSpeed <= this.event.minSpeed) throw ("Max speed must be greater tham min speed");

    // each control must be further from the start than the previous, and must start at 0 (not for DIYs)
    if (this.event.eventType !== 'D' && this.event.controls[0].distance !== 0) throw ("Start control distance is non-zero!");

    for (let i = 0; i < this.event.controls.length; i++) {
      if (i > 0 && this.event.controls[i].distance <= this.event.controls[i - 1].distance) throw ("Control distance must increase for each control");
      if(this.event.controls[i].latitude > 180 || this.event.controls[i].latitude < -180) throw ("Latitude must be +/- 180");
      if(this.event.controls[i].longitude > 180 || this.event.controls[i].longitude < -180) throw ("Longitude must be +/- 180");
    }
    
    // test numeric values
    this.event.distance = Math.round(this.event.distance);
    for (let field of ['distance', 'latitude', 'longitude']) {
      for (let control of this.event.controls) {
        if (control[field] === null || isNaN(control[field])) throw ("Control: \"" + field + "\" must be numeric");
        if (field === "distance") control[field] = Math.round(control[field]);  // distances must be whole numbers (app expects int)
      }
    } 

    // copy the start details from the first control - NB these are redundant really...
    if(this.event.eventType !== 'D') this.event.start = { description: this.event.controls[0].name, latitude: this.event.controls[0].latitude, longitude: this.event.controls[0].longitude };
    else this.event.start = { description: "Not defined", latitude: 51.47432, longitude: 0.0001 };
    
    // set start speed for BRM events
    if(this.event.category === "BRM"){
      this.setSpeed();
      this.alertsService.show("This is a BRM event - setting minimum speed", { classname: 'bg-warning text-light', delay: 3000 });
    }

  
  }

  async copyEvent() {
    let origId = this.event._id;
    try {
      this.event._id = 0;
      this.event.eventStatus = 'Draft';
      this.checkEvent();
      let result = await this.rest.post('/eventData', this.event, { 'Authorization': localStorage.getItem("token") });
      this.event._id = result['_id'];
      this.alertsService.show("Event record copied. The Event Director must approve this event before it can be ridden", { classname: 'bg-success text-light', delay: 3000 });
    }
    catch (e) {
      if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
      else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
      this.event._id = origId;
      return;
    }
  }

  async requestApproval(){

    let params = {
      _id: this.event._id,
      adminGroup: this.event.adminGroup
    };
    try {
      //await this.rest.post('/eventData/reqApp', params, { 'Authorization': localStorage.getItem("token") });
      this.alertsService.show("The Event Director has been e-mailed...", { classname: 'bg-success text-light', delay: 3000 });
    }
    catch (e) {
      if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
      else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
    }
    
  }

  addEvent(): void {
    this.selectedEventId = null;
    this.event = {
      _id: null,
      aaaPoints: 0,
      aukPoints: 0,
      body: null,
      category: null,
      climb: 0,
      description: null,
      distance: 0,
      eventDate: null,
      eventType: "P",
      postalFee: 0,
      onlineFee: 0,
      paymentMethod: 'Both',
      maxSpeed: 0,
      minSpeed: 0,
      name: null,
      organiser: null,
      adminGroup: this.globals.user.adminGroup,
      reversible: false,
      altStart: false,
      flexStart: false,
      eventStatus: 'Draft',
      start: {
        description: null,
        latitude: 51.47432,
        longitude: 0.00001
      },
      facilityToilets: false,
      facilityGPS: false,
      facilityMudguards: false,
      facilityXRate: false,
      trackFileURL: null,
      routeFileURL: null,
      controls: [
        {
          name: "New control",
          latitude: 51.47432,
          longitude: 0.00001,
          distance: 0,
          infoQuestion: null
        }
      ]
    }
    this.setMarkers(true);
  }


  // populate map details - but only if the event has a start location
  setMap(): void {


    this.map = L.map('mapId');
    this.markerGroup = new L.layerGroup();
    var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, { minZoom: 8, maxZoom: 18, attribution: osmAttrib });

    this.icon = L.icon({
      iconUrl: '../../../assets/images/icons/marker-icon.png',
      shadowUrl: '',

      iconSize: [25, 41], // size of the icon
      shadowSize: [0, 0], // size of the shadow - for default icon, shadow will not show (bug??) so disabled it...
      iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 0],  // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    this.map.doubleClickZoom.disable();   // add a custom start

    this.map.on('dblclick', (e) => {
      this.event.controls.push({
        name: "New control",
        latitude: +e.latlng.lat.toFixed(5),
        longitude: +e.latlng.lng.toFixed(5),
        distance: 0,
        infoQuestion: null
      });
      this.setMarkers(false); // refresh map to show new marker
    });

    this.map.addLayer(osm);



  }

  setMarkers(refresh: boolean): void {

    if (!this.map) this.setMap();
    if (refresh) this.map.setView([this.event.start.latitude, this.event.start.longitude], 12);

    this.markerGroup.clearLayers(); // remove and re-create the markers, to allow for changes to the custom start

    for (let i = 0; i < this.event.controls.length; i++) {
      let control = this.event.controls[i]
      let marker = L.marker([control.latitude, control.longitude], { icon: this.icon, title: control.name, draggable: 'true', id: i });
      marker.bindPopup("<p>" + control.name + "</p><p>Lat: " + control.latitude + ", Long: " + control.longitude + "</p>").openPopup();


      marker.on('dragend', (e) => {
        var marker = e.target;
        var position = marker.getLatLng();
        this.event.controls[i].latitude = +position.lat.toFixed(5);
        this.event.controls[i].longitude = +position.lng.toFixed(5);
        marker.bindPopup("<p>" + control.name + "</p><p>Lat: " + control.latitude + ", Long: " + control.longitude + "</p>");
      });

      this.markerGroup.addLayer(marker);
    }
    this.markerGroup.addTo(this.map);
  }

  selectControl(index){
    this.selectedControl = index;
  }

  moveControl(direction): void {
    if ((this.selectedControl + direction) < 0) {
      alert("At start");
      return;
    }
    if ((this.selectedControl + direction) >= this.event.controls.length) {
      alert("At end");
      return;
    }
    this.event.controls.splice(this.selectedControl + direction, 0, this.event.controls.splice(this.selectedControl, 1)[0]);
    this.selectedControl += direction;
    this.setMarkers(false);
  }

  clearControl(): void {
    this.event.controls.splice(this.selectedControl, 1);
    if(this.selectedControl >= this.event.controls.length) this.selectedControl--;
    this.setMarkers(false);
  }

  setSpeed(): void{
    if(this.event.category === "BRM"){
      if(this.event.distance <1000 ) this.event.minSpeed = 15;
      else this.event.minSpeed = 13.33;
    }
  }

  readFile(files: File[], source): void {
    console.log(Object.keys(this.uploadFile));
    this.uploadFile[source] = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadBuffer[source] = reader.result;
    }
    reader.readAsArrayBuffer(this.uploadFile[source]);
  }

  async upload(source) {

    try {   

      if(!this.uploadFile[source]) throw {error: {message: "Please select a file"}};
      if(permittedFileTypes[source].indexOf(this.uploadFile[source].name.split("\.").pop().toLowerCase()) == -1) throw {error: {message: "Invalid file type - must be .fit, .gpx, .tcx or .zip"}};
      if(this.uploadFile[source].size > (maxFileSize * 1048576)) throw {error: {message: `File too large - must be less than ${maxFileSize} MB`}};
      
      let params = {
        eventId: this.event._id,
        fileName: `${source}/${this.uploadFile[source].name}`,
        source: source
      };
      
      let response = <any>(await this.rest.post('/eventData/uploadURL', params, { 'Authorization': localStorage.getItem("token") }));
      console.log(response);
      console.log(this.uploadFile[source].type);
      await fetch(response.url, { method: 'PUT', body: this.uploadBuffer[source], headers: {'content-type': this.uploadFile[source].type}})
      this.alertsService.show("File uploaded.", { classname: 'bg-success text-light', delay: 3000 });
      if(source === "notes") this.event.routeFileURL = `notes/${this.event._id}.${this.uploadFile[source].type}`;
      else this.event.trackFileURL = `track/${this.event._id}.${this.uploadFile[source].type}`;
      // https://www.geeksforgeeks.org/how-to-reset-selected-file-with-input-tag-file-type-in-angular-9/
      // https://blog.angular-university.io/angular-file-upload/
    }
    catch (e) {
      if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
      else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
      console.log(e.error);
    }
  }

  checkEdit(name): boolean{
    let statusMap = this.refDataService.eventStatusMap();
    for (let group of this.globals.user.groups){
      if(statusMap[name][group] && statusMap[name][group].includes(this.event.eventStatus)) return false;
    }
    return true;
  }

  async payRegistration() {
    let res = await this.rest.post('/payment/create', {memberId:this.globals.user._id, eventId: this.event._id}, {});
    this.router.navigate(['payments/payment', res['client_secret']]);
  }
}

