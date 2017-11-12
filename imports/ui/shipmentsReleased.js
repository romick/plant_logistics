import {
    Template
} from 'meteor/templating';
import * as Shipments from '../api/shipments.js';

import './truckTable.js';

import './shipmentsReleased.html';



Template.shipmentsReleased.helpers({
    shipments_waiting_docs_TC() {
        return Shipments.select_waiting_docs_TC();
    },

    shipments_waiting_docs_DRX() {
        return Shipments.select_waiting_docs_DRX();
    },

    availableActions(current_status) {
        return ["documented"];
    },
});