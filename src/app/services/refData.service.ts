import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RefDataService {

  constructor() { }

  roles(): string[] {
    return ["cal-admin", "perm-admin", "event-organiser", "mentor", "validator"];
  }

  entryStatuses(): string[] {
    return ['Entered', 'Finished', 'Did not finish', 'Void', 'Withdrawn'];
  }

  completedEntryStatuses(): string[] {
    return ['Validated', 'Did not start', 'Did not finish', 'Void'];
  }

  incidentStatuses(): string[] {
    return ['Nil Return', 'Minor', 'Major'];
  }

  controlTypes(): string[] {
    return ['Control', 'Checkpoint', 'Info', 'Secret'];
  }

  cycleTypes(): string[] {
    return ['Solo', 'Tandem', 'Tricycle', 'Recumbent'];
  }

  eventCategories(): string[] {
    return ['BP', 'BR', 'BRM', 'BRM-PBP', 'LRM', 'RM'];
  }

  eventOrgStatuses(): string[] {
    return ['Project', 'Planned', 'Published', 'Ready', 'Cancelled', 'Closed'];
  }

  eventOrgLevels(): number[] {
    return [1, 2, 3];
  }

  eventAdminStatuses(): string[] {
    return ['Project', 'Planned', 'Published', 'Ready', 'Cancelled', 'Validation', 'Closed'];
  } 

  eventDistances(): number[] {
    return [50, 100, 150, 200, 300, 400, 500, 600, 1000, 1100, 1200, 1300, 1400, 1500, 2000, 3000, 4000];
  }

  eventStatusMap(): any {
    return {
      a: {
        "event-organiser":['Project', 'Planned'],
        "cal-admin": ['Project', 'Planned', 'Published', 'Ready', 'Cancelled', 'Closed'],
        "perm-admin": ['Project', 'Planned', 'Published', 'Ready', 'Cancelled', 'Closed']
      },
      b: {
        "event-organiser":['Project', 'Planned', 'Published'],
        "cal-admin": ['Project', 'Planned', 'Published', 'Ready', 'Cancelled', 'Closed'],
        "perm-admin": ['Project', 'Planned', 'Published', 'Ready', 'Cancelled', 'Closed']
      },
      c: {
        "event-organiser":[],
        "cal-admin": ['Project', 'Planned', 'Published', 'Ready', 'Cancelled', 'Closed'],
        "perm-admin": ['Project', 'Planned', 'Published', 'Ready', 'Cancelled', 'Closed']
      }
    };
  }
}
