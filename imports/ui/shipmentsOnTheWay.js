import {
    Template
} from 'meteor/templating';
import * as Shipments from '../api/shipments.js';

import './truckTable.js';

import './shipmentsOnTheWay.html';



Template.shipmentsOnTheWay.helpers({
    shipments_created() {
        return Shipments.select_created();
    },
    availableActions() {
        return ["arrived", "cancelled"];
    },

});