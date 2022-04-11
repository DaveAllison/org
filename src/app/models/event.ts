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
    eventType: string,
    paymentMethod: string,
    postalFee: number,
    onlineFee: number,
  ​​  maxSpeed: number,
  ​​  minSpeed: number,
  ​​  name: string,
  ​​  organiser: string,
    adminGroup: string,
    reversible: boolean,
    altStart: boolean,
    flexStart: boolean,
    eventStatus: string,
    start: {
      description: string,
      latitude: number,
      longitude: number
    },
    facilityToilets: boolean,
    facilityGPS: boolean,
    facilityMudguards: boolean,
    facilityXRate: boolean,
    trackFileURL: string,
    routeFileURL: string,
    controls: [
      {
        name: string,
        latitude: number,
        longitude: number,
        distance: number,
        infoQuestion: string
      }
    ],
    registrationFeePaid: boolean,
    registrationOrderId: number
  }