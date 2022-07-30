export interface Event {
    _id:number,
    aaaPoints: number,
    aukPoints: number
    body: string,
    category: string,
    climb: number,
    description: string,
    distance: number,
    eventDate: Date,
    entryOpenDate: Date,
    entryCloseDate: Date,
    maxRiders: number,
    eventType: string,
    paymentMethod: string,
    postalFee: number,
    onlineFee: number,
  ​​  maxSpeed: number,
  ​​  minSpeed: number,
  ​​  name: string,
    adminGroup: string,
    primaryOrganiserId: number,
    reversible: boolean,
    altStart: boolean,
    flexStart: boolean,
    eventStatus: string,
    eventRequestedStatus: string,
    start: {
      description: string,
      latitude: number,
      longitude: number
    },
    facilityCamping: boolean,
    facilityToilets: boolean,
    facilityGPS: boolean,
    facilityLuggage: boolean,
    facilityMudguards: boolean,
    facilityParking: boolean,
    facilityRefreshmentsStart: boolean,
    facilityXRate: boolean,
    trackFileURL: string,
    routeFileURL: string,
    controls: [
      {
        name: string,
        latitude: number,
        longitude: number,
        distance: number,
        proximity: number,
        infoQuestion: string,
        infoAnswer: string
      }
    ],
    registrationFeePaid: boolean,
    registrationOrderId: number,
    risks: [
      {
        hazard: string,
        mitigation: string,
        createdBy: number, 
        createdDate: Date,
        updatedDate: Date
      }
    ]
  }