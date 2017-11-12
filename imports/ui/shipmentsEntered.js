import {
    Template
} from 'meteor/templating';
import * as Shipments from '../api/shipments.js';

import './truckTable.js';

import './shipmentsEntered.html';




Template.shipmentsEntered.helpers({
    shipments_waiting_loading() {
        return Shipments.select_waiting_loading();
    },

    shipments_waiting_unloading() {
        return Shipments.select_waiting_unloading();
    },

    availableActions(current_status) {
        if (current_status == "waiting_loading") {
            return ["loaded"]
        } else if (current_status == "waiting_unloading") {
            return ["unloaded"]
        };
    },
});