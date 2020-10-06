(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.divers_attachement.divers_attachement_mobilier', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_divers_attachement_divers_attachement_mobilier', {
            url      : '/donnees-de-base/divers_attachement_mobilier',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/divers_attachement/divers_attachement_mobilier/divers_attachement_mobilier.html',
                    controller : 'Divers_attachement_mobilierController as vm'
                }
            },
            bodyClass: 'divers_attachement_mobilier',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "divers_attachement_mobilier"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.divers_attachement.divers_attachement_mobilier', {
            title: 'Mobilier',
            icon  : 'icon-view-stream',
            state: 'app.paeb_ddb_divers_attachement_divers_attachement_mobilier',
            weight: 1
        });
    }

})();
