import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';

import {
    ShipmentsTotals
} from '../api/countShipments.js';


export const Shipments = new Mongo.Collection('shipments');

export function select_created() {
    return Shipments.find({
        "status": "created",
    });
};


export function select_arrived() {
    return Shipments.find({
        "status": "arrived",
    });
};

export function select_waiting_loading() {
    return Shipments.find({
        "status": "entered",
        shipment_type: {
            $in: ["TC_truck", "TC_container", "DRX_truck", "DRX_container", ]
        },
    });
};

export function select_waiting_unloading() {
    return Shipments.find({
        "status": "entered",
        shipment_type: {
            $in: ["WR", "ISC_container", "Other", "", ]
        }
    });
};

export function select_waiting_docs_TC() {
    return Shipments.find({
        "status": "loaded",
        shipment_type: {
            $in: ["TC_truck", "TC_container", ]
        }
    });
};

export function select_waiting_docs_DRX() {
    return Shipments.find({
        "status": "loaded",
        shipment_type: {
            $in: ["DRX_truck", "DRX_container", ]
        }
    });
};

export function select_leaving() {
    return Shipments.find({
        $or: [{
            "status": "documented",
        }, {
            "status": "unloaded",
        }]
    });
};

export function select_archived() {
    return Shipments.find({
        "status": "archived",
    });
};

function refresh_totals() {
    if (Meteor.isServer) {
        const totals = Shipments.aggregate([{
            $group: {
                _id: "$status",
                count: {
                    $sum: 1
                }
            }
        }]);

        _.each(totals, function(e) {
            ShipmentsTotals.upsert({
                _id: e._id
            }, {
                $set: {
                    count: e.count
                }
            });
        });
    };
};


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
                status: "created",
                history: [{
                    status: "created",
                    time: new Date(),
                    user: Meteor.user().username,
                }, ]
            });
        } else {
            Shipments.insert({
                text,
                truck_plate,
                driver_name,
                shipment_type,
                expected_arrival_time,
                attached_files,
                status: "created",
                history: [{
                    status: "created",
                    time: new Date(),
                    user: Meteor.user().username,
                }, ]
            });

        }
        refresh_totals();
    },

    'shipment.action' (shipmentId, action_name) {
        var hist = {};
        hist = {
            "status": action_name,
            "time": new Date(),
            "user": Meteor.user().username,
        };
        // hist["current_status"] = action_name;
        // console.log(hist);
        Shipments.update(shipmentId, {
            $set: {
                status: action_name
            },
            $push: {
                history: hist
            }
        });

        refresh_totals();

        if (action_name == "left" || action_name == "cancelled") {
            Meteor.call('shipment.action', shipmentId, "archived")
        };

    },
});

if (Meteor.isServer) {
    Meteor.publish('shipments.all', function() {
        return Shipments.find();
    });
};