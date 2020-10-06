(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.divers_attachement.divers_attachement_latrine', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_divers_attachement_divers_attachement_latrine', {
            url      : '/donnees-de-base/divers_attachement_latrine',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/divers_attachement/divers_attachement_latrine/divers_attachement_latrine.html',
                    controller : 'Divers_attachement_latrineController as vm'
                }
            },
            bodyClass: 'divers_attachement_latrine',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "divers_attachement_latrine"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.divers_attachement.divers_attachement_latrine', {
            title: 'Latrine',
            icon  : 'icon-view-stream',
            state: 'app.paeb_ddb_divers_attachement_divers_attachement_latrine',
            weight: 1
        });
    }

})();
