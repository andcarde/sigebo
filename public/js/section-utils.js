
// section-utils.js
'use strict';

function create$$(section) {
    const $$ = (name) => {
        const fullName = section + '-' + name;
        const id = `#${fullName}`;
        const _class = `.${fullName}`;

        const domElement = $(id);
        if (domElement.length > 0)
            return domElement;
        
        const domElements = $(_class);
        return domElements;
    }

    return $$;
}

// exports create$$ function