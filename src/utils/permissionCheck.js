const flatPermissions = {
    Accounts: {
        'Inward Current stock': 'view',
        'Main Stock': 'view',
        'Finished Goods': 'view',
        'Invoice Creation': 'fullAccess',
        'Purchase Order Creation': 'fullAccess',
    },

    Store: {
        'Purchase Order Creation': 'view',
        'Main Stock': 'fullAccess',
        'Finished Goods': 'fullAccess',
        // 'Quarantine': 'fullAccess',
        'Material Assignment': 'fullAccess',
        // 'Return Material (New)': 'fullAccess',
        'Gate Entry': 'fullAccess',
    },

    Production: {
        'Request creation for material': 'fullAccess',
        'Full Production flow': 'fullAccess',
        'Process Order': 'fullAccess',
        'Production Order Out': 'fullAccess',
    },

    Quality: {
        'Process Order': 'fullAccess',
        'Quality Parameters': 'fullAccess',
        'Quality Check Inward': 'fullAccess',
        'Quality Check Final': 'fullAccess',
        'Rework': 'fullAccess',
    },

    // Admin has more access than regular users but might have some restricted areas
    Admin: {
        'Inward Current stock': 'fullAccess',
        'Main Stock': 'fullAccess',
        'Finished Goods': 'fullAccess',
        'Invoice Creation': 'fullAccess',
        'Purchase Order Creation': 'fullAccess',
        'Purchase Order': 'view',
        'Material Assignment': 'fullAccess',
        'Gate Entry/Exit/Return': 'view',
        'Return Material (New)': 'fullAccess',
        'Quarantine': 'view',
        'Production Order Out': 'view',
        'Inward Quality Check': 'fullAccess',
        'QC Parameters': 'fullAccess',
        'Rework': 'fullAccess',
        'Final Quality Inspection': 'fullAccess',
        'Process Order': 'fullAccess',
        'Production Order Creation': 'fullAccess',
        'Request Creation For Materials': 'fullAccess',
        'Bill Of Material': 'fullAccess',
        'Material Assignment': 'fullAccess',
        'Production Order Creation Output': 'fullAccess',
        'Tracebility': 'fullAccess',
        'Vendor Management': 'fullAccess',
        'Gate Entry': 'fullAccess',
        'Out Of Stock': 'fullAccess',
        'Logs': 'fullAccess'

    },

    // Super Admin has full access to everything
    SuperAdmin: {
        'Inward Current stock': 'fullAccess',
        'Inward Quality Check': 'fullAccess',
        'Main Stock': 'fullAccess',
        'Finished Goods': 'fullAccess',
        'Invoice Creation': 'fullAccess',
        'Purchase Order Creation': 'fullAccess',
        'Purchase Order': 'fullAccess',
        'Material Assignment': 'fullAccess',
        'Gate Entry/Exit/Return': 'fullAccess',
        'Return Material (New)': 'fullAccess',
        'Quarantine': 'fullAccess',
        'Production Order Out': 'fullAccess',
        'Process Order': 'fullAccess',
        'Quality Parameters': 'fullAccess',
        'Quality Check Inward': 'fullAccess',
        'Quality Check Final': 'fullAccess',
        'Rework': 'fullAccess',
        'Full Production flow': 'fullAccess',
        'Request creation for material': 'fullAccess',
        'Logs': 'fullAccess'
    }
};





const hasPermission = (title, userRole = null) => {
    // Determine the role to use: either the passed userRole or fetch from localStorage
    let role = userRole;

    if (!role) {
        try {
            const adminData = JSON.parse(localStorage.getItem('admin'));
            role = adminData?.role;
        } catch (error) {
            console.error('Error parsing admin data from localStorage', error);
        }
    }

    // Return false if no role is found
    if (!role) {
        return false;
    }

    const rolePermission = flatPermissions[role];
    if (rolePermission) {
        // Convert the title to lowercase to make the check case-insensitive
        const lowerCaseTitle = title.toLowerCase();

        // Convert the keys in rolePermission to lowercase and check if the title exists
        const matchingTitle = Object.keys(rolePermission).find(
            key => key.toLowerCase() === lowerCaseTitle
        );

        if (matchingTitle) {
            // Return the permission level for the matched title (case-insensitive)
            return rolePermission[matchingTitle];
        }
    }

    return false; // No permission found
};



export { hasPermission }