import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import swal from 'sweetalert2';

@Injectable()
export class NotificationService {

  constructor() { }

  private messages = {

    incomeAdd: {
      success: {
        title: 'Income added successfully'
      },
      error: {
        title: 'Income add failed'
      }
    },
    incomeUpdate: {
      success: {
        title: 'Income updateded successfully'
      },
      error: {
        title: 'Income update failed'
      }
    },
    incomeRemove: {
      success: {
        title: 'Income removed successfully'
      },
      error: {
        title: 'Failed to remove Income'
      },
      warning: {
        title: 'Are you sure?',
        text: 'Income will be removed'
      }
    },
    expenseAdd: {
      success: {
        title: 'Expense added successfully'
      },
      error: {
        title: 'Expense add failed'
      }
    },
    expenseUpdate: {
      success: {
        title: 'Expense updateded successfully'
      },
      error: {
        title: 'Expense update failed'
      }
    },
    expenseRemove: {
      success: {
        title: 'Expense removed successfully'
      },
      error: {
        title: 'Failed to remove Expense'
      },
      warning: {
        title: 'Are you sure?',
        text: 'Expense will be removed'
      }
    }
  };

  notify(action: string, type: string, options?: any) {
    let defaultOptions = {
      showCloseButton: true,
      type: type,
    };
    if(type != 'error') {
      defaultOptions['timer'] = 5000;
    }
    let swalOptions : any = this.messages[action][type];

    swalOptions = _.extend(swalOptions, options);
    swalOptions = _.extend(defaultOptions, swalOptions);

    swal(swalOptions);
  }

  confirm(action: string, callback: () => any, successCallback: () => any, errorCallback: (dismiss: string) => any) {
    let defaultOptions = {
      showCloseButton: true,
      type: 'warning',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Remove',
      preConfirm: callback
    };
    let swalOptions : any = this.messages[action]['warning'];

    swalOptions = _.extend(defaultOptions, swalOptions);

    return swal(swalOptions).then(successCallback, errorCallback);
  }
}
