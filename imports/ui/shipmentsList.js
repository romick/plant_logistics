import {
    Template
} from 'meteor/templating';
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