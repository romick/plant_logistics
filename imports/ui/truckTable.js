import {
    Template
} from 'meteor/templating';
import './truckTable.html';

Template.truckTable.helpers({
    selectUnique(collection, property) {
        // console.log(collection.fetch());
        // console.log(property)
        return _.uniq(_.pluck(collection.fetch(), property));
    },
});