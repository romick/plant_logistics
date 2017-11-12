import {
    Template
} from 'meteor/templating';
import * as Shipments from '../api/shipments.js';

import './truckTable.js';

import './shipmentsArrived.html';





Template.shipmentsArrived.helpers({
    shipments_arrived() {
        return Shipments.select_arrived();
    },

    availableActions() {
        return ["entered"];
    },

});