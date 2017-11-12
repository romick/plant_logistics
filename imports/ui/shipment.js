import {
    Template
} from 'meteor/templating';

import './shipmentDetails.js';

import './shipment.html';

Template.shipment.events({
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