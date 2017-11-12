import {
    Meteor
} from 'meteor/meteor';

import {
    Template
} from 'meteor/templating';
import * as Shipments from '../api/shipments.js';

// import {
//     calendar
// } from 'semantic-ui-calendar';


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

Template.body.helpers({

    count_ontheway() {
        return Shipments.select_created().count();
    },

    count_arrived() {
        return Shipments.select_arrived().count();
    },

    count_entered() {
        return Shipments.select_waiting_loading().count() + Shipments.select_waiting_unloading().count();
    },

    count_released() {
        return Shipments.select_waiting_docs_TC().count() + Shipments.select_waiting_docs_DRX().count();
    },

    count_leaving() {
        return Shipments.select_leaving().count();
    },

    menuContent() {
        return [{
            text: "Add new",
            link: "/shipments/Add",
        }, {
            text: "On the way",
            link: "/shipments/OnTheWay",
        }, {
            text: "Arrived",
            link: "/shipments/Arrived",
        }, {
            text: "Waiting loading & unloading",
            link: "/shipments/Entered",
        }, {
            text: "Waiting documents",
            link: "/shipments/Released",
        }, {
            text: "Leaving",
            link: "/shipments/Leaving",
        }, {
            text: "Archive",
            link: "/shipments/Archived",
        }, ];
    },


});


Template.body.onCreated(function() {

    // this.state = new ReactiveDict();
    Meteor.subscribe('shipments.all');

});