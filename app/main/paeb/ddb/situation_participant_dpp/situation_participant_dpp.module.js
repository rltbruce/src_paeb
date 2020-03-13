(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.situation_participant_dpp', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_situation_participant_dpp', {
            url      : '/donnees-de-base/situation_participant_dpp',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/situation_participant_dpp/situation_participant_dpp.html',
                    controller : 'Situation_participant_dppController as vm'
                }
            },
            bodyClass: 'situation_participant_dpp',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "situation_participant_dpp"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.situation_participant_dpp', {
            title: 'Fonction DPP',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_situation_participant_dpp'
        });
    }

})();
