(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.document', [
            'app.paeb.ddb.document.document_feffi',
            'app.paeb.ddb.document.document_moe',
            'app.paeb.ddb.document.document_prestataire',
            'app.paeb.ddb.document.document_pr',
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.document', {
            title : 'Document',
            icon  : 'icon-clipboard-text',
            weight: 14
        });
    }

})();
