import {
    Template
} from 'meteor/templating';

import {
    Shipments
} from '../api/shipments.js';

import {
    Images
} from '../api/attachments.js';

import './body.html';

function initTempUpload() {
    return {
        list: [],
        data: ""
    };
};

Template.uploadForm.onCreated(function() {
    this.currentUpload = new ReactiveVar(false);
    this.tempUploaded = new ReactiveVar(initTempUpload());
});

Template.uploadForm.helpers({
    currentUpload() {
        return Template.instance().currentUpload.get();
    },
    tempUploaded() {
        return Template.instance().tempUploaded.get();
    },
    selectImages(ids) {
        const imgs = Images.find({
            _id: {
                $in: ids
            }
        });
        return imgs;
    },
});

Template.uploadForm.events({
    'change #fileInput' (e, template) {
        if (e.currentTarget.files && e.currentTarget.files[0]) {
            // We upload only one file, in case
            // multiple files were selected
            const upload = Images.insert({
                file: e.currentTarget.files[0],
                streams: 'dynamic',
                chunkSize: 'dynamic'
            }, false);

            upload.on('start', function() {
                template.currentUpload.set(this);
            });

            upload.on('end', function(error, fileObj) {
                if (error) {
                    alert('Error during upload: ' + error);
                } else {
                    // alert('File "' + fileObj.name + '" successfully uploaded');
                }
                template.currentUpload.set(false);
                const tucv = template.tempUploaded.curValue;
                var tunv = tucv;
                tunv.list.push(fileObj._id)
                template.tempUploaded.set(tunv);
            });

            upload.start();
        };
    },
    'clean_tempUploaded #fileInput ' () {
        Template.instance().tempUploaded.set(initTempUpload())
    },

});

Template.uploadForm.rendered = function() {
    $('#fileInput').trigger($.Event('clean_tempUploaded', {}));
};