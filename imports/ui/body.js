import {
    Meteor
} from 'meteor/meteor';

import {
    Template
} from 'meteor/templating';
import {
    Shipments
} from '../api/shipments.js';

// import {
//     calendar
// } from 'semantic-ui-calendar';

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
    availableActions(current_status) {
        if (current_status == "ontheway") {
            return ["arrived", "cancelled"]
        } else if (current_status == "arrived") {
            return ["entered"]
        } else if (current_status == "waiting_loading") {
            return ["loaded"]
        } else if (current_status == "waiting_unloading") {
            return ["unloaded"]
        } else if (current_status == "released") {
            return ["documented"]
        } else if (current_status == "leaving") {
            return ["left"]
        }
    },
    menuContent() {
        return [{
            text: "Add new",
            link: "/shipments/add",
        }, {
            text: "On the way",
            link: "/shipments/ontheway"
        }, {
            text: "Arrived",
            link: "/shipments/arrived"
        }, {
            text: "Waiting loading/unloading",
            link: "/shipments/ontheway"
        }, {

        }, {

        }, ];
    },


});


Template.body.onCreated(function() {

    // this.state = new ReactiveDict();
    Meteor.subscribe('shipments.all');

});




Template.body.events({

    'submit .new-shipment' (event) {

        // Prevent default browser form submit
        event.preventDefault();
        // Get value from form element
        const target = event.target;
        const sh = {
            text: target.text.value,
            truck_plate: target.plate.value,
            driver_name: target.driver.value,
            shipment_type: target.sh_type.value,
            attached_files: target.attached_files.value.split(" ").clean(""),
            expected_arrival_time: target.expected_arrival_time.value,
        }

        Meteor.call('shipments.add', sh);
        // Clear form
        target.sh_type.value = '';
        target.text.value = '';
        target.plate.value = '';
        target.driver.value = '';
        target.expected_arrival_time.value = '';
        target.attached_files.value = '';
        $('#fileInput').trigger($.Event('clean_tempUploaded', {}));


    },

    'click .shipment-action' (e) {
        Meteor.call('shipment.action', this._id, e.target.attributes.data.value);
        // console.log();
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
    // $('#expected_arrival_datepicker').calendar();
    // $('select.dropdown').dropdown();
    // $('select.dropdown').val($('select.dropdown').attr("value"))
    // console.log($('select.dropdown').attr("value"));
}

Template.body.onRendered(update_ui_hooks);