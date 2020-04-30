(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.document.document_prestataire', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_document_document_prestataire', {
            url      : '/donnees-de-base/document_prestataire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/document/document_prestataire/document_prestataire.html',
                    controller : 'Document_prestataireController as vm'
                }
            },
            bodyClass: 'document_prestataire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "document_prestataire"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.document.document_prestataire', {
            title: 'MPE',
            icon  : 'icon-clipboard-outline',
            state: 'app.paeb_ddb_document_document_prestataire'
        });
    }

})();
