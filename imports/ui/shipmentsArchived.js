import {
    Template
} from 'meteor/templating';
import * as Shipments from '../api/shipments.js';

import './truckTable.js';

import './shipmentsArchived.html';





Template.shipmentsArchived.helpers({
    shipments_archived() {
        return Shipments.select_archived();
    },
    availableActions() {
        return null;
    },
});