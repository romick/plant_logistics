if (Meteor.isServer) {
    Meteor.startup(() => {
        var users = [{
            name: "roman.milovanov",
            email: "roman.milovanov@bekaert.com",
            roles: [
                'admin',
                'add-shipments',
                'mark-shipments-arrived',
                'mark-shipments-entered',
                'mark-shipments-loaded',
                'mark-shipments-unloaded',
                'mark-shipments-documented',
                'mark-shipments-left',
                'cancel-shipments',

            ]
        }, {
            name: "anastasia.eremina",
            email: "anastasia.eremina@bekaert.com",
            roles: [
                'add-shipments',
                'mark-shipments-documented',
                'cancel-shipments',
            ]
        }, {
            name: "julia.chukhno",
            email: "julia.chukhno@bekaert.com",
            roles: [
                'mark-shipments-loaded',
                'mark-shipments-unloaded',

            ]
        }, {
            name: "security",
            email: "security@bekaert.com",
            roles: [
                'mark-shipments-arrived',
                'mark-shipments-entered',
                'mark-shipments-left',

            ]
        }];

        _.each(users, function(user) {
            var id;
            var existingUser;
            // console.log(user.email);
            existingUser = Accounts.findUserByEmail(user.email);
            // console.log(existingUser);
            if (existingUser != null) {
                id = existingUser._id;

                // console.log(id);
                Accounts.setUsername(id, user.name);
            } else {
                id = Accounts.createUser({
                    email: user.email,
                    password: "apple1",
                    username: user.name,
                    profile: {
                        name: user.name
                    }
                });
            }


            if (user.roles.length > 0) {
                // Need _id of existing user record so this call must come
                // after `Accounts.createUser` or `Accounts.onCreate`
                Roles.addUsersToRoles(id, user.roles);
            }

        });
    });
}