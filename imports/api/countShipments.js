import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';

// import {
//     Shipments
// } from './shipments.js';


export const ShipmentsTotals = new Mongo.Collection('shipments_totals');

if (Meteor.isServer) {
    Meteor.publish('shipments.totals', function() {
        return ShipmentsTotals.find();
    });
};