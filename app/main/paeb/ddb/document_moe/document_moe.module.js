(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.document_moe', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_document_moe', {
            url      : '/donnees-de-base/document_moe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/document_moe/document_moe.html',
                    controller : 'Document_moeController as vm'
                }
            },
            bodyClass: 'document_moe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "document_moe"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.document_moe', {
            title: 'Document MOE',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_document_moe'
        });
    }

})();
