(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.situation_participant_emies', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_situation_participant_emies', {
            url      : '/donnees-de-base/situation_participant_emies',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/situation_participant_emies/situation_participant_emies.html',
                    controller : 'Situation_participant_emiesController as vm'
                }
            },
            bodyClass: 'situation_participant_emies',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "situation_participant_emies"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.situation_participant_emies', {
            title: 'Fonction EMIES',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_situation_participant_emies'
        });
    }

})();
