// traze.js
'use strict';

$(document).ready(() => {
    const $id = $('#traze-id');
    const $state = $('#traze-state');
    const $tree = $('#traze-tree');
    const $search = $('#traze-search');
    $search.on('click', fetchWineData);

    function fetchWineData() {
        const wineId = $id.val().trim();

        if (typeof wineId !== 'string' || wineId.length === 0) {
            alert('Please enter a Wine ID.');
            return;
        }

        const wineData = getTrazability(wineId);

        clearDisplay();
        if (wineData === null)
            alert(`No traceability data found for ID: ${wineId}`);
        else {
            updateState(wineData);
            updateTree(wineData);
        }
    }

    function clearDisplay() {
        $state.empty();
        $tree.empty();
    }

    function updateState(data) {
        if (data.children && data.children.length > 0) {
            const variety = calculateExitVariety(data);
            $.each(variety, (type, percentage) => {
                $('<p>')
                    .text(`${type}: ${(percentage * 100).toFixed(2)}%`)
                    .appendTo($state);
            });
        } else {
            $('<p>')
                .text('No data available for this wine.')
                .appendTo($state);
        }
    }
    function calculateExitVariety(data) {
        let variety = calculateVariety(data);
        $.each(variety, (type, amount) => {
            variety[type] = amount / data.quantity;
        });
        return variety;
    }

    function calculateVariety(node) {
        let variety = {};

        if (node.type === 'Entry') {
            $.each(node.variety, (type, percentage) => {
                variety[type] = (variety[type] || 0) + percentage * node.quantity;
            });
        } else if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                const childVariety = calculateVariety(child);
                $.each(childVariety, (type, amount) => {
                    variety[type] = (variety[type] || 0) + amount;
                });
            });
        }

        return variety;
    }

    function updateTree(data) {
        const $rootNode = buildTree(data);
        $tree.append($rootNode);
    }

    function buildTree(node) {
        const $li = $('<li>')
            .text(node.type === 'Entry' ? `${node.plot} (Entry)` : node.name)
            .on('click', toggleVisibility);

        if (node.children && node.children.length > 0) {
            const $ul = $('<ul>')
                .addClass('tree hidden');
            node.children.forEach(child => {
                $ul.append(buildTree(child));
            });
            $li.append($ul);
        }

        return $li;
    }

    function toggleVisibility(event) {
        const $childList = $(event.currentTarget).children('ul');
        if ($childList.length > 0) {
            $childList.toggleClass('hidden');
        }
    }
});