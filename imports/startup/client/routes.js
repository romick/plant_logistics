import {
    FlowRouter
} from 'meteor/kadira:flow-router';
import {
    BlazeLayout
} from 'meteor/kadira:blaze-layout';
// import {
//     AccountsTemplates
// } from 'meteor/useraccounts:core';
// Import to load "routes" components
import '../../ui/shipmentsOnTheWay.js';
import '../../ui/shipmentsArrived.js';
import '../../ui/shipmentsEntered.js';
import '../../ui/shipmentsReleased.js';
import '../../ui/shipmentsLeaving.js';
import '../../ui/shipmentsArchived.js';

// Below here are the route definitions

FlowRouter.route('/shipments/:template', {
    name: 'Lists.show',
    action(params) {
        const template = 'shipments' + params.template;
        BlazeLayout.render('App_body', {
            main: template
        });
    }
});
FlowRouter.route('/', {
    name: 'Lists.show',
    action() {
        BlazeLayout.render('App_body', {
            main: 'shipmentsOnTheWay'
        });
    }
});


FlowRouter.route('/', {
    action(params) {
        FlowRouter.go('/shipments/OnTheWay');
    }
});