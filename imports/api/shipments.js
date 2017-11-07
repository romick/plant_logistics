import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';

export const Shipments = new Mongo.Collection('shipments');

Meteor.methods({
    'shipments.add' (sh) {


        // console.log(sh);

        const text = sh.text;
        const truck_plate = sh.truck_plate;
        const driver_name = sh.driver_name;
        const shipment_type = sh.shipment_type;
        const expected_arrival_time = sh.expected_arrival_time;
        const attached_files = sh.attached_files;
        // Insert a task into the collection
        if (attached_files.length < 1) {
            Shipments.insert({
                text,
                truck_plate,
                driver_name,
                shipment_type,
                expected_arrival_time,
                history: {
                    created: {
                        time: new Date(),
                        user: Meteor.user().username,
                    }
                },
            });
        } else {
            Shipments.insert({
                text,
                truck_plate,
                driver_name,
                shipment_type,
                expected_arrival_time,
                attached_files,
                history: {
                    created: {
                        time: new Date(),
                        user: Meteor.user().username,
                    }
                },
            });

        }


    },

    'shipment.action' (shipmentId, action_name) {
        var hist = {};
        hist["history." + action_name] = {
            "time": new Date(),
            "user": Meteor.user().username,
        };
        // console.log(hist);
        Shipments.update(shipmentId, {
            $set: hist
        });

        if (action_name == "left" || action_name == "cancelled") {
            Meteor.call('shipment.action', shipmentId, "archived")
        };

    },
});