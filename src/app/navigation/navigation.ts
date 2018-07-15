import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'applications',
        title: 'Applications',
        translate: 'NAV.APPLICATIONS',
        type: 'group',
        icon: 'apps',
        children: [
            {
                id: 'dashboards',
                title: 'Dashboards',
                translate: 'NAV.DASHBOARDS',
                type: 'collapsable',
                icon: 'dashboard',
                children: [
                    {
                        id: 'analytics',
                        title: 'Analytics',
                        type: 'item',
                        url: '/apps/dashboards/analytics'
                    },
                    {
                        id: 'project',
                        title: 'Project',
                        type: 'item',
                        url: '/apps/dashboards/project'
                    }
                ]
            },
            {
                id: 'e-commerce',
                title: 'E-Commerce',
                translate: 'NAV.ECOMMERCE',
                type: 'collapsable',
                icon: 'shopping_cart',
                children: [
                    {
                        id: 'dashboard',
                        title: 'Dashboard',
                        translate: 'NAV.DASHBOARDS',
                        type: 'item',
                        url: '/apps/e-commerce/dashboard'
                    },
                    {
                        id: 'warehouse',
                        title: 'Warehouse',
                        translate: 'NAV.WAREHOUSE.TITLE',
                        type: 'collapsable',
                        badge: {
                            title: '3',
                            translate: 'NAV.WAREHOUSE.BADGE',
                            bg: '#F44336',
                            fg: '#FFFFFF'
                        },
                        children: [
                            {
                                id: 'stock-items',
                                title: 'Stock Items',
                                type: 'item',
                                url: '/apps/e-commerce/warehouse/stock-items',
                                exactMatch: true
                            },
                            {
                                id: 'orders',
                                title: 'Orders',
                                type: 'item',
                                url: '/apps/e-commerce/warehouse/orders',
                                exactMatch: true
                            },
                            {
                                id: 'colors',
                                title: 'Colors',
                                type: 'item',
                                url: '/apps/e-commerce/warehouse/colors',
                                exactMatch: true
                            },
                            {
                                id: 'package-types',
                                title: 'Package Types',
                                type: 'item',
                                url: '/apps/e-commerce/warehouse/package-types',
                                exactMatch: true
                            },
                            {
                                id: 'stock-groups',
                                title: 'Stock Groups',
                                type: 'item',
                                url: '/apps/e-commerce/warehouse/stock-groups',
                                exactMatch: true
                            },
                        ]
                    },
                    {
                        id: 'general',
                        title: 'General',
                        translate: 'NAV.GENERAL.TITLE',
                        type: 'collapsable',
                        badge: {
                            title: '8',
                            translate: 'NAV.GENERAL.BADGE',
                            bg: '#F44336',
                            fg: '#FFFFFF'
                        },
                        children: [
                            {
                                id: 'cities',
                                title: 'Cities',
                                type: 'item',
                                url: '/apps/e-commerce/general/cities',
                                exactMatch: true
                            },
                            {
                                id: 'countries',
                                title: 'Countries',
                                type: 'item',
                                url: '/apps/e-commerce/general/countries',
                                exactMatch: true
                            },
                            {
                                id: 'deliveryMethods',
                                title: 'Delivery Methods',
                                type: 'item',
                                url: '/apps/e-commerce/general/delivery-methods',
                                exactMatch: true
                            },
                            {
                                id: 'people',
                                title: 'People',
                                type: 'item',
                                url: '/apps/e-commerce/general/people',
                                exactMatch: true
                            },
                            {
                                id: 'stateProvinces',
                                title: 'State Provinces',
                                type: 'item',
                                url: '/apps/e-commerce/general/state-provinces',
                                exactMatch: true
                            },
                            {
                                id: 'languages',
                                title: 'Languages',
                                type: 'item',
                                url: '/apps/e-commerce/general/languages',
                                exactMatch: true
                            },
                            {
                                id: 'addresses',
                                title: 'Addresses',
                                type: 'item',
                                url: '/apps/e-commerce/general/addresses',
                                exactMatch: true
                            },
                            {
                                id: 'addressTypes',
                                title: 'Address Types',
                                type: 'item',
                                url: '/apps/e-commerce/general/address-types',
                                exactMatch: true
                            }
                        ]
                    },
                    {
                        id: 'purchasing',
                        title: 'Purchasing',
                        translate: 'NAV.PURCHASING.TITLE',
                        type: 'collapsable',
                        badge: {
                            title: '2',
                            translate: 'NAV.PURCHASING.BADGE',
                            bg: '#F44336',
                            fg: '#FFFFFF'
                        },
                        children: [
                            {
                                id: 'suppliers',
                                title: 'Suppliers',
                                type: 'item',
                                url: '/apps/e-commerce/purchasing/suppliers',
                                exactMatch: true
                            },
                            {
                                id: 'supplierCategories',
                                title: 'Supplier Categories',
                                type: 'item',
                                url: '/apps/e-commerce/purchasing/supplier-categories',
                                exactMatch: true
                            }
                        ]
                    },
                    {
                        id: 'sales',
                        title: 'Sales',
                        translate: 'NAV.SALES.TITLE',
                        type: 'collapsable',
                        badge: {
                            title: '2',
                            translate: 'NAV.PURCHASING.BADGE',
                            bg: '#F44336',
                            fg: '#FFFFFF'
                        },
                        children: [
                            {
                                id: 'customers',
                                title: 'Customers',
                                type: 'item',
                                url: '/apps/e-commerce/sales/customers',
                                exactMatch: true
                            },
                            {
                                id: 'buyingGroups',
                                title: 'Buying Groups',
                                type: 'item',
                                url: '/apps/e-commerce/sales/buying-groups',
                                exactMatch: true
                            },
                            {
                                id: 'customerCategories',
                                title: 'Customer Categories',
                                type: 'item',
                                url: '/apps/e-commerce/sales/customer-categories',
                                exactMatch: true
                            }
                        ]
                    },
                ]
            }
        ]
    },
    {
        id: 'pages',
        title: 'Pages',
        type: 'group',
        icon: 'pages',
        children: []
    },
];
