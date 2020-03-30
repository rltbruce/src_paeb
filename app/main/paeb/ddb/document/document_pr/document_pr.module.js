(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.document.document_pr', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_document_document_pr', {
            url      : '/donnees-de-base/document_pr',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/document/document_pr/document_pr.html',
                    controller : 'Document_prController as vm'
                }
            },
            bodyClass: 'document_pr',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "document_pr"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.document.document_pr', {
            title: 'Partenaire relai',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_document_document_pr'
        });
    }

})();
