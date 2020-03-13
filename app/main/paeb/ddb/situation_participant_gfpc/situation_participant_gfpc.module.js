(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.situation_participant_gfpc', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_situation_participant_gfpc', {
            url      : '/donnees-de-base/situation_participant_gfpc',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/situation_participant_gfpc/situation_participant_gfpc.html',
                    controller : 'Situation_participant_gfpcController as vm'
                }
            },
            bodyClass: 'situation_participant_gfpc',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "situation_participant_gfpc"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.situation_participant_gfpc', {
            title: 'Fonction GFPC',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_situation_participant_gfpc'
        });
    }

})();
