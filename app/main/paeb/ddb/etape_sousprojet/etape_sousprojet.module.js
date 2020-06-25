(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.etape_sousprojet', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_etape_sousprojet', {
            url      : '/donnees-de-base/etape_sousprojet/etape_sousprojet',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/etape_sousprojet/etape_sousprojet.html',
                    controller : 'Etape_sousprojetController as vm'
                }
            },
            bodyClass: 'etape_sousprojet',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "etape_sousprojet"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.etape_sousprojet', {
            title: 'Etape sous projet',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_etape_sousprojet',
            weight: 12

        });
    }

})();
