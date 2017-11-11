import {
    Template
} from 'meteor/templating';
import './groupedShipmentsList.html';

Template.groupedShipmentsList.helpers({
    filterShipments(collection, field, value) {
        var selector = {};
        selector[field] = value;
        console.log(selector);
        console.log(collection.fetch().find(selector));
    },

});