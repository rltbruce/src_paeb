(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.document.document_feffi', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_document_document_feffi', {
            url      : '/donnees-de-base/document_feffi',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/document/document_feffi/document_feffi.html',
                    controller : 'Document_feffiController as vm'
                }
            },
            bodyClass: 'document_feffi',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "document_feffi"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.document.document_feffi', {
            title: 'Feffi',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_document_document_feffi'
        });
    }

})();
