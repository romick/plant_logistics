import {
    Meteor
} from 'meteor/meteor';

import {
    Template
} from 'meteor/templating';

import {
    Images
} from '../api/attachments.js';


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