import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  getDatesfromPeriod(period: string):[Date,Date]{
    let uot: moment.unitOfTime.StartOf;
    let start: any;
    let end: any;
    switch (period){
      case 'yesterday':
        uot = 'day';
        start = moment().subtract(1, 'day').startOf(uot);
        end = moment().subtract(1, 'day').endOf(uot);
        break;
      case 'today':
        uot = 'day';
        start = moment().startOf(uot);
        end = moment().endOf(uot);
        break;
      case 'thisWeek':
        uot = 'week';
        start = moment().startOf(uot);
        end = moment().endOf(uot);
        break;
      case 'thisMonth':
        uot = 'month';
        start = moment().startOf(uot);
        end = moment().endOf(uot);
        break;
      case 'thisQuarter':
        uot = 'quarter';
        start = moment().startOf(uot);
        end = moment().endOf(uot);
        break;
      case 'thisYear':
        uot = 'year';
        start = moment().startOf(uot);
        end = moment().endOf(uot);
        break;
      case 'last7Days':
        uot = 'day';
        start = moment().add(1, 'day').subtract(7, 'day').startOf(uot);
        end = moment().endOf(uot);
        break;
      case 'lastMonth':
        uot = 'month';
        start = moment().add(-1, 'month').startOf(uot);
        end = moment().add(-1, 'month').endOf(uot);
        break;
      case 'last3Months':
        uot = 'month';
        start = moment().add(-3, 'month').startOf(uot);
        end = moment().endOf(uot);
        break;
      case 'last6Months':
          uot = 'month';
          start = moment().add(-6, 'month').startOf(uot);
          end = moment().endOf(uot);
          break;
    };
    return [start.toDate(),end.toDate()];
  }
}
