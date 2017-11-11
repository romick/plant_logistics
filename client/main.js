import {
    Template
} from 'meteor/templating';
import {
    ReactiveVar
} from 'meteor/reactive-var';

import '../imports/startup/accounts-config.js';
import '../imports/ui/fileList.js';
import '../imports/ui/shipmentDetails.js';
import '../imports/ui/shipment.js';
import '../imports/ui/shipmentsList.js';
// TODO: make a list grouped by date of arrival (require reactive aggregate support)
// import '../imports/ui/groupedShipmentsList.js';
// import '../imports/ui/shipmentsList.js';

import '../imports/ui/truckTable.js';
import '../imports/ui/body.js';