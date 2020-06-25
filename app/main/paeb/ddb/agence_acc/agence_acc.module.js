(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.agence_acc', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_agence_acc', {
            url      : '/donnees-de-base/agence_acc',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/agence_acc/agence_acc.html',
                    controller : 'Agence_accController as vm'
                }
            },
            bodyClass: 'agence_acc',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "agence_acc"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.agence_acc', {
            title: 'agence accompagnement',
            icon  : 'icon-nfc-variant',
            state: 'app.paeb_ddb_agence_acc',
			weight: 9
        });
    }

})();
