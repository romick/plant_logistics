import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';

export const Shipments = new Mongo.Collection('shipments');

export function select_created() {
    return Shipments.find({
        "history.created": {
            $exists: true
        },
        "history.arrived": {
            $exists: false
        },
        "history.archived": {
            $exists: false
        },
    });
};


export function select_arrived() {
    return Shipments.find({
        "history.arrived": {
            $exists: true
        },
        "history.entered": {
            $exists: false
        },
        "history.archived": {
            $exists: false
        },
    });
};

export function select_waiting_loading() {
    return Shipments.find({
        "history.entered": {
            $exists: true
        },
        "history.loaded": {
            $exists: false
        },
        "history.unloaded": {
            $exists: false
        },
        "history.archived": {
            $exists: false
        },
        shipment_type: {
            $in: ["TC_truck", "TC_container", "DRX_truck", "DRX_container", ]
        }
    });
};

export function select_waiting_unloading() {
    return Shipments.find({
        "history.entered": {
            $exists: true
        },
        "history.loaded": {
            $exists: false
        },
        "history.unloaded": {
            $exists: false
        },
        "history.archived": {
            $exists: false
        },
        shipment_type: {
            $in: ["WR", "ISC_container", "Other", "", ]
        }
    });
};

export function select_waiting_docs_TC() {
    return Shipments.find({
        "history.loaded": {
            $exists: true
        },
        "history.documented": {
            $exists: false
        },
        "history.archived": {
            $exists: false
        },
        shipment_type: {
            $in: ["TC_truck", "TC_container", ]
        }
    });
};

export function select_waiting_docs_DRX() {
    return Shipments.find({
        "history.loaded": {
            $exists: true
        },
        "history.documented": {
            $exists: false
        },
        "history.archived": {
            $exists: false
        },
        shipment_type: {
            $in: ["DRX_truck", "DRX_container", ]
        }
    });
};

export function select_leaving() {
    return Shipments.find({
        $or: [{
            "history.documented": {
                $exists: true
            }
        }, {
            "history.unloaded": {
                $exists: true
            }
        }],
        "history.archived": {
            $exists: false
        },
    });
};

export function select_archived() {
    return Shipments.find({
        "history.archived": {
            $exists: true
        },
    });
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

if (Meteor.isServer) {
    Meteor.publish('shipments.all', function() {
        return Shipments.find();
    });
    Meteor.publish('shipments.arrived', function() {
        return Shipments.find({
            "history.arrived": {
                $exists: true
            },
            "history.entered": {
                $exists: false
            },
            "history.archived": {
                $exists: false
            },
        });
    });
};