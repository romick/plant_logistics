import {
    Template
} from 'meteor/templating';

import './shipment.js';

import './shipmentsList.html';

Template.shipmentsList.helpers({
    isAllowed(action) {
        // console.log(action);
        const check = Roles.userIsInRole(Meteor.user()._id, "mark-shipments-" + action);
        // console.log(check);
        return check;
    },

    isDangerous(action) {
        return (action == "cancelled")
    },

});

Template.shipmentsList.events({
    'click .shipment-action' (e) {
        Meteor.call('shipment.action', this._id, e.target.attributes.data.value);
        console.log("action triggered");
    },


});