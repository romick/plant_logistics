import {
    Template
} from 'meteor/templating';

import './shipmentsList.js';
import './groupedShipmentsList.js';

import './truckTable.html';

Template.truckTable.helpers({
    selectUnique(collection, property) {
        // console.log(collection.fetch());
        // console.log(property)
        return _.uniq(_.pluck(collection.fetch(), property));
    },
});