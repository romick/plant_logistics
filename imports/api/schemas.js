import SimpleSchema from 'simpl-schema';
export let Schemas = {};
// export Schemas;

Schemas.Shipment = new SimpleSchema({
    text: {
        type: String,
        label: "Comment",
        max: 200,
        optional: true,
    },
    truck_company: {
        type: String,
        label: "Company",
        max: 30,
    },
    truck_plate: {
        type: String,
        label: "Plate",
        max: 20,
    },
    driver_name: {
        type: String,
        label: "Driver's name",
        max: 100,
    },
    driver_doc: {
        type: String,
        label: "Driver's passport",
        max: 200,
    },
    shipment_type: {
        type: String,
        label: "Type of shipment",
        max: 15,
    },
    expected_arrival_time: {
        type: Date,
        label: "Expected arrival date",
    },
    status: {
        type: String,
        label: "Current state",
        max: 15,
    },
    history: {
        type: Array,
        label: "History",
    },
    'history.$': {
        type: Object,
    },
    'history.$.status': {
        type: String,
    },
    'history.$.time': {
        type: Date,
    },
    'history.$.user': {
        type: String
    },
    // '': {},
});