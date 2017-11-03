import {
    Template
} from 'meteor/templating';

import {
    Shipments
} from '../api/shipments.js';

import './body.html';


function select_created() {
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

function select_arrived() {
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

function select_waiting_loading() {
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

function select_waiting_unloading() {
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

function select_waiting_docs_TC() {
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

function select_waiting_docs_DRX() {
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

function select_leaving() {
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
}

Template.body.helpers({

    shipments_created() {
        return select_created();
    },

    count_ontheway() {
        return select_created().count();
    },

    shipments_arrived() {
        return select_arrived();
    },

    count_arrived() {
        return select_arrived().count();
    },

    shipments_waiting_loading() {
        return select_waiting_loading();
    },

    shipments_waiting_unloading() {
        return select_waiting_unloading();
    },

    count_entered() {
        return select_waiting_loading().count() + select_waiting_unloading().count();
    },

    shipments_waiting_docs_TC() {
        return select_waiting_docs_TC();
    },

    shipments_waiting_docs_DRX() {
        return select_waiting_docs_DRX();
    },

    count_released() {
        return select_waiting_docs_TC().count() + select_waiting_docs_DRX().count();
    },

    shipments_leaving() {
        return select_leaving();
    },

    count_leaving() {
        return select_leaving().count();
    },

    shipments_archived() {
        return Shipments.find({
            "history.archived": {
                $exists: true
            },
        });
    },

});

Template.body.events({

    'submit .new-shipment' (event) {

        // Prevent default browser form submit
        event.preventDefault();
        // Get value from form element
        const target = event.target;
        const text = target.text.value;
        const truck_plate = target.plate.value;
        const driver_name = target.driver.value;
        const shipment_type = target.sh_type.value;
        // Insert a task into the collection
        Shipments.insert({
            text,
            truck_plate,
            driver_name,
            shipment_type,
            history: {
                created: {
                    time: new Date()
                }
            }
            // user: Accounts.
        });

        // Clear form
        target.sh_type.value = '';
        target.text.value = '';
        target.plate.value = '';
        target.driver.value = '';
    },

    'click .shipment-arrived' () {
        Shipments.update(this._id, {
            $set: {
                "history.arrived.time": new Date()
            }
        });
    },
    'click .shipment-entered' () {
        Shipments.update(this._id, {
            $set: {
                "history.entered.time": new Date()
            }
        });
    },
    'click .shipment-loaded' () {
        Shipments.update(this._id, {
            $set: {
                "history.loaded.time": new Date()
            }
        });
    },
    'click .shipment-unloaded' () {
        Shipments.update(this._id, {
            $set: {
                "history.unloaded.time": new Date()
            }
        });
    },
    'click .shipment-documented' () {
        Shipments.update(this._id, {
            $set: {
                "history.documented.time": new Date()
            }
        });
    },
    'click .shipment-left' () {
        Shipments.update(this._id, {
            $set: {
                "history.left.time": new Date()
            }
        });
        Shipments.update(this._id, {
            $set: {
                "history.archived.time": new Date()
            }
        });
    },
    'click .shipment-delete' () {
        Shipments.update(this._id, {
            $set: {
                "history.cancelled.time": new Date()
            }
        });
        Shipments.update(this._id, {
            $addToSet: {
                "history.archived.time": new Date()

            }
        });
    },

    'click .openShipment' () {
        // console.log(this);
        console.log($('#' + this._id).contents());
        console.log('#' + this._id);
        $('#' + this._id)
            .modal({
                onDeny: function() {
                    console.log('canceled');
                    // return false;
                },
                // onApprove: function() {
                //     var modalInputValue = $('#modalInputValue').val();
                //     Session.set("formValue", modalInputValue);
                // }
            })
            .modal('show');
    },
});
Template.body.onRendered(function() {
    $('.menu .item').tab({});
    $('select.dropdown').dropdown();
    // $('select.dropdown').val($('select.dropdown').value())
});