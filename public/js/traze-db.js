
// trazability-db.js
'use strict';

const wineTrazabilityData = {
    'L1': {
        type: 'Exit',
        name: 'L2021/1',
        date: '2021-05-01',
        quantity: 900,
        children: [
            {
                type: 'Intermediate',
                name: 'L2020/4',
                container: 'B1',
                children: [
                    {
                        type: 'Entry',
                        id: 45,
                        plot: 'A1',
                        date: '2020-09-01',
                        quantity: 100,
                        variety: { 'Merlot': 0.5, 'Cabernet Sauvignon': 0.5 }
                    },
                    {
                        type: 'Entry', id: 46, plot: 'A2', date: '2020-09-01',
                        quantity: 300,
                        variety: { 'Merlot': 0.5, 'Cabernet Sauvignon': 0.5 }
                    }
                ]
            },
            {
                type: 'Intermediate',
                name: 'L2020/5',
                container: 'B2',
                children: [
                    {
                        type: 'Intermediate',
                        name: 'L2020/3',
                        container: 'A2',
                        children: [
                            {
                                type: 'Entry', id: 47, plot: 'A3', date: '2020-09-01',
                                quantity: 200,
                                variety: { 'Merlot': 0.5, 'Cabernet Sauvignon': 0.5 }
                            },
                            {
                                type: 'Entry', id: 48, plot: 'A4', date: '2020-09-01',
                                quantity: 100,
                                variety: { 'Merlot': 0.5, 'Cabernet Sauvignon': 0.5 }
                            }
                        ]
                    },
                    {
                        type: 'Entry', id: 49, plot: 'A5', date: '2020-09-01',
                        quantity: 200,
                        variety: { 'Merlot': 0.5, 'Cabernet Sauvignon': 0.5 }
                    }
                ]
            }
        ]
    },
    'L3': {
        type: 'Exit',
        name: 'L2021/2',
        date: '2021-04-27',
        quantity: 500,
        children: [
            {
                type: 'Intermediate',
                name: 'L2020/6',
                container: 'B3',
                children: [
                    {
                        type: 'Entry', id: 50, plot: 'A6', date: '2020-09-01',
                        quantity: 200,
                        variety: { 'Merlot': 0.5, 'Cabernet Sauvignon': 0.5 },
                    },
                    {
                        type: 'Entry', id: 51, plot: 'A7', date: '2020-09-01',
                        quantity: 300,
                        variety: { 'Merlot': 0.5, 'Cabernet Sauvignon': 0.5 }
                    }
                ]
            }
        ]
    },
    'L5': {
        type: 'Exit',
        name: 'L2021/3',
        date: '2021-04-22',
        quantity: 800,
        children: [
            {
                type: 'Intermediate',
                name: 'L2020/7',
                container: 'B4',
                children: [
                    {
                        type: 'Intermediate',
                        name: 'L2020/8',
                        container: 'A8',
                        children: [
                            {
                                type: 'Entry', id: 52, plot: 'A8', date: '2020-09-01',
                                quantity: 300,
                                variety: { 'Merlot': 0.5, 'Cabernet Sauvignon': 0.5 }
                            },
                            {
                                type: 'Entry', id: 53, plot: 'A9', date: '2020-09-01',
                                quantity: 200,
                                variety: { 'Albillo': 0.3, 'Maturana': 0.7 }
                            }
                        ]
                    },
                    {
                        type: 'Intermediate',
                        name: 'L2020/9',
                        container: 'A9',
                        children: [
                            {
                                type: 'Entry', id: 54, plot: 'A10', date: '2020-09-01',
                                quantity: 100,
                                variety: { 'Albillo': 0.8, 'Macabeo': 0.2 }
                            },
                            {
                                type: 'Entry', id: 55, plot: 'A11', date: '2020-09-01',
                                quantity: 200,
                                variety: { 'Albillo': 0.5, 'Merlot': 0.5 }
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

function getTrazability(id) {
    if (wineTrazabilityData.hasOwnProperty(id))
        return wineTrazabilityData[id];
    else
        return null;
}

// Example usage
console.log(getTrazability('L1'));
console.log(getTrazability('L3'));