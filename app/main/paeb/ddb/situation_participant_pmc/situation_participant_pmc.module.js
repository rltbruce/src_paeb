(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.situation_participant_pmc', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_situation_participant_pmc', {
            url      : '/donnees-de-base/situation_participant_pmc',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/situation_participant_pmc/situation_participant_pmc.html',
                    controller : 'Situation_participant_pmcController as vm'
                }
            },
            bodyClass: 'situation_participant_pmc',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "situation_participant_pmc"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.situation_participant_pmc', {
            title: 'Fonction PMC',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_situation_participant_pmc'
        });
    }

})();
