(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.divers_attachement.divers_attachement_batiment', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_divers_attachement_divers_attachement_batiment', {
            url      : '/donnees-de-base/divers_attachement_batiment',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/divers_attachement/divers_attachement_batiment/divers_attachement_batiment.html',
                    controller : 'Divers_attachement_batimentController as vm'
                }
            },
            bodyClass: 'divers_attachement_batiment',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "divers_attachement_batiment"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.divers_attachement.divers_attachement_batiment', {
            title: 'Batiment',
            icon  : 'icon-view-stream',
            state: 'app.paeb_ddb_divers_attachement_divers_attachement_batiment',
            weight: 1
        });
    }

})();
