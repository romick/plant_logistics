import {
    Template
} from 'meteor/templating';

import {
    Shipments
} from '../api/shipments.js';

import {
    Images
} from '../api/attachments.js';


import './upload.js';

import './body.html';


Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

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
        const attached_files = target.attached_files.value.split(" ").clean("");

        // Insert a task into the collection
        if (attached_files.length < 1) {
            Shipments.insert({
                text,
                truck_plate,
                driver_name,
                shipment_type,
                history: {
                    created: {
                        time: new Date(),
                        user: Meteor.user().username,
                    }
                }
            });
        } else {
            Shipments.insert({
                text,
                truck_plate,
                driver_name,
                shipment_type,
                attached_files,
                history: {
                    created: {
                        time: new Date(),
                        user: Meteor.user().username,
                    }
                }
            });

        }

        // Clear form
        target.sh_type.value = '';
        target.text.value = '';
        target.plate.value = '';
        target.driver.value = '';
        target.attached_files.value = '';
        $('#fileInput').trigger($.Event('clean_tempUploaded', {}));

    },

    'click .shipment-arrived' () {
        Shipments.update(this._id, {
            $set: {
                "history.arrived": {
                    "time": new Date(),
                    "user": Meteor.user().username,
                }
            }
        });
    },
    'click .shipment-entered' () {
        Shipments.update(this._id, {
            $set: {
                "history.entered": {
                    "time": new Date(),
                    "user": Meteor.user().username,
                }
            }
        });
    },
    'click .shipment-loaded' () {
        Shipments.update(this._id, {
            $set: {
                "history.loaded": {
                    "time": new Date(),
                    "user": Meteor.user().username,
                }
            }
        });
    },
    'click .shipment-unloaded' () {
        Shipments.update(this._id, {
            $set: {
                "history.unloaded": {
                    "time": new Date(),
                    "user": Meteor.user().username,
                }
            }
        });
    },
    'click .shipment-documented' () {
        Shipments.update(this._id, {
            $set: {
                "history.documented": {
                    "time": new Date(),
                    "user": Meteor.user().username,
                }
            }
        });
    },
    'click .shipment-left' () {
        Shipments.update(this._id, {
            $set: {
                "history.left": {
                    "time": new Date(),
                    "user": Meteor.user().username,
                }
            }
        });
        Shipments.update(this._id, {
            $set: {
                "history.archived": {
                    "time": new Date(),
                    "user": Meteor.user().username,
                }
            }
        });
    },
    'click .shipment-delete' () {
        Shipments.update(this._id, {
            $set: {
                "history.cancelled": {
                    "time": new Date(),
                    "user": Meteor.user().username,
                }
            }
        });
        Shipments.update(this._id, {
            $addToSet: {
                "history.archived": {
                    "time": new Date(),
                    "user": Meteor.user().username,
                }

            }
        });
    },

    'click .openShipment' () {
        $('#' + this._id)
            .modal({
                onDeny: function() {
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

function update_ui_hooks() {
    $('.menu .item').tab({});
    // $('select.dropdown').dropdown();
    // $('select.dropdown').val($('select.dropdown').attr("value"))
    // console.log($('select.dropdown').attr("value"));
}

Template.body.onRendered(update_ui_hooks);

Template.shipmentDetails.helpers({
    selectImages(ids) {
        const imgs = Images.find({
            _id: {
                $in: ids
            }
        });
        return imgs;
    },

    notEmpty(list) {
        if (list.count() > 0) {
            return true;
        } else {
            return false;
        }
    },

});

Template.shipmentDetails.onRendered(update_ui_hooks);