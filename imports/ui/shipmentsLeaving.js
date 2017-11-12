import {
    Template
} from 'meteor/templating';
import * as Shipments from '../api/shipments.js';

import './truckTable.js';

import './shipmentsLeaving.html';




Template.shipmentsLeaving.helpers({
    shipments_leaving() {
        return Shipments.select_leaving();
    },

    availableActions() {
        return ["left"];
    },
});