(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.situation_participant_sep', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_situation_participant_sep', {
            url      : '/donnees-de-base/situation_participant_sep',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/situation_participant_sep/situation_participant_sep.html',
                    controller : 'Situation_participant_sepController as vm'
                }
            },
            bodyClass: 'situation_participant_sep',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "situation_participant_sep"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.situation_participant_sep', {
            title: 'Fonction SEP',
            icon  : 'icon-clipboard-text',
            state: 'app.paeb_ddb_situation_participant_sep'
        });
    }

})();
