import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RefDataService {

  constructor() { }

  entryStatuses(): string[] {
    return ['Entered', 'Finished', 'Did not start', 'Did not finish'];
  }

  cycleTypes(): string[] {
    return ['Solo', 'Tandem', 'Tricycle', 'Recumbent'];
  }

  eventOrgStatuses(): string[] {
    return ['Void', 'Draft', 'Submitted'];
  }

  eventAdminStatuses(): string[] {
    return ['Void', 'Draft', 'Submitted', 'Open', 'Cancelled', 'Closed'];
  } 

  eventDistances(): number[] {
    return [50, 100, 150, 200, 300, 400, 500, 600, 1000, 1100, 1200, 1300, 1400, 1500, 2000, 3000, 4000];
  }

  eventStatusMap(): any {
    return {
      a: {
        "event-organiser":['Void', 'Draft', 'Submitted'],
        "event-admin": ['Void', 'Draft', 'Submitted', 'Open', 'Cancelled', 'Closed']
      },
      b: {
        "event-organiser":['Void', 'Draft', 'Submitted', 'Open', 'Cancelled', 'Closed'],
        "event-admin": ['Void', 'Draft', 'Submitted', 'Open', 'Cancelled', 'Closed']
      }
    };
  }
}
