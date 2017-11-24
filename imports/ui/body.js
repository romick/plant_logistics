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

import {
    ShipmentsTotals
} from '../api/countShipments.js';



import './body.html';

// const shipmentsTotalsByState = new Mongo.Collection(null);

Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

Template.body.events({
    'click .linker' () {
        $('.ui.sidebar').sidebar('hide');
    },
});

Template.body.helpers({

    count_ontheway() {
        return ShipmentsTotals.find({
            "_id": "created"
        });
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

    all_counts() {
        // console.log(ShipmentsTotals.find({
        //     "uid": 0
        // }).count());
        return ShipmentsTotals.find({});
    },

    menuContent() {
        let content = [{
            text: "Add new",
            link: "/shipments/Add",
            dataset: [],
        }, {
            text: "On the way",
            link: "/shipments/OnTheWay",
            dataset: ["created"],
        }, {
            text: "Arrived",
            link: "/shipments/Arrived",
            dataset: ["arrived"],
        }, {
            text: "Waiting loading & unloading",
            link: "/shipments/Entered",
            dataset: ["entered"],
        }, {
            text: "Waiting documents",
            link: "/shipments/Released",
            dataset: ["loaded"],
        }, {
            text: "Leaving",
            link: "/shipments/Leaving",
            dataset: ["unloaded", "documented"],
        }, {
            text: "Archive",
            link: "/shipments/Archived",
            dataset: ["archived"],
        }, ];

        const totals = ShipmentsTotals.find({}).fetch();
        if (totals.length) {
            content = _.map(content, function(item) {
                const sum = _.reduce(item.dataset, function(memo1, data) {
                    return memo1 + _.reduce(totals, function(memo2, t) {
                        if (t._id == data) {
                            return memo2 + t.count;
                        } else {
                            return memo2;
                        };
                    }, 0);
                }, 0);
                item["totals"] = sum;
                return item;
            });
        };
        return content;
    },


});


Template.body.onCreated(function() {

    // this.state = new ReactiveDict();
    Meteor.subscribe('shipments.all');
    Meteor.subscribe('shipments.totals');
    BlazeLayout.setRoot('div.blazeRoot');
    // Meteor.subscribe('shipmentsTotalsByState');
    // console.log(ServerSession.get("statuses"));
});

Template.body.rendered = function() {
    // body...
    $('.ui.sidebar').sidebar('attach events', '.toc');
    $('.ui.sidebar').sidebar('hide');
};