import {
    Meteor
} from 'meteor/meteor';

import {
    Template
} from 'meteor/templating';

import {
    Images
} from '../api/attachments.js';

import './upload.js';
import './fileList.js';

import './shipmentDetails.html';

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

Template.shipmentDetails.onRendered(function() {
    Meteor.subscribe('files.images.all');

});
Template.shipmentDetails.onRendered(function() {
    // update_ui_hooks();

});

Template.shipmentDetails.events({

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

        sAlert.success("Added shipment!");
        // Clear form
        target.sh_type.value = '';
        target.text.value = '';
        target.plate.value = '';
        target.driver.value = '';
        target.expected_arrival_time.value = '';
        target.attached_files.value = '';
        $('#fileInput').trigger($.Event('clean_tempUploaded', {}));


    },


});